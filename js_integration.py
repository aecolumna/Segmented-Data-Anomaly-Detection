from data_sanitizer import sanitize_json
from ML_Processor import ml_processor
from donut import make_donut_javascript
import datetime
import sys
import json


if __name__ == '__main__':

    raw_data_string = json.dumps(json.load(sys.stdin))
    print(raw_data_string)

    sanitized_data = sanitize_json(raw_data_string)
    sanitized_data_dataframe = sanitized_data.as_pd_df()
    sanitized_data.to_file()
    print(sanitized_data_dataframe)

    ml_p = ml_processor(sanitized_data_dataframe, random_forest=True)

    print(ml_p.json_clusters)

    with open('./datafiles/ML.json', 'w') as outfile:
        json.dump(ml_p.json_clusters,  outfile)
        #append current timestamp
    make_donut_javascript()


