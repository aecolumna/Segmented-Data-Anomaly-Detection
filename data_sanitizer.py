import numpy as np
import pandas as pd
import csv
import json

def clean_csv(csv_filepath):
    df = pd.read_csv(csv_filepath, header="infer")
    good_columns = []
    unique_cols = []
    for col in df.columns:
        if len(np.unique(df[[col]].values)) != 1 and (not (type(df[col].iloc[0]) == str and "[" in str(df[col].iloc[0]))) :

            good_columns.append(col)

    df = pd.DataFrame(df, columns=good_columns)
    good_columns = []
    for col in df.columns:
        print(col, isinstance(df[col].iloc[0], pd.Series))
        print()
        if str(df[col].iloc[0]) != "nan":
            good_columns.append(col)

    new_table = pd.DataFrame(df, columns=good_columns)

    new_table.to_csv("sanitized_output.csv")

if __name__ == "__main__()":
    clean_csv("AppDynamicsSearchResults")

