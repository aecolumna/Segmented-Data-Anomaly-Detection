import numpy as np
import pandas as pd
import csv
import json
from collections import namedtuple


class Sanitized:
    def __init__(self, df, array, td):
        self.pd_df = df
        self.np_array = array
        self.type_dict = td

    def as_pd_df(self):
        return self.pd_df

    def as_np_array(self):
        return self.np_array

    def get_type_dict(self):
        return self.type_dict

    def to_json_string(self):
        return self.pd_df.to_json()

    def to_file(self, outfile="sanitized_output.json"):
        self.pd_df.to_json(outfile)


# https://towardsdatascience.com/flattening-json-objects-in-python-f5343c794b10
# helpful article on flattening json that i used as a source for this code
def flatten_json(y):
    out = {}

    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '.')
        elif type(x) is list:
            i = 0
            if len(x) == 1 and type(x[0]) is list:  # hacky
                flatten(x[0], name)
            else:

                for a in x:
                    flatten(a, name + str(i) + '.')
                    i += 1
                if len(x) == 0:
                    out[name[:-1]] = x  # fix for dropping empty lists
        else:
            out[name[:-1]] = x

    flatten(y)
    # returns {numerical_field: value of field}
    return out


# returns a tuple (correct field names, types of those field names)
def flatten_fields(fields):
    out = {}
    types = {}

    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                if a != 'label':  # throw out the labels since they only confuse things
                    # keeps appropriate field names together
                    if a == 'field' or a == 'fields':
                        # flatten(x[a], name + x['field'] + '.')
                        flatten(x[a], name + x['field'] + '.')
                    elif a == 'type':
                        # flatten(x[a], name + a + '.')#might want to do something different here
                        types[name + x['field']] = x[a]
                    else:
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
    # print(types)
    # print(out)
    true_fields = []
    numerical_fields = []
    # print(out)
    temp_types = {}
    for key in out.keys():
        subfields = key.split(".")
        field = []
        numerical_field = []
        for f in subfields:
            # print(f)
            if f.isdigit():
                numerical_field.append(f)
            else:
                field.append(f)
        true_fields.append('.'.join(field))
        numerical_fields.append('.'.join(numerical_field))
        temp_types['.'.join(field)] = types[key]

    types = temp_types
    # print(numerical_fields)
    # print(true_fields)
    # only need the keys, the values are just the field name of the deepest layer
    # returns [numerical_fields], [true_fields], {true_field:type_of_field}
    return numerical_fields, true_fields, types


def sanitize_json(raw_json):
    def getDuplicateColumns(df):
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

    # open json
    # for loading from file, deprecated
    # with open(json_filepath, mode='r') as json_fp:
    #     json_file = json.load(json_fp)

    print(raw_json)
    print("testing from py")
    json_file = json.loads(raw_json)

    # extract data, fields, etc
    # if type(json_file) is list:#sometimes it's wrapped in a lsit for whatever reason
    #     data = json_file[0]
    # else:
    #     data = json_file

    # doesnt appear to be wrapped anymore
    data = json_file

    fields = data["fields"]  # headers
    total = data["total"]  # total records
    results = data["results"]  # actual results
    # NOTE each index of results is one row. flattening that gives all correct entries. just have to match entries with column names
    more_data = data["moreData"]  # some boolean?
    schema = data["schema"]  # data schema?

    # flattenign
    flattened_fields = flatten_fields(fields)
    flattened_json = flatten_json(results)

    # make sure everything is what I think it is
    # with open("fields_of_query.json", 'w') as outfile:
    #     json.dump(fields, outfile)
    # with open("intermediate_fields.json", 'w') as outfile:
    #     json.dump(flattened_fields, outfile)
    # with open("results_of_query.json", 'w') as outfile:
    #    json.dump(results, outfile)
    # with open("intermediate_file.json", 'w') as outfile:
    #    json.dump(flattened_json, outfile)

    # stick em all together
    numerical_fields = flattened_fields[0]
    true_fields = flattened_fields[1]
    types = flattened_fields[2]

    # with open("results.csv", 'w', newline='') as csvfile:
    #     writer = csv.DictWriter(csvfile, fieldnames=numerical_fields)
    #     writer.writeheader()
    #     for entry in results:
    #         #print(entry)
    #         row = flatten_json(entry)
    #         print(row)
    #         writer.writerow(row)

    df = pd.DataFrame([flatten_json(x) for x in results], columns=numerical_fields)
    df.columns = true_fields

    # will both be changed if sanitization happens
    new_df = pd.DataFrame(df)
    new_array = pd.DataFrame(df).to_numpy()

    # only need to sanitize if results exist
    if results:
        df.fillna("None", inplace=True)
        good_columns = []
        # remove nans
        for col in df.columns:
            # print(col, isinstance(df[col].iloc[0], pd.Series))
            # print()
            if str(df[col].iloc[0]) != "nan":
                good_columns.append(col)
        df = pd.DataFrame(df, columns=good_columns)
        print(df)

        good_columns = []
        # remove columns that are all the same and are unsplit arrays
        print(df)

        for col in df.columns:
            if len(np.unique(df[[col]].values)) != 1 and (
            not (type(df[col].iloc[0]) == str and "[" in str(df[col].iloc[0]))):
                good_columns.append(col)

        df.drop(getDuplicateColumns(df))

        id_cols = []
        for col in df.columns:
            if str(col)[-3:] == ".id" or str(col)[-4:] == "GUID":
                id_cols.append(col)
        df.drop(id_cols)
        df.rename("userExperience", "anomalous")

        # one hot encoding goes here
        # https://hackernoon.com/what-is-one-hot-encoding-why-and-when-do-you-have-to-use-it-e3c6186d008f


        # https://stackoverflow.com/questions/35321812/move-column-in-pandas-dataframe/35322540
        end_cols = ['responseTime', 'eventTimestamp', 'anomalous']
        df = df[[col for col in df if col not in end_cols] + [col for col in end_cols in col in df]]

        new_df = pd.DataFrame(df, columns=good_columns)
        new_array = pd.DataFrame(df).to_numpy()

    return Sanitized(new_df, new_array, types)
    # return Sanitized(df, new_array, types)

if __name__ == "__main__":
    # sanitize_csv("AppDynamicsSearchResults.csv").to_file("sanitized_output.csv")

    sanitize_json("test_output_1.json").to_file("sanitized_test_output_1.csv")

