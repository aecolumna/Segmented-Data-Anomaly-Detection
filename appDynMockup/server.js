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

// var https = require('follow-redirects').https;
// var fs = require('fs');
//
// var options = {
//     'method': 'GET',
//     'hostname': '{{controller_host}}',
//     'path': '/controller/api/accounts/myaccount',
//     'headers': {
//         'Content-Type': 'application/json;charset=UTF-8',
//         'X-CSRF-TOKEN': '{{X-CSRF-TOKEN}}'
//     },
//     'maxRedirects': 20
// };
//
// var req = https.request(options, function (res) {
//     var chunks = [];
//
//     res.on("data", function (chunk) {
//         chunks.push(chunk);
//     });
//
//     res.on("end", function (chunk) {
//         var body = Buffer.concat(chunks);
//         console.log(body.toString());
//     });
//
//     res.on("error", function (error) {
//         console.error(error);
//     });
// });
//
// req.end();