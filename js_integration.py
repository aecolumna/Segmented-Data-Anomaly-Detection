from data_sanitizer import sanitize_json
#from ML_Processor import ml_processor
import sys
import json


if __name__ == '__main__':

    raw_data_string = json.dumps(json.load(sys.stdin))
    print(raw_data_string)
    sanitized = sanitize_json(raw_data_string)
    sanitized_data_df = sanitized.as_pd_df()
    sanitized.to_file()
    print(sanitized_data_df)
