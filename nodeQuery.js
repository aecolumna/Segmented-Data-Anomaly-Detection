var request = require('request');
var fs = require('fs');

/* function to find the time value to pass as minimum
 * @param interval is the time in seconds that we go back by
 * @return UNIX time interval seconds ago
 */
function getTimeMinimum(interval) {
    var date = new Date();

    return Math.floor(date - interval * 1000);
}

/*This successfully pulls the json? from the controller */

function pullData() {
    var minTime = getTimeMinimum(3600*12); //Min time is the UNIX time interval seconds previously
    var options = {
        'method': 'POST',
        'url': 'https://analytics.api.appdynamics.com/events/query?limit=10000&start=' + minTime,
        'headers': {
            'X-Events-API-AccountName': '',
            'X-Events-API-Key': '',
            'Content-Type': 'application/vnd.appd.events+text;v=2',
            'Accept': 'application/vnd.appd.events+json;v=2'
        },
        body: 'SELECT * FROM transactions'
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        fs.writeFile("output_"+minTime+".json",response.body, function(err) {
            if (err) {
                console.log("error in pullData() request")
                throw err;
            }
            console.log('pullData() saved output_' + minTime + '.json');
        });
    });
}


function pullDataLoop(frequencyms) {
    console.log("pullDataLoop() frequency: " + frequencyms);
    pullData();
    setTimeout(pullDataLoop,frequencyms,'frequencyms');
}

pullDataLoop(10000);
