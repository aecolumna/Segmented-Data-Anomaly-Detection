function topPies(mljson) {
    var colors = ["yellow", "orange", "red", "RGB(90,187,71)"];
    var labels = ["Slow", "Very Slow", "Error", "Normal"];
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
    var pull1 = [0.1,0.1,0.1,0];
    formDonut('pieArea',values,"All Transactions", labels, colors, pull1);
    formDonut('pieArea2',values2,"Anomalous Transactions", labels, colors);
}

function addLoadEvent(mljson,prefix,idx) {

    reformAlts('andres-plot',mljson, prefix, idx);

    topPies(mljson);
    formDonut('pieRecall',
        [mljson[prefix].recall[idx],1 - mljson[prefix].recall[idx]],
        "Recall of " + prefix + " band",
        [prefix + " Anomalies Captured", prefix + " Anomalies Missed"],
        ["orange","gray"]
    );
    formDonut('pieAccuracy',
        [mljson[prefix].accuracy[idx],1 - mljson[prefix].accuracy[idx]],
        "Accuracy of " + prefix + " band",
        [prefix + " Anomalies Captured","Normal Transactions Miscaptured"],
        ["orange","red"]
    );
}

function indexLoadEvent(mljson) {
    reformIndex('andres-plot',mljson);

    topPies(mljson);
}