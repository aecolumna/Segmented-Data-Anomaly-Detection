var express = require('express')
var app = express()

app.use(express.static('public'))

var port = process.env.PORT || 8085

app.set('view engine', 'ejs')

app.listen(port)

app.get('/', function (request, response) {
    response.render('index')
})

console.log("http://localhost:" + port + '/')

/*This successfully pulls the json? from the controller */
var request = require('request');
var options = {
    'method': 'POST',
    'url': 'https://analytics.api.appdynamics.com/events/query',
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