from data_sanitizer import sanitize_json
from ML_Processor import ml_processor
import sys
import json
from donut import make_donut_javascript


if __name__ == '__main__':

    raw_data_string = json.dumps(json.load(sys.stdin))
    print(raw_data_string)

    sanitized_data = sanitize_json(raw_data_string)
    sanitized_data_dataframe = sanitized_data.as_pd_df()
    sanitized_data.to_file()
    print(sanitized_data_dataframe)

    ml_p = ml_processor(sanitized_data_dataframe, random_forest=True)

    print(ml_p.json_clusters)
    #make_donut_javascript()


