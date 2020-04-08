import pandas as pd
from ML_Processor import ml_processor
import json

if __name__ == "__main__":
    with open("../error.csv", 'r') as infile:
        df = pd.read_csv(infile)

    ml_p = ml_processor(df)

    print(ml_p.clusters)

    with open('../datafiles/ML.json', 'w') as outfile:
        json.dump(ml_p.clusters, outfile)