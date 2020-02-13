var bodyParser = require('body-parser');
var express = require('express')

var app = express()

app.use(express.static('public'))

var port = process.env.PORT || 8090

app.set('view engine', 'ejs')

var server = app.listen(port);

var limit = 100;

/////////////////////////
const fetch = require('node-fetch');

let url = 'https://analytics.api.appdynamics.com/events/query?limit=' + limit;

let settings = {
    'method': 'POST',
    'url': 'https://analytics.api.appdynamics.com/events/query?' + limit,
    'headers': {
        'X-Events-API-AccountName': 'appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1',
        'X-Events-API-Key': 'f774c677-a969-4401-9d72-fbed038778ba',
        'Content-Type': 'application/vnd.appd.events+text;v=2',
        'Accept': 'application/vnd.appd.events+json;v=2'
    },
    body: 'SELECT * FROM transactions'
};

var article;

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        article = json;
    });

app.get('/', function (request, response) {
    response.render('index')
})

//console.log(article);

app.get('/data.ejs', async function (request, response) {

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            article = JSON.stringify(json[0], null, 2);
            response.render('data', {
                article: article
            })
        });
})

console.log("http://localhost:" + port + '/')
console.log("kill using ctrl+c, not ctrl-z!")

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
    server.close();
});



