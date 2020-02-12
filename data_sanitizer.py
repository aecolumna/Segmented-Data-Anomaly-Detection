import numpy as np
import pandas as pd
import csv
import json

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

    def to_file(self, outfile="sanitized_output.csv", index = False):
        self.pd_df.to_csv(outfile)


def sanitize_csv(csv_filepath="AppDynamicsSearchResults.csv"):
    df = pd.read_csv(csv_filepath, header="infer")
    good_columns = []

    #remove columns that are all the same and are unsplit arrays
    for col in df.columns:
        if len(np.unique(df[[col]].values)) != 1 and (not (type(df[col].iloc[0]) == str and "[" in str(df[col].iloc[0]))):
            good_columns.append(col)

    df = pd.DataFrame(df, columns=good_columns)
    good_columns = []
    #remove nans
    for col in df.columns:
        #print(col, isinstance(df[col].iloc[0], pd.Series))
        #print()
        if str(df[col].iloc[0]) != "nan":
            good_columns.append(col)

    #get types
    type_dict = {}
    for col in df.columns:
        if df[col].dtype == np.float64 or df[col].dtype == np.int64:
            type_dict[col] = "float"
        elif df[col].dtype == np.object:
            type_dict[col] = "str"
        else:
            raise Exception(f"Unexpected type in data sanitizer: {df[col].dtype}")

    new_df = pd.DataFrame(df, columns=good_columns)
    new_array = pd.DataFrame(df).to_numpy()

    return Sanitized(new_df, new_array, type_dict)




if __name__ == "__main__":
    sanitized = sanitize_csv("AppDynamicsSearchResults.csv")
    sanitized.to_file()



