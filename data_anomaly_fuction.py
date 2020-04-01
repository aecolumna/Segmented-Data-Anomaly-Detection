def data_maker(data=None, normal_noise=0.05, anomaly_noise=0.20, groups=3, feature_set=[['Mortgage', 'Family'], ['Education', 'Income'], ['ZIP.Code']],
               thresholds=[[[200, 1], [[3, 2], 4]], [[[1, 2], 4], [(50, 100), 3]], [[[91107], 4]]],
               anomaly_types=[2, 1, 3], feature_set_size=[2, 3, 4],
               random_groups=False, random_anomalies=False, random_features=False, random_thresholds=False,
               random_state=1):
    """
    params:
    data: pandas data frame
    normal_noise: portion of data that is set to an anomalous value regardless of thresholds
    anomaly_noise: portion of data that within anomalous thresholds that performs normaly
    groups: integer equal to the number of anomalous behavior creating combinations
    feature_set: array of arrays outer dimension must be the same length as groups if random_features = False
    thresholds: Array containing threshold information for each feature in feature set. Each threshold of a given feature is of the form
                [(value, range, or list), operator code] If rand_features = True thresholds will be chosen 
                randomly as well.
                operator codes:
                    # 0 -> equal to
                    # 1 -> greater than or equal to
                    # 2 -> less than or equal to
                    # 3 -> inclusive range
                    # 4 -> list of discreet values
    anomaly_types: An array of values of 1, 2, or 3 that indicate the "anomaly type" of each of the groups
                anomaly types:
                    # 1 -> slow
                    # 2 -> very slow
                    # 3 -> error                
    feature_set: An array of integers to draw from (with replacement) for choosing the number of features to use in each "group"
                     when random_features = True (if random_features = False this parameter is unused)
    random_groups: Boolean that determines whether or not the number of groups to use will be chosen randomly 
                    (if this is set to true everything well be choosen randomly)
    random_anomalies: Boolean that determines whether or not each groups anamoly type will be chosen randomly
    random_features: Boolean that determines whether or not features and the number of features in each group 
                     will be chosen randomly
    random_thresholds: Boolean that detremines whether or not each groups threholds will be chosen random
                     (automatically random if random_features or random_groups are True)
    random_state: Seed for Random values
    """
    # reset target column to 0

    import numpy as np
    data['anomalous'] = 0

    all_features = ['Age', 'Experience', 'Income', 'CCAvg', 'Mortgage', 'ZIP.Code', 'Family', 'Education',
                    'CD.Account', 'CreditCard', 'Personal.Loan', 'Securities.Account', 'Online']
    continuous_features = ['Age', 'Experience', 'Income', 'CCAvg', 'Mortgage']
    qualitative_m_features = ['ZIP.Code', 'Family', 'Education']
    qualitative_binary_features = ['CD.Account', 'CreditCard', 'Personal.Loan',
                                   'Securities.Account', 'Online']
    np.random.seed(random_state)
    if (random_features or random_groups):
        # generate random number of groups
        if (random_groups):
            groups = np.random.choice([1, 2, 3, 4, 5])
        # generate random feature set
        set_sizes = np.random.choice(feature_set_size, size=groups)
        feature_set = [np.random.choice(all_features, size=x, replace=False) for x in set_sizes]

    # generate random thresholds
    if (random_features or random_groups or random_thresholds):
        thresholds = []
        anomaly_types = []
        for f_set in feature_set:
            t_set = []
            # get range tuples
            for feature in f_set:
                # get anomaly type
                at = np.random.choice([1, 2, 3])
                if (feature in continuous_features):
                    # get operator codes
                    oc = np.random.choice([1, 2, 3])
                    if (oc == 1):
                        quantile = np.random.choice([.5, .75])
                        value = sorted(data[feature])[int(np.floor(quantile * data.shape[0]))]
                    elif (oc == 2):
                        quantile = np.random.choice([.25, .5])
                        value = sorted(data[feature])[int(np.floor(quantile * data.shape[0]))]
                    else:
                        quantile = np.random.choice([0, .25, .75])
                        tuple_1 = sorted(data[feature])[int(np.floor(quantile * data.shape[0]))]
                        tuple_2 = sorted(data[feature])[int(np.floor((quantile + .25) * data.shape[0]))]
                        value = (tuple_1, tuple_2)
                    t_set.append([value, oc])
                elif (feature in qualitative_m_features):
                    # get operator codes
                    oc = np.random.choice([0, 4])
                    if (oc == 0):
                        value = np.random.choice(data[feature])
                    elif (oc == 4):
                        if (feature == 'ZIP.Code'):
                            zip_codes = np.random.choice([x for x in range(1, 6)])
                            value = np.random.choice(np.unique(data[feature]), size=zip_codes, replace=False)
                        elif (feature == 'Family'):
                            family_size = np.random.choice([2, 3])
                            value = np.random.choice(np.unique(data[feature]), size=family_size, replace=False)
                        else:
                            value = np.random.choice(np.unique(data[feature]), size=2, replace=False)
                    t_set.append([value, oc])
                else:
                    t_set.append([1, 0])
            thresholds.append(t_set)

    # build the data frame
    if (random_anomalies or random_groups):
        anomaly_types = np.random.choice([1, 2, 3], size=groups)
    for i, t_set in enumerate(thresholds):
        condition = True
        for j, t_hold in enumerate(t_set):
            if (t_hold[1] == 0):
                condition = condition & (data[feature_set[i][j]] == t_hold[0])
            elif (t_hold[1] == 1):
                condition = condition & (data[feature_set[i][j]] >= t_hold[0])
            elif (t_hold[1] == 2):
                condition = condition & (data[feature_set[i][j]] <= t_hold[0])
            elif (t_hold[1] == 3):
                condition = condition & (
                            (data[feature_set[i][j]] >= t_hold[0][0]) & (data[feature_set[i][j]] <= t_hold[0][1]))
            else:
                condition = condition & (np.isin(data[feature_set[i][j]], t_hold[0]))
            if(anomaly_noise != 0):
                anom_noise = np.random.choice(a=[False, True], size=sum(condition), p=[0.2, 0.8])
                condition[condition] = anom_noise
            data['anomalous'].mask(condition,anomaly_types[i],inplace=True)
            if(normal_noise != 0):
                norm_noise = np.random.choice([1,2,3], size=sum(data['anomalous'] == 0), p=[0.6,0.3,0.1])
                data['anomalous'].mask(data['anomalous']==0, norm_noise, inplace=True)
    # print out what has been made
    anomalies = ['slow', 'very slow', 'error']
    output = "The data frame has the following anomalous groups:"
    for i, t_set in enumerate(thresholds):
        output += "\n" + anomalies[anomaly_types[i] - 1] + " where "
        for j, t_hold in enumerate(t_set):
            output += feature_set[i][j]
            if (t_hold[1] == 0):
                output += " == " + str(t_hold[0])
            elif (t_hold[1] == 1):
                output += " >= " + str(t_hold[0])
            elif (t_hold[1] == 2):
                output += " <= " + str(t_hold[0])
            elif (t_hold[1] == 3):
                output += " is in the inclusive range of " + str(t_hold[0])
            else:
                output += " is in the discrete set of " + str(t_hold[0])
            if (j < len(t_set) - 1):
                output += " and "
    for i in range(1, 4):
        output += "\nThere are " + str(len(data['anomalous'][data['anomalous'] == i])) + " " + anomalies[
            i - 1] + " transactions in this data set"
    return feature_set, thresholds, anomaly_types, output