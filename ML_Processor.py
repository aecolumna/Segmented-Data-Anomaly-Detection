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

    def __init__(self, data_frame, test_size=0.50, importances_threshold=0.15, lasso=True, random_forest=True, random_state=42):
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
        self.lasso = lasso
        self.random_forest = random_forest
        self.random_state = random_state
        self.clusters = {'slow': None, 'very_slow': None, 'error': None}

        self.__df_slow = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 1)]

        self.__df_very_slow = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 2)]
        self.__df_very_slow['anomalous'].mask((self.data['anomalous'] == 2), 1, inplace=True)

        self.__df_error = self.data[(self.data['anomalous'] == 0) | (self.data['anomalous'] == 3)]
        self.__df_error['anomalous'].mask((self.data['anomalous'] == 3), 1, inplace=True)

        df_clusters = [self.__df_slow, self.__df_very_slow, self.__df_error]

        for idx, cluster in enumerate(self.clusters):
            if (len(np.unique(df_clusters[idx]['anomalous'])) > 1):
                self.clusters[cluster] = self.__train(df_clusters[idx])
        self.json_clusters = json.dumps(self.clusters)


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
            condition = condition & (self.__X[features[idx]] >= thresholds[idx][LOWER]) & (
                        self.__X[features[idx]] <= thresholds[idx][UPPER])
        return condition

    def __true_positve(self, tree):
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
        return true_p_df.to_numpy(), tree.decision_path(true_p_df).toarray()

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
        true_p_matrix, true_paths = self.__true_positve(tree)
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
        for idx in range(len(feature_thresholds)):
            if not feature_thresholds[idx][LOWER]:
                feature_thresholds[idx][LOWER].append(0)
                if not feature_thresholds[idx][UPPER]:
                    feature_thresholds[idx][UPPER].append(0)
            elif not feature_thresholds[idx][UPPER]:
                feature_thresholds[idx][UPPER].append(max(self.__X[features[idx]]))
            elif (min(feature_thresholds[idx][LOWER]) >= max(feature_thresholds[idx][UPPER])):
                feature_thresholds[idx][LOWER].append(0)
        return [[min(th[LOWER]), max(th[UPPER])] for th in feature_thresholds]

    def __train(self, df):
        """
        Performs the ML methods on the given data frame and returns a report in the form of dictionary containing the
        features of transactions and their corresponding conditions that are most highly correlated with the occurrence
        of anomalies within the transact data. It also provides precision, recall, f1 and accuracy scores of the
        identified conditions to convey how strong the correlation is.
        :param df: A pandas data frame
        :return: A dictionary containing the analysis metrics of a given anomalous cluster
        """
        if (self.random_forest):
            clf = RandomForestClassifier(n_estimators=2 * (df.shape[1] + 1))
        else:
            clf = tree.DecisionTreeClassifier()
        features = list(self.data.columns)[:-1]
        self.__X = df[features[:-1]].copy()
        self.__y = df['anomalous'].copy()
        if self.lasso:
            reg = LassoCV(cv=5, random_state=self.random_state, normalize=True, fit_intercept=False).fit(self.__X,
                                                                                                         self.__y)
            updated_features = np.array(features)[np.where(reg.coef_ != 0)]
            features = list(updated_features)
            self.__X = self.__X[features]
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
        cluster = self.__get_diagnostics(ranked_features, importances, ranked_thresholds)
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

    def __get_diagnostics(self, features, importances, thresholds):
        """
        Takes in transaction features and their corresponding range values and importance scores. It then iterates
        through combinations of the important features and thresholds to see which one most correlated to the anomalous
        behavior. It then returns a dictionary containing the findings.
        :param features: List of features (column names) from the transaction data frame.
        :param importances: List of equal length as features containing an "importance" score for each feature.
        :param thresholds: list of equal length as features containing min max range values for each feature - used for
        transaction selection.
        :return: A dictionary containing potential feature and thresholds sets along with their corresponding precision, recall,
        f1 and accuracy score analysis metrics for a given anomalous cluster.
        """
        recall = []
        precision = []
        f1_scores = []
        accuracy = []
        feature_indices = []
        N = sum(importances > self.importances_threshold)
        for idx in range(1, N + 1):
            # generate the lists of index values for any combination of i important features to include
            results = itertools.combinations(range(N), idx)
            results = list(results)
            for index_vals in results:
                # get condition for slicing the data frame
                condition = self.__condition_combination(index_vals, features, thresholds)
                if self.__X[condition].shape[0]:
                    recall.append(round(self.__X[condition & (self.__y == 1)].shape[0] / sum(self.__y == 1), 2))
                    precision.append(
                        round(self.__X[condition & (self.__y == 1)].shape[0] / self.__X[condition].shape[0], 2))
                    f1_scores.append(2 * recall[-1] * precision[-1] / (recall[-1] + precision[-1]))
                    accuracy.append((self.__X[condition & (self.__y == 1)].shape[0] +
                                     self.__X[~(condition) & (self.__y == 0)].shape[0]) / self.__X.shape[0])
                    feature_indices.append(index_vals)
        N = min(3, sum(np.array(f1_scores) >= .7 * max(f1_scores)))
        np_features = np.array(features)
        feat_thresh_re_pre_f1_acc = {'features': [], 'thresholds': [], 'recall': [], 'precision': [], 'f1_score': [],
                                     'accuracy': []}
        for idx in np.argsort(f1_scores)[::-1][:N]:
            feat_thresh_re_pre_f1_acc.setdefault('features', []).append(np_features[feature_indices[idx]])
            feat_thresh_re_pre_f1_acc.setdefault('thresholds', []).append(thresholds[idx])
            feat_thresh_re_pre_f1_acc.setdefault('recall', []).append(recall[idx])
            feat_thresh_re_pre_f1_acc.setdefault('precision', []).append(precision[idx])
            feat_thresh_re_pre_f1_acc.setdefault('f1_score', []).append(f1_scores[idx])
            feat_thresh_re_pre_f1_acc.setdefault('accuracy', []).append(accuracy[idx])
        return feat_thresh_re_pre_f1_acc
