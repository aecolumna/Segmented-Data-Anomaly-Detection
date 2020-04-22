var bodyParser = require('body-parser');
var express = require('express')
let {PythonShell} = require('python-shell')


//var multer = require('multer');
const fs = require('fs');
const config = require('./config.json');
const dConfig = config.development;

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

var port = process.env.PORT || 8094

app.set('view engine', 'ejs')

var server = app.listen(port);

var limit = 1000;
var rollingRange = 24;

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

var minTime = getTimeMinimum(3600*rollingRange); //Min time is the UNIX time interval seconds previously

var mljsonstr;

//Function to swap which ML output file is used to populate information
function updateJSON(filename) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            return console.error(err);
        }
        mljsonstr = data.toString();
    });
}
updateJSON('./datafiles/ML.json');

//URL has limit (number of records to pull up to 10000) and start (UNIX time of earliest possible record to pull)
let url = dConfig.query_url + '?limit=' + limit + '&start=' + minTime;

let settings = {
    'method': 'POST',
    'url': url,
    'headers': {
        'X-Events-API-AccountName': dConfig.account_name,
        'X-Events-API-Key': dConfig.api_key,
        'Content-Type': 'application/vnd.appd.events+text;v=2',
        'Accept': 'application/vnd.appd.events+json;v=2'
    },
    body: 'SELECT * FROM transactions'
};


app.get('/home', function (request, response) {
    response.render('index2', {
        plotObj : plotObj,
        mljsonstr: mljsonstr
    })
})

app.get('/home2', function (request, response) {
    response.render('index2', {
        plotObj : plotObj,
        mljsonstr: mljsonstr
    })
});

//Anomalous band pages
app.get('/alt', function (request, response) {
    response.render('altpages', {
        mljsonstr: mljsonstr, //From ML output file
        prefix: request.query.band, //The anomaly band to inspect
        idx: request.query.idx //Which of the outputs to use
    })
});

app.get('/', function (request, response) {
    response.redirect('/params.ejs')
});

app.get('/andres', function (request, response) {

    response.render('andres.ejs', {
        plotObj : plotObj,
        mljsonstr: mljsonstr,
    })
});

//Displays a list of current saved files
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

    updateJSON("datafiles/"+fileName);
    response.redirect('/home');
});

//Route to parameters page
app.get('/params.ejs', function (request, response) {
    response.render('params', {
        rollingRange: rollingRange
    })
});

//Parameters page post, sets values if present
app.post('/params', function (request, response) {
    var range = request.body.range;
    var start = request.body.start;
    var starthrs = request.body.starthours;
    var startUnix = Math.round(new Date(start).getTime()) + starthrs * 60 * 60;
    var end = request.body.end;

    console.log(range);
    rollingRange = range;
    console.log(start);
    console.log(starthrs);
    console.log(end);

    var endUnix = startUnix + Number(end) * 60 * 60;
    var url = dConfig.query_url + '?limit=' + limit + '&start=' + startUnix + '&end=' + endUnix;
    let settings = {
        'method': 'POST',
        'url': url,
        'headers': {
            'X-Events-API-AccountName': dConfig.account_name,
            'X-Events-API-Key': dConfig.api_key,
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
            var today = new Date();
            var date = (today.getMonth()+1)+'-'+today.getDate() + '-' + today.getFullYear();
            storeData(data,"datafiles/apmData" + "-" + date +".json");

            response.redirect('/')
        });

})

//GET for data from controller
app.get('/data.ejs', function (request, response) {

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            article = JSON.stringify(json[0], null, 2);

            //spawns a child process that runs the data sanitizer and ML
            //documentation on pythonshell https://www.npmjs.com/package/python-shell
            let pyshell = new PythonShell('./python/js_integration.py');
            //below is a fix for a local problem where pythonshell defaulted to the wrong python installation. We left it in  in case you all also run into similar problems and need an example of a fix
            //let pyshell = new PythonShell('python/js_integration.py', {pythonPath : "C:\\Users\\john\\AppData\\Local\\Programs\\Python\\Python36\\python.exe"});

            //sends data to python
            pyshell.send(article);
            //catches any output from python. The driver file writes results to file so this is mostly for debug
            pyshell.on('message', function(message){
                var ml_results = message;
            });
            //closes child process
            pyshell.end(function (err) {
                if (err) {
                    throw err;
                }
                console.log('analysis done!');
            });

            //renders results
            response.render('data', {
                article: 'done'
            })
        });
})


//Provided function to escape characters in query
var escapeQuery = function(query){
    query = query.replace(/ /g,"%2520");
    query = query.replace(/=/g,"%253D");
    return query;
};

// Routes to the controller with the URL in tact to make the query
var openAdql = function(controller, query,end,start,response){
    var query = escapeQuery(query);
    var url = controller+"/controller/#/location=ANALYTICS_ADQL_SEARCH&timeRange=Custom_Time_Range.BETWEEN_TIMES."+end+"."+start+".120&adqlQuery="+query+"&searchType=SINGLE&searchMode=ADVANCED&viewMode=DATA";
    response.redirect(url);
};

// Route back to controller with query. query in GET
app.get('/testAnalytics', function (request,response) {

    var controller = dConfig.controller_url;
    var query = "SELECT * FROM transactions";
    var key = request.query.key; // Query formed in anomalous pages

    // Demo value when there is no data
    if (key == '0') {
        query += " WHERE mortgage >= 200 AND income <= 50";
    }
    else {
            query += " WHERE " + key;
    }

    //These are for selecting the time range to grab from. Currently grabs last 48 hours
    //Could be updated to hold rolling range or pull from ML
    var end = (new Date().getTime()) - 1;
    var start = end - 3600 * 48;
    var range = function(start,end){
        this.start = start;
        this.end = end;
    };
    openAdql(controller,query,end,start,response);
});


// These were here as early mockups
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
app.get('/demo', function (request, response) {
    response.render('demoVisuals')
});

console.log("http://localhost:" + port + '/')
console.log("kill using ctrl+c, not ctrl-z!")

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
    server.close();
});




































