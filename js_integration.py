from data_sanitizer import sanitize_json
#from ML_Processor import ml_processor
import sys
import json
from donut import make_donut_javascript


if __name__ == '__main__':

    raw_data_string = json.dumps(json.load(sys.stdin))
    print(raw_data_string)

    sanitized_data_string = sanitize_json(raw_data_string).to_json_string()
    make_donut_javascript()
    print(sanitized_data_string)

