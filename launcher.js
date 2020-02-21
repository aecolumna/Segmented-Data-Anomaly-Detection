//tutorial i was following
//https://medium.com/@HolmesLaurence/integrating-node-and-python-6b8454bfc272


// import express JS module into app
// and creates its variable.
var express = require('express');
var app = express();

// Creates a server which runs on port 3000 and
// can be accessed through localhost:3000
app.listen(3000, function() {
    console.log('server running on port 3000');
} )


app.get('/tester', runTester);

function runTester(req, res) {
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["js_integration.py", req.query.x, req.query.y, req.query.z]);
    console.log('process spawned');
    process.stdout.on('data', function (data) {
       res.send(data.toString())
    });


}

//http://localhost:3000/tester?x=3&y=4&z=5

