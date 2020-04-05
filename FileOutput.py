# -*- coding: utf-8 -*-
"""
Created on Fri Apr  3 15:03:52 2020

@author: Aojia Rui
"""
import pandas as pd
import json
import datetime
from ML_Processor import ml_processor



class file_system:
    
    def __init__(self, csv_name):
        self.time = datetime.datetime.now().strftime('%Y_%m%d_%H%M')
        self.name = csv_name
        
    def load_data(self, csv_name):
        df = pd.read_csv(csv_name).iloc[:,2:].copy()
        cluster = ml_processor(data_frame=df.head(100), lasso=False, random_forest=True)
        json_obj = cluster.json_clusters
        return json_obj
        
    def write_file(self):
        with open(self.time + '.json', 'w') as output:
            data = self.load_data(self.name)
            json.dump(data, output)
            


#if __name__ == '__main__':
#    
#    test = FileSystem("bank_loan_1.csv")
#    test.write_file()
            



    
