from data_sanitizer import sanitize_json
import sys
import json


if __name__ == '__main__':

    raw_data_string = json.dumps(json.load(sys.stdin))
    print(raw_data_string)
    sanitized_data_string = sanitize_json(raw_data_string).to_json_string()

    print(sanitized_data_string)
