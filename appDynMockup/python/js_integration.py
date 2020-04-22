from data_sanitizer import sanitize_json
from ML_Processor import ml_processor

import datetime
import json
import pandas as pd
import sys
import time

#load data from controller
raw_data_string = json.dumps(json.load(sys.stdin))

#sanitize data and retrieve as df
sanitized_data = sanitize_json(raw_data_string)
df = sanitized_data.as_pd_df()

#mostly for debug; allows viewing of the df before the ML gets it. Also helped fix a ghost in the machine error that I still don't know the cause of
with open("error.csv", 'w') as outfile:
    df.to_csv(outfile)
with open("error.csv", 'r') as infile:
    df = pd.read_csv(infile)

#remove index column created from file i/o
df = df.drop(df.columns[0], axis=1)

#process data
ml_p = ml_processor(data_frame=df, importances_threshold=0.05)


#dump data to file for visualization
with open('./datafiles/ML.json', 'w') as outfile:
    json.dump(ml_p.clusters,  outfile)



