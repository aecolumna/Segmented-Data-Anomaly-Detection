function addLoadEvent(mljson,prefix,idx) {

    reformAlts('andres-plot',mljson, prefix, idx);

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

    formDonut('pieArea',values,"All Transactions",pull1);
    formDonut('pieArea2',values2,"Anomalous Transactions");
}

function indexLoadEvent(mljson) {
    reformIndex('andres-plot',mljson);
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
    formDonut('pieArea',values,"All Transactions",pull1);
    formDonut('pieArea2',values2,"Anomalous Transactions");
}