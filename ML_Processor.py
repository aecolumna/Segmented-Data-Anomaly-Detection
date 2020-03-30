# load the libraries
import json
import copy
import itertools
import operator
import numpy as np
import pandas as pd
import sklearn
from sklearn import svm
from sklearn.linear_model import LassoCV
from sklearn.linear_model import SGDClassifier
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

UPPER = 1
LOWER = 0

class ml_processor:

    def __init__(self, data_frame, test_size=0.50, lasso=True, random_forest=True, random_state=42):
        self.data = data_frame.copy()
        self.test_size = test_size
        self.lasso = lasso
        self.random_forest = random_forest
        self.random_state = random_state
        self.slow = []
        self.very_slow = []
        self.error = []
        self.clusters = {'slow': self.slow, 'very_slow': self.very_slow, 'error': self.error}
        
        self.df_slow = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 1)]

        self.df_very_slow = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 2)]
        self.df_very_slow['anomalous'].mask((self.data['anomalous'] == 2),1,inplace=True)

        self.df_error = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 3)]
        self.df_error['anomalous'].mask((self.data['anomalous'] == 3),1,inplace=True)

        df_clusters = [self.df_slow, self.df_very_slow, self.df_error]
        
        for idx, cluster in enumerate(self.clusters):
            if(len(np.unique(df_clusters[idx]['anomalous'])) > 1):
                self.clusters[cluster] = self.__train(df_clusters[idx])
        self.json_clusters = json.dumps(self.clusters)
        
    # function for returning for slicing condition
    def __condition_combination(self, index_vals, features, thresholds):
        condition = True
        for idx in index_vals:
            condition = condition & (self.X[features[idx]] >= thresholds[idx][LOWER]) & (self.X[features[idx]] <= thresholds[idx][UPPER])
        return condition
    
    def __true_positve(self, tree):
        p = tree.predict(self.X)
        true_p_df = self.X[(p == 1) & (p == self.y)].copy()
        return true_p_df.to_numpy(), tree.decision_path(true_p_df).toarray()
    
    def __get_thresholds(self, tree, feature_thresholds):
        true_p_matrix, true_paths = self.__true_positve(tree)
        for n, row in enumerate(true_paths):
            for idx in np.nonzero(row)[-1][:-1]:
                feature_index, threshold, upper_lower = self.__get_threshold(n, idx, true_p_matrix, tree)
                feature_thresholds[feature_index][upper_lower].append(threshold)
        return feature_thresholds
        
    def __get_threshold(self, n, idx, true_p_matrix, tree):
        upper_lower = 1
        if(true_p_matrix[n,tree.tree_.feature[idx]] > tree.tree_.threshold[idx]):
            upper_lower = 0
        return tree.tree_.feature[idx], tree.tree_.threshold[idx], upper_lower
    
    def __get_feature_ranges(self, features, feature_thresholds):
        for idx in range(len(feature_thresholds)):
            if not feature_thresholds[idx][LOWER]:
                feature_thresholds[idx][LOWER].append(0)
                if not feature_thresholds[idx][UPPER]:
                    feature_thresholds[idx][UPPER].append(0)
            elif not feature_thresholds[idx][UPPER]:
                feature_thresholds[idx][UPPER].append(max(self.X[features[idx]]))
            elif(min(feature_thresholds[idx][LOWER]) >= max(feature_thresholds[idx][UPPER])):
                feature_thresholds[idx][LOWER].append(0)
        return [[min(th[LOWER]),max(th[UPPER])] for th in feature_thresholds]        
            
    def __train(self, df):
        if(self.random_forest):
            clf = RandomForestClassifier(n_estimators=2*(df.shape[1]+1))
        else:
            clf = tree.DecisionTreeClassifier()
        features = list(self.data.columns)[:-1]        
        self.X = df[features[:-1]].copy()
        self.y = df['anomalous'].copy()
        if self.lasso:
            reg = LassoCV(cv=5, random_state=self.random_state, normalize=True, fit_intercept=False).fit(self.X, self.y)
            updated_features = np.array(features)[np.where(reg.coef_ != 0)]
            features = list(updated_features)
            self.X = self.X[features]
        X_train, X_test, y_train, y_test = train_test_split(self.X, self.y, test_size=self.test_size, random_state=self.random_state)
        clf = clf.fit(X_train, y_train)
        score = clf.score(X_test, y_test)
        ranked_features = []
        ranked_thresholds = []
        feature_ranges = self.__get_metrics(clf, features)
        for idx in np.argsort(clf.feature_importances_)[::-1]:
            ranked_features.append(features[idx])
            ranked_thresholds.append(feature_ranges[idx])
        importances = np.array(sorted(clf.feature_importances_, reverse=True))
        cluster = self.__get_diagnostics(ranked_features, importances, ranked_thresholds)
        return cluster
    
    def __get_metrics(self, clf, features):
        feature_thresholds = [[[],[]] for x in features]
        feature_ranges = None
        if(self.random_forest):
            for tree in clf.estimators_:
                feature_thresholds = self.__get_thresholds(tree, feature_thresholds)
        else:
            feature_thresholds = self.__get_thresholds(clf, feature_thresholds)
        feature_ranges = self.__get_feature_ranges(features, feature_thresholds)
        return feature_ranges

    def __get_diagnostics(self, features, importances, thresholds):
        recall = []
        precision = []
        f1_scores = []
        accuracy = []
        feature_indices = []
        N = sum(importances > 0.15)
        for idx in range(1,N+1):
            # generate the lists of index values for any combination of i important features to include
            results = itertools.combinations(range(N),idx)
            results = list(results)
            for index_vals in results:
                #get condition for slicing the data frame
                condition = self.__condition_combination(index_vals, features, thresholds)
                if self.X[condition].shape[0]:
                    recall.append(round(self.X[condition & (self.y==1)].shape[0]/sum(self.y == 1),2))
                    precision.append(round(self.X[condition & (self.y==1)].shape[0]/self.X[condition].shape[0], 2))
                    f1_scores.append(2*recall[-1]*precision[-1]/(recall[-1]+precision[-1]))
                    accuracy.append((self.X[condition & (self.y==1)].shape[0] + self.X[~(condition) & (self.y==0)].shape[0])/self.X.shape[0])
                    feature_indices.append(index_vals)
        N = min(3, sum(np.array(f1_scores) >= .7*max(f1_scores)))
        np_features = np.array(features)
        feat_thresh_re_pre_f1_acc = {'features':[], 'thresholds':[], 'recall':[], 'precision':[], 'f1_score':[], 'accuracy':[]}
        for idx in np.argsort(f1_scores)[::-1][:N]:
            feat_thresh_re_pre_f1_acc.setdefault('features', []).append(np_features[feature_indices[idx]])
            feat_thresh_re_pre_f1_acc.setdefault('thresholds', []).append(thresholds[idx])
            feat_thresh_re_pre_f1_acc.setdefault('recall', []).append(recall[idx])
            feat_thresh_re_pre_f1_acc.setdefault('precision', []).append(precision[idx])
            feat_thresh_re_pre_f1_acc.setdefault('f1_score', []).append(f1_scores[idx])
            feat_thresh_re_pre_f1_acc.setdefault('accuracy', []).append(accuracy[idx])
        return feat_thresh_re_pre_f1_acc