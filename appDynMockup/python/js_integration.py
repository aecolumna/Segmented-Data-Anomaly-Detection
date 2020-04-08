from data_sanitizer import sanitize_json
from ML_Processor import ml_processor
from donut import make_donut_javascript

import datetime
import sys
import json
import pandas as pd
import time

raw_data_string = json.dumps(json.load(sys.stdin))
print(raw_data_string)

sanitized_data = sanitize_json(raw_data_string)
df = sanitized_data.as_pd_df()
with open("error.csv", 'w') as outfile:
    df.to_csv(outfile)
print(df)
with open("error.csv", 'r') as infile:
    df = pd.read_csv(infile)

df = df.drop(df.columns[0], axis=1)
print(df)

ml_p = ml_processor(data_frame=df)

print(ml_p.clusters, " muh clusters")
print(ml_p.json_clusters, " muh clusters")



with open('../appDynMockup/datafiles/ML.json', 'w') as outfile:
    json.dump(ml_p.clusters,  outfile)
    #append current timestamp
make_donut_javascript()

