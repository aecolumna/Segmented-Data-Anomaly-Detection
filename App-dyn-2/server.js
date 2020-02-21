
var templates = require('./server/templating');
var links = templates.links;
var products = require('./server/products.js')
var express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs')
const fetch = require('node-fetch');
const getSet = require('./server/data_pulling')

var getSettings = getSet.getSettings;

var app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

var port = process.env.PORT || 8081

app.get('/', function (request, response) {

  response.render('pages/welcome', {
    links: links
  })
})

app.get('/diagnostics', function (request, response) {
  response.render('pages/diagnostics', {
    links: links,
    sandwich: links[0]
  })
})

app.get('/appdynamics', function (request, response) {
  response.render('pages/appdynamics')
})


app.get('/cluster', function (request, response) {
  response.render('pages/cluster')
})
app.get('/reuben', function (request, response) {
  response.render('pages/reuben', {
    links: links,
    sandwich: links[0]
  })
})


app.get('/data', function (request, response) {

  var limit = request.query.tran_number;

  let settings = getSet.getSettings(limit);
  let url = settings.url;

  fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        var article = JSON.stringify(json[0], null, 2);
        getSet.storeData(article);
        response.render('pages/data', {
          article: article
        })
      });
})



app.post('/appdynamics', function (request, response) {
  console.log(request.body)

  response.render('pages/appdynamics', {
    links: links,
    sandwich: links[2]
  })

})

app.get('/products/:slug', function (request, response) {
  response.json(products[request.params.slug])
})

app.post('/products', function (request, response) {
  console(request.body);

  var slug = request.body.name.trim().toLowerCase().split(' ').join('-')
  products[slug] = request.body
  response.redirect('/products/' + slug)
})



console.log("http://localhost:" + port + '/')
app.listen(port)
