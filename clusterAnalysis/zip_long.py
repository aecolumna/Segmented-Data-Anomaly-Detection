
def add_longitude_latitude(filepath=None):

    if filepath is None:
        filepath = "./bank-loan/Bank_Personal_Loan_Modelling.csv"
        
    bank_df = pd.read_csv(filepath)
    zip_df = pd.read_csv("./us-zip-code-latitude-and-longitude.csv")

    zips, long, lats = zip_df["Zip"], zip_df["Longitude"], zip_df["Latitude"]

    # dictionary mapping zipcode to latitude and longitude
    zip_dict = {zips[i] : (long[i], lats[i]) for i in range(len(zips))}
    
    

    longitudes, latitudes = [], []

    zip_keyword = [ t for t in bank_df.columns if "zip" in str.lower(t) ][0] # find key that contains substring "zip"

    for zip_codes in bank_df[zip_keyword]:
        lon, lat = zip_dict[zip_code]
        longitudes.append(lon)
        latitudes.append(lat)

    bank_df["longitudes"], bank_df["latitudes"], = longitudes, latitudes
    bank_df.drop([zip_keyword], axis=1, inplace=True)
    return bank_df