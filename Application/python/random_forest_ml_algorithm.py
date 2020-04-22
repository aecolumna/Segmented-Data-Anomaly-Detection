# load the libraries
import copy
import itertools
import operator
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
%matplotlib inline
import seaborn as sns
import sklearn
from sklearn import svm
from sklearn.linear_model import SGDClassifier
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import graphviz

# read in the data add a column for anomalous data
bt = pd.read_csv("full_set.csv")
bt['anomalous'] = 0
# bt.head()

feature_set, thresholds, anomaly_types, output = data_maker(bt, random_groups = True, random_state = 6001)

        
#look at 4 groups in 325 millisecond increments
# first_group_train = bt[bt['responsetime'] < 1625]
# first_group_train['anomalous'].mask((bt['responsetime'] >= 100) & (bt['responsetime'] < 1625),1,inplace=True)

# second_group_train = bt[(bt['responsetime'] < 1300) | ((bt['responsetime'] >= 1625) & (bt['responsetime'] < 1950))]
# second_group_train['anomalous'].mask((bt['responsetime'] >= 1625) & (bt['responsetime'] < 1950),1,inplace=True)

# third_group_train = bt[(bt['responsetime'] < 1300) | ((bt['responsetime'] >= 1950) & (bt['responsetime'] < 2275))]
# third_group_train['anomalous'].mask((bt['responsetime'] >= 1950) & (bt['responsetime'] < 2275),1,inplace=True)

# fourth_group_train = bt[(bt['responsetime'] < 1300) | ((bt['responsetime'] >= 2275) & (bt['responsetime'] <= 2600))]
# fourth_group_train['anomalous'].mask((bt['responsetime'] >= 2275) & (bt['responsetime'] < 2600),1,inplace=True)

first_group_train = bt[(bt['anomalous'] == 0) | (bt['anomalous'] == 1)]
#first_group_train['anomalous'].mask((bt['anomalous'] == 2),1,inplace=True)

second_group_train = bt[(bt['anomalous'] == 0) | (bt['anomalous'] == 2)]
second_group_train['anomalous'].mask((bt['anomalous'] == 2),1,inplace=True)

third_group_train = bt[(bt['anomalous'] == 0) | (bt['anomalous'] == 3)]
third_group_train['anomalous'].mask((bt['anomalous'] == 3),1,inplace=True)


print(first_group_train.shape, second_group_train.shape, third_group_train.shape)
#Decision Trees
names = ['slow_group_decision_tree','very_slow_group_decision_tree','error_group_decision_tree',
            'slow_group_random_forest','very_slow_group_random_forest','error_group_random_forest']
groups = [first_group_train, second_group_train, third_group_train]


for i, name in enumerate(names):
    if(len(np.unique(groups[i%3]['anomalous'])) > 1):
        features = list(first_group_train.columns)[2:-5]
        if(i < 3):
            clf = tree.DecisionTreeClassifier()
        else:
            clf = RandomForestClassifier(n_estimators=2*(groups[i%3].shape[1]-7))
        x=groups[i%3].loc[:,list(bt.columns)[2:-5]].copy()
        y=groups[i%3].loc[:,list(bt.columns)[-1]].copy()
        targets=list(groups[i%3])[-1]
        #not using the test/train splitter at this time
        X_train, X_test, Y_train, Y_test = train_test_split(x, y, test_size=.90, random_state=42)
        clf = clf.fit(X_train, Y_train)
        print("Score = ", clf.score(X_test, Y_test))

        #get important features
        importances = clf.feature_importances_

        #get the index values of the important features in order of importance
        indices = np.argsort(importances)[::-1]
        
        #create new list of features in descending order of importance
        ranked_features = []
        for f in range(len(indices)):
            ranked_features.append(features[indices[f]])
        
        #create list for storing node thresholds
        feature_thresholds = [[[],[]] for x in range(len(features))]
        
        #create list for completeness ranking
        completeness = []
        
        #creat list for purity ranking
        purity = []
        
        #creat list for sum of purity and completeness rankings
        combined_score = []
        
        #function for returning for slicing condition
        def condition_combination(index_vals, df=x):
            condition = True
            for indx in index_vals:
                condition = condition & (df[features[indices[indx]]] >= min(feature_thresholds[indices[indx]][0])) & (df[features[indices[indx]]] <= max(feature_thresholds[indices[indx]][1]))
            return condition

        print("Feature ranking " + name + ":")
        
        if(i < 3):
            p = clf.predict(x)
            temp = x[(p == 1) & (p == y)].copy()
            temp = temp.to_numpy()
            for n, row in enumerate(clf.decision_path(temp).toarray()):
                for indx in np.nonzero(row)[-1][-2:-1]:
                    if(temp[n,clf.tree_.feature[indx]] <= clf.tree_.threshold[indx]):
                        feature_thresholds[clf.tree_.feature[indx]][1].append(clf.tree_.threshold[indx])
                    else:
                        feature_thresholds[clf.tree_.feature[indx]][0].append(clf.tree_.threshold[indx])
        else:
            for tree in clf.estimators_:
                p = tree.predict(x)
                temp = x[(p == 1) & (p == y)].copy()
                temp = temp.to_numpy()
                for n, row in enumerate(tree.decision_path(temp).toarray()):
                    for indx in np.nonzero(row)[-1][-2:-1]:
                        if(temp[n,tree.tree_.feature[indx]] <= tree.tree_.threshold[indx]):
                            feature_thresholds[tree.tree_.feature[indx]][1].append(tree.tree_.threshold[indx])
                        else:    
                            feature_thresholds[tree.tree_.feature[indx]][0].append(tree.tree_.threshold[indx])

        for k in range(len(features)):
            if len(feature_thresholds[k][0]) == 0:
                feature_thresholds[k][0].append(0)
                if len(feature_thresholds[k][1]) == 0:
                    feature_thresholds[k][1].append(0)
            elif(len(feature_thresholds[k][1]) == 0):
                feature_thresholds[k][1].append(max(x[features[k]]))
                
        number = sum(importances > 0.15)
        for k in range(1,number+1):
            # generate the lists of index values for any combination of i important features to include
            results = itertools.combinations(range(number),k)
            results = list(results)
            for index_vals in results:
                #get condition for slicing the data frame
                condition = condition_combination(index_vals)
                completeness.append([round(x[condition & (y==1)].shape[0]/sum(y == 1),2),index_vals])
                purity.append([round(x[condition & (y==1)].shape[0]/x[condition].shape[0], 2),index_vals])
                combined_score.append(completeness[-1][0]+purity[-1][0])
                
        print("purity", purity)
        print("completeness", completeness)

        np.argmax(combined_score)
        graph_caption = "A completeness score of " + str(completeness[np.argmax(combined_score)][0]*100) + "% and\na purity score of " + str(purity[np.argmax(combined_score)][0]*100) + "%\nwas obtained using the following features and thresholds:\n"
        for indx in np.argsort(completeness[np.argmax(combined_score)][1]):
            graph_caption += features[indices[indx]] + "(" + str(min(feature_thresholds[indices[indx]][0])) + ", " + str(max(feature_thresholds[indices[indx]][1])) + ")\n"

        if(i > 2):
            std = np.std([tree.feature_importances_ for tree in clf.estimators_], axis=0)
        for f in range(5):
            print("%d. feature %s (%f)\nthreshold range = (%f , %f)" % (f + 1, features[indices[f]], importances[indices[f]], 
                                                       min(feature_thresholds[indices[f]][0]), max(feature_thresholds[indices[f]][1])))

        # Plot the feature importances of the forest
        plt.figure()
        plt.title("Feature importances " + name)
        if(i < 3):
            plt.bar(range(x.shape[1]), importances[indices],
                color="b", align="center")
        else:
            plt.bar(range(x.shape[1]), importances[indices],
                color="b", yerr=std[indices], align="center")
        plt.xticks(range(x.shape[1]), ranked_features, rotation=45)
        plt.xlim([-1, x.shape[1]])
        plt.tight_layout()
        plt.figtext(0.5, -0.2, graph_caption, wrap=True, horizontalalignment='center', fontsize=12)
        plt.savefig(name+'.png', dpi=300, orientation='landscape')
    
#     if(i < 3):
#         dot_data = tree.export_graphviz(clf, out_file=None, 
#                                         feature_names=features, class_names=targets, 
#                                         filled=True, rounded=True, special_characters=True) 
#         graph = graphviz.Source(dot_data) 
#         graph.render(name + "_Tree", format='png') 
#         graph
        
#     else:
#         dot_data = tree.export_graphviz(clf.estimators_[-1], out_file=None, 
#                                     feature_names=features, class_names=targets, 
#                                     filled=True, rounded=True, special_characters=True) 
#         graph = graphviz.Source(dot_data) 
#         graph.render(name + "_Tree", format='png') 
#         graph