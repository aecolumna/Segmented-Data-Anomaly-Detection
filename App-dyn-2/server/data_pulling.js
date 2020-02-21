// functions to save json locally and post request.

const fs = require('fs')


var limit = 200;

const fetch = require('node-fetch');

function storeData(data, filepath="apmData.js") {
    try {
        fs.writeFileSync(filepath, data);
        console.log("Completed writing to" + filepath);
    } catch (err) {
        console.error(err)
    }
}

function getSettings(limit) {

    var settings = {
        'method': 'POST',
        'url': 'https://analytics.api.appdynamics.com/events/query?limit=' + limit,
        'headers': {
            'X-Events-API-AccountName': 'appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1',
            'X-Events-API-Key': 'f774c677-a969-4401-9d72-fbed038778ba',
            'Content-Type': 'application/vnd.appd.events+text;v=2',
            'Accept': 'application/vnd.appd.events+json;v=2'
        },
        body: 'SELECT * FROM transactions'
    };

    return settings;
}

module.exports = {
    'getSettings': getSettings,
    'storeData' : storeData
}