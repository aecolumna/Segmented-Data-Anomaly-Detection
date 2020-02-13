

const fs = require('fs')

function storeData(data, filepath="apmData.js") {
    try {
        fs.writeFileSync(filepath, data);
        console.log("Completed writing to" + filepath);
    } catch (err) {
        console.error(err)
    }
}

// Caleb's function to pull data from APM
function APM() {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://analytics.api.appdynamics.com/events/query?limit=10000',
        'headers': {
            'X-Events-API-AccountName': 'appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1',
            'X-Events-API-Key': 'f774c677-a969-4401-9d72-fbed038778ba',
            'Content-Type': 'application/vnd.appd.events+text;v=2',
            'Accept': 'application/vnd.appd.events+json;v=2'
        },
        body: 'SELECT * FROM transactions'
    };

    var rawData = null;

    request(options, function (error, response) {
        if (error) throw new Error(error);
        rawData = response.body;
        storeData(rawData);
    });

    return rawData;
}

module.exports = {
    'lemonade': {
        name: 'Lemonade',
        price: '$1.00'
    },
    'APM' : APM
    ,
    'ice-water': {
        name: 'Ice water',
        price: '$0.00'
    },
    'chocolate-chip-cookies': {
        name: 'Chocolate chip cookies',
        price: '$1.50'
    }
}