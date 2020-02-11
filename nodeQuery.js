/*This successfully pulls the json? from the controller */
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
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});





/* ESSENTIALLY PLAYGROUND */

/*Code below here is pieces of things that I was testing to try to get data pulled. Can look at it for syntax.
 */

/*var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
    'method': 'POST',
    'hostname': 'https://appdmsu.saas.appdynamics.com',
    'path': '/controller/restui/analytics/adql/query',
    'headers': {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-CSRF-TOKEN': '49bb53bccf4b4017418a863c174f045ad56e6832',
        'Authorization': 'Basic YXBwZG1zdUBhcHBkbXN1OjVjZThaZklsMjA=',
        /*
        'X-Events-API-AccountName': 'appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1',
        'X-Events-API-Key': 'f774c677-a969-4401-9d72-fbed038778ba',
        'Content-Type': 'application/vnd.appd.events+text;v=2',
        'Accept': 'application/vnd.appd.events+json;v=2'

         * /
    },
    'maxRedirects': 20
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });

    res.on("error", function (error) {
        console.error(error);
    });
});

var postData =  "{\"requests\":[{\"query\":\"SELECT * FROM transactions\",\"label\":\"DataQuery\",\"customResponseRequest\":true,\"responseConverter\":\"UIGRID\",\"responseType\":\"ORDERED\",\"start\":\"1581351328000\",\"end\":\"1581354928000\",\"chunk\":false,\"mode\":\"page\",\"scrollId\":\"\",\"size\":\"50\",\"offset\":\"0\",\"limit\":\"10000\"}],\"start\":\"\",\"end\":\"\",\"chunk\":false,\"mode\":\"none\",\"scrollId\":\"\",\"size\":\"\",\"offset\":\"\",\"limit\":\"10000\",\"chunkDelayMillis\":\"\",\"chunkBreakDelayMillis\":\"\",\"chunkBreakBytes\":\"\",\"others\":\"false\",\"emptyOnError\":\"false\",\"token\":\"\",\"dashboardId\":0,\"warRoomToken\":\"\",\"warRoom\":false}";

req.write(postData);

req.end();
* /
var request = require('request');
var options = {
    'method': 'GET',
    'url': 'https://appdmsu.saas.appdynamics.com/controller/auth?action=login',
    'headers': {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-CSRF-TOKEN': 'b96043fbf09c4b7a2cac5168a857879f9b80bd97',
        'Authorization': 'Basic YXBwZG1zdUBhcHBkbXN1OjVjZThaZklsMjA='
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});

/*
var request = require('request');
var options = {
    'method': 'GET',
    'url': 'https://appdmsu.saas.appdynamics.com/controller/api/accounts/myaccount',
    'headers': {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-CSRF-TOKEN': 'b96043fbf09c4b7a2cac5168a857879f9b80bd97',
        'Authorization': 'Basic YXBwZG1zdUBhcHBkbXN1OjVjZThaZklsMjA='
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
 */

/*
POST http://analytics.api.example.com/events/query?start=1422823420000&end=1423687476000&limit=20000 HTTP/1.1
    X-Events-API-AccountName:<global_account_name>
X-Events-API-Key:<api_key>
Content-Type: application/vnd.appd.events+text;v=2
Accept: application/vnd.appd.events+json;v=2

SELECT * FROM county WHERE size>=30 AND population>20000
 */

