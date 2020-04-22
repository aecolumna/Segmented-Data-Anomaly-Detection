import csv
import json
import numpy as np
import pandas as pd


from collections import namedtuple

#class for holding sanitized results and returning it in different formats
class Sanitized:
    def __init__(self, df, array, td):
        """
        constructor
        :param df: sanitized data as a dataframe
        :param array: sanitized data as a numpy array
        :param td:  dict of {column names : types of columns}; ended up not being used but it useful to keep track of
        """
        self.pd_df = df
        self.np_array = array
        self.type_dict = td

    def as_pd_df(self):
        """
        getter for dataframe
        :return: sanitized data as a pandas dataframe
        """
        return self.pd_df

    def as_np_array(self):
        """
        getter for numpy array
        :return: sanitized data as numpy array
        """
        return self.np_array

    def get_type_dict(self):
        """
        getter for type dict
        :return: dict of {column names: types of columns}
        """
        return self.type_dict

    def to_json_string(self):
        """
        retrieve data as a json string
        :return:a json string representing the sanitized data. see file formatting guide for exact format
        """
        return self.pd_df.to_json()

    def to_file(self, outfile="sanitized_output.json"):
        """
        write data as json string to file
        :param outfile: file to write to , "sanitized_output.json" by default
        :return: None
        """
        self.pd_df.to_json(outfile)


# https://towardsdatascience.com/flattening-json-objects-in-python-f5343c794b10
# helpful article on flattening json that i used as a source for this code
def flatten_json(y):
    """
    flattener for json
    :param y: json to flatten
    :return: flattened json
    """
    out = {}

    #helper function to flatten recursively
    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '.')
        elif type(x) is list:
            i = 0
            if len(x) == 1 and type(x[0]) is list:  #handles weird special case
                flatten(x[0], name)
            else:

                for a in x:
                    flatten(a, name + str(i) + '.')
                    i += 1
                if len(x) == 0:
                    out[name[:-1]] = x  #handles empty lists being droppped accidentally
        else:
            out[name[:-1]] = x


    flatten(y)
    # returns {numerical_field: value of field}
    return out



def flatten_fields(fields):
    """
    special case of the flattener for flattening names of the fields. There's probably a decent way to merge these but I couldn't figure one out quickly
    :param fields: fields to flatten
    :return: a tuple of ([numerical_fields], [true_fields], {true_field:type_of_field}) -> fields as numbers, fields as real names, types of the fields
    """
    out = {}
    types = {}

    #helper to flatten recursively
    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                if a != 'label':  # throw out the labels since they only confuse things
                    # keeps appropriate field names together
                    if a == 'field' or a == 'fields':
                        flatten(x[a], name + x['field'] + '.')
                    elif a == 'type':
                        types[name + x['field']] = x[a]
                    else:
                        #some error checking, just in case
                        raise Exception(f"Unexpected key {a} in headers dict")
        elif type(x) is list:
            i = 0
            for a in x:
                flatten(a, name + str(i) + '.')
                i += 1
            if len(x) == 0:
                out[name[:-1]] = x  # fix for dropping empty lists
        else:
            out[name[:-1]] = x

    flatten(fields)

    true_fields = []
    numerical_fields = []
    temp_types = {}

    #handle the flattened fields, since they come out as a bunch of numbers and real names merged
    #ex segments.1.userExperience.5.zipcode.7 becomes segments.userExperience.sipcode and 1.5.7
    for key in out.keys():
        subfields = key.split(".")
        field = []
        numerical_field = []
        for f in subfields:
            if f.isdigit():
                numerical_field.append(f)
            else:
                field.append(f)
        true_fields.append('.'.join(field))
        numerical_fields.append('.'.join(numerical_field))
        temp_types['.'.join(field)] = types[key]

    types = temp_types

    # returns
    return numerical_fields, true_fields, types


def sanitize_json(raw_json):
    """
    sanitizes raw data into usable data for ML
    :param raw_json: raw json from the controller. Expected format in in FileFormattingGuide
    :return: a Sanitized object containing the sanitized data
    """


    def getCombinedColumns(df):
        """
        gets columns that are composites of other columns for removal
        :param df: dataframe of data to be sanitized
        :return: names of columns that are composites
        """
        combined_cols = []
        for col in df.columns:
            if isinstance(df[col].iloc[0], list):
                combined_cols.append(col)
        print("combined cols", len(combined_cols))
        return list(set(combined_cols))

    def getDuplicateColumns(df):
        """
        gets columns that are duplicates of other columns for removal
        :param df: dataframe of data to be sanitized
        :return: names of duplicate columns
        """
        duplicateColumnNames = set()
        # Iterate over all the columns in dataframe
        for x in range(df.shape[1]):
            # Select column at xth index.
            col = df.iloc[:, x]
            # Iterate over all the columns in DataFrame from (x+1)th index till end
            for y in range(x + 1, df.shape[1]):
                # Select column at yth index.
                otherCol = df.iloc[:, y]
                # Check if two columns at x 7 y index are equal
                if col.equals(otherCol):
                    duplicateColumnNames.add(df.columns.values[y])

        return list(duplicateColumnNames)

    def getNonUniqueColumns(df):
        """
        gets columns that are all one value (e.g. all 0s) for removal
        :param df: dataframe of data to be sanitized
        :return:names of columns to be removed
        """
        nonunique_cols = []
        for col, val in df.iteritems():
            try:
                if len(df[col].unique()) == 1:
                    nonunique_cols.append(col)
            except: #the .unique() method of pandas is quite fragile; this error catching helps identify a lot of bad data
                with open("error.csv", 'w') as outfile:
                    df.to_csv(outfile)
                raise Exception(type(df[col].iloc[0]), df[col].iloc[0], isinstance(df[col].iloc[0], list), str(col), str(df[col]))
        return list(set(nonunique_cols))

    def getIdColumns(df):
        """
        gets columns that are just IDs and therefore useless for ML purposes
        :param df: dataframe of data to be sanitized
        :return: names of columns to be removed
        """
        id_cols = []
        for col in df.columns:
            if str(col)[-3:] == ".id" or str(col)[-4:] == "GUID":
                id_cols.append(col)
        return list(set(id_cols))

    def getNullColumns(df):
        """
        gets columns that are all None. Requires a special case because pandas doesn't catch these cases very well with the other functions
        :param df: dataframe of data to be sanitized
        :return: names of columns to be removed
        """
        df.fillna("None", inplace=True)
        none_cols = []
        for col in df.columns:
            if df[col].all().isna():
                none_cols.append(col)
        return list(set(none_cols))

    def dropCronStartStopRows(df):
        """
        remove rows that aren't data but rather the CronWorker starting and stopping
        :param df:dataframe of data to be sanitized
        :return:dataframe with those rows removed
        """
        df = df[df.transactionName != "//CronApi//start"]
        df = df[df.transactionName != "//CronApi//stop"]
        return df

    data = json.loads(raw_json)

    #parse out json contents for further handling. only fields and results end up being used
    fields = data["fields"]  # headers
    total = data["total"]  # total records
    results = data["results"]  # actual results
    # NOTE each index of results is one row. flattening that gives all correct entries. just have to match entries with column names
    more_data = data["moreData"]  # some boolean?
    schema = data["schema"]  # data schema?

    # data flattening
    flattened_fields = flatten_fields(fields)
    flattened_json = flatten_json(results)


    # parse out flattened fields
    numerical_fields = flattened_fields[0]
    true_fields = flattened_fields[1]
    types = flattened_fields[2]

    #construct dataframe of flattened fields and data with appropriate headers
    df = pd.DataFrame([flatten_json(x) for x in results], columns=numerical_fields)
    df.columns = true_fields

    #init new df and array; if there are no results to sanitize these are returned
    new_df = pd.DataFrame(df)
    new_array = pd.DataFrame(df).to_numpy()

    # only need to sanitize if results exist
    if results:
        #rename column for later ML purposes
        df = df.rename(columns={"segments.userData.anomalous": "anomalous"})

        #weird edge cases that break the other drop functions. There's probably a way to detect and remove these automatically but I ran out of time
        df = df.drop(columns=['transactionId', "transactionName","segments.userData"], axis=1)

        #drop junk columns using helper functions
        df = df.drop(columns=getDuplicateColumns(df), axis=1)
        df = df.drop(columns=getCombinedColumns(df), axis=1)
        df = df.drop(columns=getIdColumns(df), axis=1)
        df = df.dropna(axis="columns", how='all')
        df =df.drop(columns=getNonUniqueColumns(df), axis=1)



        # one hot encoding on columns of categorical data. references are below
        # https://hackernoon.com/what-is-one-hot-encoding-why-and-when-do-you-have-to-use-it-e3c6186d008f
        #http: // queirozf.com / entries / one - hot - encoding - a - feature - on - a - pandas - dataframe - an - example
        categorical_cols = ["segments.userData.zip.code"] #note: I couldn't find a good way to automatically detect which columns are categorical. However, this is the only one in our test data so it works out
        for col in categorical_cols:
            df = pd.concat([df,pd.get_dummies(df[col], prefix=col, prefix_sep='.',dummy_na=True)],axis=1).drop([col],axis=1)

        #move info columns to end as per FileFormattingGuide for the ML - columns aren't for training but provide other info
        # https://stackoverflow.com/questions/35321812/move-column-in-pandas-dataframe/35322540
        end_cols = ['responseTime', 'eventTimestamp', 'anomalous']
        df = df[[col for col in df if col not in end_cols] + [col for col in end_cols if col in df]]

        #a bunch of junk columns that were ruining things, mostly timestamps of various kinds and a duplicate of userExperience that uses words instead of numbers
        #Again, couldn't figure out a good way to grab these automatically
        purge_cols = ["eventCompletionTimestamp", "pickupTimestamp", "segments.requestExperience", "segments.userData.eventtimestamp", "segments.userData.responsetime"]
        df = df.drop(purge_cols, axis=1, errors='ignore')

        #last row is malformed for some reason, so it's dropped
        df = df[:-1]
        new_array = pd.DataFrame(df).to_numpy()

    return Sanitized(df, new_array, types)

#scratch main for testing purposes; never runs in production
if __name__ == "__main__":

    sanitize_json("test_output_1.json").to_file("sanitized_test_output_1.csv")

