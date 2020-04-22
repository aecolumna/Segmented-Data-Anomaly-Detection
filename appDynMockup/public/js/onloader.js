/* Function to form the two pies at page top.
    mljson - json of ML output
 */
function topPies(mljson) {
    //Colors of the pie slices
    var colors = ["yellow", "orange", "red", "RGB(90,187,71)"];
    var labels = ["Slow", "Very Slow", "Error", "Normal"];

    //values from the ML output to get total % of each anomaly
    var values = [
        mljson.homepage.slow_percent * mljson.homepage.anomalous_percent,
        mljson.homepage.very_slow_percent * mljson.homepage.anomalous_percent,
        mljson.homepage.error_percent * mljson.homepage.anomalous_percent,
        1 - mljson.homepage.anomalous_percent
    ];
    var values2 = [
        mljson.homepage.slow_percent,
        mljson.homepage.very_slow_percent,
        mljson.homepage.error_percent
    ];

    //Popout argument to pie
    var pull1 = [0.1,0.1,0.1,0];
    formDonut('pieArea',values,"All Transactions", labels, colors, pull1);
    formDonut('pieArea2',values2,"Anomalous Transactions", labels, colors);
}


/* Function that forms anomalous pages
    mljson - json ML output
    prefix - the anomalous band name
    idx - which output we are using
 */
function addLoadEvent(mljson,prefix,idx) {

    // Populate scatter and information on the page
    reformAlts('andres-plot',mljson, prefix, idx);

    //Create the pies of the anomalous pages - top + 2 stats pies
    topPies(mljson);
    formDonut('pieRecall',
        [mljson[prefix].recall[idx],1 - mljson[prefix].recall[idx]],
        "Recall of " + prefix + " band",
        [prefix + " Anomalies Captured", prefix + " Anomalies Missed"],
        ["orange","gray"]
    );
    formDonut('pieAccuracy',
        [mljson[prefix].precision[idx],1 - mljson[prefix].precision[idx]],
        "Precision of " + prefix + " band",
        [prefix + " Anomalies Captured","Normal Transactions Miscaptured"],
        ["orange","red"]
    );
}


/* Populates the home pages
    mljson - json ML output
 */
function indexLoadEvent(mljson) {

    //Populates scatter and information
    reformIndex('andres-plot',mljson);
    topPies(mljson);
}