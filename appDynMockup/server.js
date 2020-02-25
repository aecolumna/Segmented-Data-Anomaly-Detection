var bodyParser = require('body-parser');
var express = require('express')

//var multer = require('multer');
const fs = require('fs')

const middlewares = [
    bodyParser.urlencoded({ extended: true }),
];

var app = express()

app.use(express.static('public'))

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}))

// for parsing multipart/form-data
//app.use(upload.array());

var port = process.env.PORT || 8092

app.set('view engine', 'ejs')

var server = app.listen(port);

var limit = 200;

const fetch = require('node-fetch');

/* function to find the time value to pass as minimum
 * @param interval is the time in seconds that we go back by
 * @return UNIX time interval seconds ago
 */
function getTimeMinimum(interval) {
    var date = new Date();

    return Math.floor(date - interval * 1000);
}

function storeData(data, filepath="datafiles/apmData" + (new Date() - 0) + ".js") {
    try {
        fs.writeFileSync(filepath, data);
        console.log("Completed writing to" + filepath);
    } catch (err) {
        console.error(err)
    }
}

var minTime = getTimeMinimum(3600*12); //Min time is the UNIX time interval seconds previously


//URL has limit (number of records to pull up to 10000) and start (UNIX time of earliest possible record to pull)
let url = 'https://analytics.api.appdynamics.com/events/query?limit=' + limit + '&start=' + minTime;

let settings = {
    'method': 'POST',
    'url': url,
    'headers': {
        'X-Events-API-AccountName': 'appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1',
        'X-Events-API-Key': 'f774c677-a969-4401-9d72-fbed038778ba',
        'Content-Type': 'application/vnd.appd.events+text;v=2',
        'Accept': 'application/vnd.appd.events+json;v=2'
    },
    body: 'SELECT * FROM transactions'
};

var article;

app.get('/', function (request, response) {
    response.redirect('/params.ejs')
})

app.get('/home', function (request, response) {
    response.render('index')
})

app.get('/files.ejs', function (request, response) {
    var fileList = [];
    fs.readdir('datafiles/', function (err, files) {
        if (err) throw err;

        for (var index in files) {
            fileList.push(files[index]);
        }

        response.render('files', {
            fileList: fileList
        });
    });
});

app.get('/download/files', function (request, response) {
    var fileName = request.query.fileName;
    response.download("datafiles/"+fileName);
})

app.get('/params.ejs', function (request, response) {
    response.render('params', {
    })

})

app.post('/params', function (request, response) {
    var start = request.body.start;
    var starthrs = request.body.starthours;
    var startUnix = Math.round(new Date(start).getTime()) + starthrs * 60 * 60;
    var end = request.body.end;
    var endUnix = startUnix + Number(end) * 60 * 60;
    var url = 'https://analytics.api.appdynamics.com/events/query?limit=' + limit + '&start=' + startUnix + '&end=' + endUnix;
    let settings = {
        'method': 'POST',
        'url': url,
        'headers': {
            'X-Events-API-AccountName': 'appdmsu_c1887a44-cf00-4a84-8fa7-10a24c6638b1',
            'X-Events-API-Key': 'f774c677-a969-4401-9d72-fbed038778ba',
            'Content-Type': 'application/vnd.appd.events+text;v=2',
            'Accept': 'application/vnd.appd.events+json;v=2'
        },
        body: 'SELECT * FROM transactions'
    };
    fetch(url,settings)
        .then(res => res.json())
        .then((json) => {
            data = JSON.stringify(json[0],null,2);
            var nowt = (new Date().getTime()) - 1
            storeData(data,"datafiles/spcData"+nowt+"_"+endUnix+".js");

            response.redirect('/')
        });

})

app.get('/data.ejs', async function (request, response) {

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            article = JSON.stringify(json[0], null, 2);
            storeData(article);
            response.render('data', {
                article: article
            })
        });
})


app.get('/family_zip_ccavg_mortgage_edu.ejs', function (request, response) {
    response.render('family_zip_ccavg_mortgage_edu')
})

app.get('/family_3_edu_2_ccavg_4.ejs', function (request, response) {
    response.render('family_3_edu_2_ccavg_4')
})

app.get('/zip_code_94720_edu_1.ejs', function (request, response) {
    response.render('zip_code_94720_edu_1')
})

app.get('/mortgage_income.ejs', function (request, response) {
    response.render('mortgage_income')
})

app.get('/zip_code_91107.ejs', function (request, response) {
    response.render('zip_code_91107')
})



var escapeQuery = function(query){
    query = query.replace(/ /g,"%2520");
    query = query.replace(/=/g,"%253D");
    return query;
};
var openAdql = function(controller, query,end,start,response){
    var query = escapeQuery(query);
    var url = controller+"/controller/#/location=ANALYTICS_ADQL_SEARCH&timeRange=Custom_Time_Range.BETWEEN_TIMES."+end+"."+start+".120&adqlQuery="+query+"&searchType=SINGLE&searchMode=ADVANCED&viewMode=DATA";
    response.redirect(url);
};
app.get('/testAnalytics', function (request,response) {

    var controller = "https://appdmsu.saas.appdynamics.com";
    var query = "SELECT all FROM transactions";
    var key = request.query.key;
    if (key == 0) {
        query += " WHERE mortgage > XX AND income > XX";
    }

    var start = 1582313580199;
    var end = 1579635180000;
    var range = function(start,end){
        this.start = start;
        this.end = end;
    };
    openAdql(controller,query,end,start,response);


})

console.log("http://localhost:" + port + '/')
console.log("kill using ctrl+c, not ctrl-z!")

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
    server.close();
});



