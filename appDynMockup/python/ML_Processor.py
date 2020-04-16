# load the libraries
import json
import copy
import itertools
import operator
import numpy as np
import pandas as pd
import sklearn
from sklearn.linear_model import LassoCV
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_selection import SelectFromModel
from sklearn.model_selection import train_test_split

UPPER = 1
LOWER = 0


class ml_processor:

    def __init__(self, data_frame, test_size=0.50, importances_threshold=0.15, feature_selection=True, random_forest=True,
                 random_state=42):
        """
        Initializes the class object calls the necessary functions to generate the nested dictionaries
        that contain anomalous analysis. It does not return anything.
        :param data_frame: A pandas data frame containing the transaction data and anomalous labels.
        :param test_size: Portion of data to be kept from training and to be used for testing the Random Forest
        Accuracy if desired.
        :param lasso: Boolean that determines whether or not the feature space will be shrunken using the
        lasso technique.
        :param random_forest: Boolean that determines whether or not the random forest or decision tree learning method
        will be used.
        :param random_state: The random_state that will be used for the chosen ML methods.
        """
        self.data = data_frame.copy()
        self.test_size = test_size
        self.importances_threshold = importances_threshold
        self.feature_selection = feature_selection
        self.random_forest = random_forest
        self.random_state = random_state
        self.clusters = {'homepage': {'total_count': None, 'anomalous_percent': None, 'slow_percent': None,
                                      'slow_percent_total': None, 'very_slow_percent': None, 'very_slow_percent_total': None, 
                                      'error_percent': None, 'error_percent_total': None, 
                                      'normal_x': None, 'normal_y': None, 'slow_x': None, 'slow_y': None,
                                      'very_slow_x': None, 'very_slow_y': None, 'error_x': None, 'error_y': None},
                         'slow': None, 'very_slow': None, 'error': None, 'all_anomalies': None}

        self.__df_slow = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 1)]

        self.__df_very_slow = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 2)]
        self.__df_very_slow['anomalous'].mask((self.data['anomalous'] == 2), 1, inplace=True)

        self.__df_error = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 3)]
        self.__df_error['anomalous'].mask((self.data['anomalous'] == 3), 1, inplace=True)

        self.__df_all_anomalies = self.data.copy()
        self.__df_all_anomalies['anomalous'].mask((self.data['anomalous'] != 0), 1, inplace=True)
        
        df_clusters = [self.__df_slow, self.__df_very_slow, self.__df_error, self.__df_all_anomalies]
        anomalies = ['slow', 'very_slow', 'error', 'all_anomalies']
        counts = [sum(self.__df_slow['anomalous']), sum(self.__df_very_slow['anomalous']),
                  sum(self.__df_error['anomalous']), sum(self.__df_all_anomalies['anomalous'])]

        for idx, key in enumerate(anomalies):
            if (counts[idx]):
                self.clusters[key] = self.__train(df_clusters[idx], idx + 1)

        if(counts[3]):
            self.__get_counts(anomalies[:-1], counts[:-1], df_clusters[:-1])
        self.json_clusters = json.dumps(self.clusters)

    def __get_counts(self, anomalies, counts, df_clusters):
        """
        Takes in a list of anomaly names, a list of counts for the named anomalies, and a list of data frames
        corresponding to the named anomalies. Then it performs some calculations and stores the results in the
        self.clusters dictionary. It does not return anything.
        :param anomalies: List containing the names of different types of anomalies ie "slow".
        :param counts: List of counts indicating how many transactions there of each type of named anomaly
        :param df_clusters: List of data frames corresponding to the named anomalies. Each data frame contains
        the transactions of one and only one of the anomaly types and all of the normal transactions.
        """
        total = self.data.shape[0]
        total_anomalies = sum(counts)
        suffixes = ['_percent', '_x', '_y']
        self.clusters['homepage']['total_count'] = total
        self.clusters['homepage']['anomalous_percent'] = round(total_anomalies / self.data.shape[0], 3)
        self.clusters['homepage']['normal_x'] = list(self.data['eventTimestamp'][(self.data['anomalous'] == 0)])
        self.clusters['homepage']['normal_y'] = list(self.data['responseTime'][(self.data['anomalous'] == 0)])
        for idx, anomaly in enumerate(anomalies):
            self.clusters['homepage'][anomaly + '_percent'] = round(counts[idx] / total_anomalies, 3)
            self.clusters['homepage'][anomaly + '_percent_total'] = round(counts[idx] / total, 3)
            self.clusters['homepage'][anomaly + '_x'] = list(
                df_clusters[idx]['eventTimestamp'][df_clusters[idx]['anomalous'] == 1])
            self.clusters['homepage'][anomaly + '_y'] = list(
                df_clusters[idx]['responseTime'][df_clusters[idx]['anomalous'] == 1])

    def __condition_combination(self, index_vals, features, thresholds):
        """
        Generates and returns a pandas series of boolean values for selecting rows from a data frame.
        :param index_vals: List of indices that correspond to features (column names) in the transaction data frame.
        :param features: List of features (column names) from the transaction data frame.
        :param thresholds: list of equal length as features containing min max range values for each feature - used for
        transaction selection.
        :return: A pandas series of boolean values for selecting rows from a a data frame.
        """
        condition = True
        for idx in index_vals:
            condition = condition & (self.data[features[idx]] >= thresholds[idx][LOWER]) & (
                    self.data[features[idx]] <= thresholds[idx][UPPER])
        return condition

    def __true_positive(self, tree):
        """
        Takes in a decision tree and returns a numpy Matrix of all the correctly classified transactions along
        with an array containing the addresses of the tree nodes accessed along the decision paths that resulted
        in the correct classifications.
        :param tree: A decision either the only one in the case of a decision tree classifier or a single member
        of a forest in the case of random forest classifier.
        :return: A numpy Matrix of all the correctly classified transactions and
        An array containing the addresses of the tree nodes accessed along the decision paths that resulted
        in the correct classifications.
        """
        p = tree.predict(self.__X)
        true_p_df = self.__X[(p == 1) & (p == self.__y)].copy()
        if (true_p_df.shape[0]):
            return true_p_df.to_numpy(), tree.decision_path(true_p_df).toarray()
        else:
            return true_p_df, true_p_df

    def __get_thresholds(self, tree, feature_thresholds):
        """
        Takes in a decision tree and a list of feature thresholds to modify. It finds additional thresholds and adds
        them to the list.
        :param tree: A decision either the only one in the case of a decision tree classifier or a single member
        of a forest in the case of random forest classifier.
        :param feature_thresholds: A list of feature thresholds each entry in the list corresponds to a feature and
        has two sub lists - one of potential lower bounds for a given feature and one of potential upper bounds.
        :return: A modified list of feature thresholds.
        """
        true_p_matrix, true_paths = self.__true_positive(tree)
        if (true_p_matrix.shape[0]):
            for n, row in enumerate(true_paths):
                for idx in np.nonzero(row)[-1][:-1]:
                    feature_index, threshold, upper_lower = self.__get_threshold(n, idx, true_p_matrix, tree)
                    feature_thresholds[feature_index][upper_lower].append(threshold)
        return feature_thresholds

    def __get_threshold(self, n, idx, true_p_matrix, tree):
        """
        Determines how a feature of a given transaction was handled by a node in a decision tree and
        returns the results
        :param n: Transaction number - used for indexing to the correct row in the data frame of transactions'
        :param idx: Address of a specific node in a decision tree.
        :param true_p_matrix: Matrix form of the transaction data frame.
        :param tree: A decision either the only one in the case of a decision tree classifier or a single member
        of a forest in the case of random forest classifier.
        :return: The feature's ID, the value of the threshold at the decision tree node, whether it was a lower or upper
        bound for transaction "n".
        """
        upper_lower = 1
        if (true_p_matrix[n, tree.tree_.feature[idx]] > tree.tree_.threshold[idx]):
            upper_lower = 0
        return tree.tree_.feature[idx], tree.tree_.threshold[idx], upper_lower

    def __get_feature_ranges(self, features, feature_thresholds):
        """
        Takes in a list of feature thresholds and returns a simplified version containing only the min and max for the
        upper and lower bound sub arrays within feature_thresholds. Additionally, some features may not have been used
        in the decision process thus dummy values of zeros added. Finally, in some instances a feature may not be very
        important and thus its upper and lower bound values could be confusing. Some logic is applied to minimize a
        lower bound or maximize an upper bound as needed in these situations.
        :param features: List of features (column names) from the transaction data frame.
        :param feature_thresholds: A list of feature thresholds each entry in the list corresponds to a feature and
        has two sub lists - one of potential lower bounds for a given feature and one of potential upper bounds.
        :return: A simplified version of feature_thresholds where the upper and lower bound sub lists have been replaced
        with their respective min and max values.
        """
        for idx, thresholds in enumerate(feature_thresholds):
            if not thresholds[LOWER]:
                thresholds[LOWER].append(0)
                if not thresholds[UPPER]:
                    thresholds[UPPER].append(0)
            elif not thresholds[UPPER]:
                thresholds[UPPER].append(max(self.__X[features[idx]]))
            elif (min(thresholds[LOWER]) >= max(thresholds[UPPER])):
                thresholds[LOWER].append(0)
        feature_ranges = [(round(min(th[LOWER]),3), round(max(th[UPPER]),3)) for th in feature_thresholds]
        # reduce the range limits
        for idx, limits in enumerate(feature_ranges):
            if(limits[LOWER] + limits[UPPER]):
                limits = (min(self.__X[features[idx]][(self.__X[features[idx]] >= limits[LOWER]) & (self.__y == 1)]),
                          max(self.__X[features[idx]][(self.__X[features[idx]] <= limits[UPPER]) & (self.__y == 1)]))
        return feature_ranges
            
    def __train(self, df, anomaly):
        """
        Performs the ML methods on the given data frame and returns a report in the form of dictionary containing the
        features of transactions and their corresponding conditions that are most highly correlated with the occurrence
        of anomalies within the transact data. It also provides precision, recall, f1 and accuracy scores of the
        identified conditions to convey how strong the correlation is.
        :param df: A pandas data frame
        :param anomaly: Integer that corresonds to the coding for types of 'anomalous activigy'.
        That is 1 = slow, 2 = very slow, and 3 = error.
        :return: A dictionary containing the analysis metrics of a given anomalous cluster
        """        
        self.__y = df['anomalous'].copy()
        features = list(self.data.columns)[:-3]
        self.__X = df[features].copy()
        if self.feature_selection:
            clf = ExtraTreesClassifier()
            clf.fit(df[features], self.__y)
            model = SelectFromModel(clf, prefit=True)
            features = [features[idx] for idx in model.get_support(indices=True)]
            self.__X = df[features].copy()
        if (self.random_forest):
            clf = RandomForestClassifier(n_estimators=(2 * len(features)) + 1)
        else:
            clf = tree.DecisionTreeClassifier()
        X_train, X_test, y_train, y_test = train_test_split(self.__X, self.__y, test_size=self.test_size,
                                                            random_state=self.random_state)
        clf = clf.fit(X_train, y_train)
        score = clf.score(X_test, y_test)
        ranked_features = []
        ranked_thresholds = []
        feature_ranges = self.__get_metrics(clf, features)
        for idx in np.argsort(clf.feature_importances_)[::-1]:
            ranked_features.append(features[idx])
            ranked_thresholds.append(feature_ranges[idx])
        importances = np.array(sorted(clf.feature_importances_, reverse=True))
        cluster = self.__get_diagnostics(ranked_features, importances, ranked_thresholds, anomaly)
        return cluster

    def __get_metrics(self, clf, features):
        """
        Takes in a classifier and list of transaction features and then generates a a list of range values withing the
        features that are correlated to anomalous behavior.
        :param clf: A Machine Learning classifier - either a single decision tree or a random forest made up of many
        decision trees
        :param features: List of features (column names) from the transaction data frame.
        :return: List of equal length as features containing min max range values for each feature - used for
        transaction selection.
        """
        feature_thresholds = [[[], []] for x in features]
        if (self.random_forest):
            for tree in clf.estimators_:
                feature_thresholds = self.__get_thresholds(tree, feature_thresholds)
        else:
            feature_thresholds = self.__get_thresholds(clf, feature_thresholds)
        feature_ranges = self.__get_feature_ranges(features, feature_thresholds)
        return feature_ranges

    def __get_diagnostics(self, features, importances, thresholds, anomaly):
        """
        Takes in transaction features and their corresponding range values and importance scores. It then iterates
        through combinations of the important features and thresholds to see which one most correlated to the anomalous
        behavior. It then returns a dictionary containing the findings.
        :param features: List of features (column names) from the transaction data frame.
        :param importances: List of equal length as features containing an "importance" score for each feature.
        :param thresholds: list of equal length as features containing min max range values for each feature - used for
        transaction selection.
        :param anomaly: Integer that corresonds to the coding for types of 'anomalous activigy'.
        That is 1 = slow, 2 = very slow, and 3 = error.
        :return: A dictionary containing potential feature and thresholds sets along with their corresponding precision, recall,
        f1 and accuracy score analysis metrics for a given anomalous cluster.
        """
        recall = []
        precision = []
        f1_scores = []
        accuracy = []
        feature_indices = []
        conditions = []
        other_anomaly = True
        if anomaly != 4:
             df = self.data
        else:
            df = self.__df_all_anomalies
            other_anomaly = False
            anomaly = 1
        N = sum(importances > self.importances_threshold)
        for idx in range(1, N + 1):
            # generate the lists of index values for any combination of i important features to include
            results = itertools.combinations(range(N), idx)
            results = list(results)
            for index_vals in results:
                # get condition for slicing the data frame
                condition = self.__condition_combination(index_vals, features, thresholds)
                if df[condition & (df['anomalous']==anomaly)].shape[0]:
                    recall.append(round(df[condition & (df['anomalous'] == anomaly)].shape[0] / sum(self.__y == 1), 3))
                    precision.append(round(df[condition & (df['anomalous'] == anomaly)].shape[0] / 
                                           df[condition & (df['anomalous'].isin([0, anomaly]))].shape[0], 3))
                    if(recall[-1] + precision[-1]):
                        f1_scores.append(round(2 * recall[-1] * precision[-1] / (recall[-1] + precision[-1]), 3))
                    else:
                        f1_scores.append(0)
                    accuracy.append(round((df[condition & (df['anomalous'] == anomaly)].shape[0] +
                                           df[~(condition) & (df['anomalous'] == 0)].shape[0]) / self.__X.shape[0], 3))
                    feature_indices.append(list(index_vals))
                    conditions.append(condition)
        #         N = min(min(len(f1_scores),3), max(3, sum(np.array(f1_scores) >= .7 * max(f1_scores))))
        N = min(len(f1_scores), 3)
        feat_thresh_re_pre_f1_acc = {'features': [], 'thresholds': [], 'recall': [], 'precision': [], 'f1_score': [],
                                     'accuracy': [],
                                     'count': df[df['anomalous'] == anomaly].shape[0],
                                     'other_anomaly_percent': round(df[~df['anomalous'].isin([0, anomaly])].shape[0]
                                                                    / df[df['anomalous'] != 0].shape[0], 3),
                                     'true_p_x': [], 'true_p_y': [], 'true_p_count': [], 
                                     'false_n_x': [], 'false_n_y': [], 'false_n_count': [],
                                     'true_n_norm_x': [], 'true_n_norm_y': [], 'true_n_norm_count': [], 
                                     'false_p_norm_x': [], 'false_p_norm_y': [], 'false_p_norm_count': [],
                                     'true_n_other_anomaly_x': [], 'true_n_other_anomaly_y': [], 'true_n_other_anomaly_count': [],
                                     'false_p_other_anomaly_x': [], 'false_p_other_anomaly_y': [], 'false_p_other_anomaly_count': []}
        for idx in np.argsort(f1_scores)[::-1][:N]:
            feat_thresh_re_pre_f1_acc.setdefault('features', []).append([features[x] for x in feature_indices[idx]])
            feat_thresh_re_pre_f1_acc.setdefault('thresholds', []).append([thresholds[x] for x in feature_indices[idx]])
            feat_thresh_re_pre_f1_acc.setdefault('recall', []).append(recall[idx])
            feat_thresh_re_pre_f1_acc.setdefault('precision', []).append(precision[idx])
            feat_thresh_re_pre_f1_acc.setdefault('f1_score', []).append(f1_scores[idx])
            feat_thresh_re_pre_f1_acc.setdefault('accuracy', []).append(accuracy[idx])

            # correctly labeled normal transactions
            feat_thresh_re_pre_f1_acc.setdefault('true_n_norm_x', []).append(
                list(df['eventTimestamp'][~(conditions[idx]) & (df['anomalous'] == 0)]))
            feat_thresh_re_pre_f1_acc.setdefault('true_n_norm_y', []).append(
                list(df['responseTime'][~(conditions[idx]) & (df['anomalous'] == 0)]))
            feat_thresh_re_pre_f1_acc.setdefault('true_n_norm_count', 
                                                 []).append(len(feat_thresh_re_pre_f1_acc['true_n_norm_x'][-1]))            
            
            # incorrectly labeled normal transactions
            feat_thresh_re_pre_f1_acc.setdefault('false_p_norm_x', []).append(
                list(df['eventTimestamp'][(conditions[idx]) & (df['anomalous'] == 0)]))
            feat_thresh_re_pre_f1_acc.setdefault('false_p_norm_y', []).append(
                list(df['responseTime'][(conditions[idx]) & (df['anomalous'] == 0)]))            
            feat_thresh_re_pre_f1_acc.setdefault('false_p_norm_count', 
                                                 []).append(len(feat_thresh_re_pre_f1_acc['false_p_norm_x'][-1]))            
            
            # correctly labeled anomalous transactions
            feat_thresh_re_pre_f1_acc.setdefault('true_p_x', []).append(
                list(df['eventTimestamp'][(conditions[idx]) & (df['anomalous'] == anomaly)]))
            feat_thresh_re_pre_f1_acc.setdefault('true_p_y', []).append(
                list(df['responseTime'][(conditions[idx]) & (df['anomalous'] == anomaly)]))
            feat_thresh_re_pre_f1_acc.setdefault('true_p_count', 
                                                 []).append(len(feat_thresh_re_pre_f1_acc['true_p_x'][-1]))                        

            # incorrectly labeled anomalous transactions
            feat_thresh_re_pre_f1_acc.setdefault('false_n_x', []).append(
                list(df['eventTimestamp'][~(conditions[idx]) & (df['anomalous'] == anomaly)]))
            feat_thresh_re_pre_f1_acc.setdefault('false_n_y', []).append(
                list(df['responseTime'][~(conditions[idx]) & (df['anomalous'] == anomaly)]))
            feat_thresh_re_pre_f1_acc.setdefault('false_n_count', 
                                                 []).append(len(feat_thresh_re_pre_f1_acc['false_n_x'][-1]))            
            
            
            if other_anomaly:
                # correctly labeled other anomaly transactions
                feat_thresh_re_pre_f1_acc.setdefault('true_n_other_anomaly_x', []).append(
                    list(df['eventTimestamp'][~(conditions[idx]) & ~(df['anomalous'].isin([0, anomaly]))]))
                feat_thresh_re_pre_f1_acc.setdefault('true_n_other_anomaly_y', []).append(
                    list(df['responseTime'][~(conditions[idx]) & ~(df['anomalous'].isin([0, anomaly]))]))
                feat_thresh_re_pre_f1_acc.setdefault('true_n_other_anomaly_count', 
                                                     []).append(len(feat_thresh_re_pre_f1_acc['true_n_other_anomaly_x'][-1]))

                # incorrectly labeled other anomaly transactions
                feat_thresh_re_pre_f1_acc.setdefault('false_p_other_anomaly_x', []).append(
                    list(df['eventTimestamp'][(conditions[idx]) & ~(df['anomalous'].isin([0, anomaly]))]))
                feat_thresh_re_pre_f1_acc.setdefault('false_p_other_anomaly_y', []).append(
                    list(df['responseTime'][(conditions[idx]) & ~(df['anomalous'].isin([0, anomaly]))]))
                feat_thresh_re_pre_f1_acc.setdefault('false_p_other_anomaly_count', 
                                                     []).append(len(feat_thresh_re_pre_f1_acc['false_p_other_anomaly_x'][-1]))            
            
        return feat_thresh_re_pre_f1_acc
