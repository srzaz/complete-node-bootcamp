"use strict";

var fs = require('fs');

var http = require('http');

var url = require('url');

var slugify = require('slugify');

var replaceTemplate = require('./modules/replaceTemplate'); //////////////////////////
// FILES
//blocking, synchronous
// const txtInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// const txtOut = `This is what we know about avocados: ${txtInput}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', txtOut);
// console.log('File written!');
//non-blocking, asynchronous
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File has been written.');
//             });
//         });
//     });
// });
// console.log('Will read');
/////////////////////////////
/////////////////////////////
// SERVER


var tempOverview = fs.readFileSync("".concat(__dirname, "/templates/template-overview.html"), 'utf-8');
var tempCard = fs.readFileSync("".concat(__dirname, "/templates/template-card.html"), 'utf-8');
var tempProduct = fs.readFileSync("".concat(__dirname, "/templates/template-product.html"), 'utf-8');
var data = fs.readFileSync("".concat(__dirname, "/dev-data/data.json"), 'utf-8');
var dataObj = JSON.parse(data);
var slugs = dataObj.map(function (el) {
  return slugify(el.productName, {
    lower: true
  });
});
var server = http.createServer(function (req, res) {
  var _url$parse = url.parse(req.url, true),
      query = _url$parse.query,
      pathname = _url$parse.pathname; //OVERVIEW 


  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    var cardsHtml = dataObj.map(function (el) {
      return replaceTemplate(tempCard, el);
    }).join('');
    var output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } // PRODUCT
  else if (pathname === '/product') {
      var product = dataObj[query.id];

      var _output = replaceTemplate(tempProduct, product);

      res.end(_output);
    } //API
    else if (pathname === '/api') {
        res.writeHead(200, {
          'Content-type': 'application/json'
        });
        res.end(data);
      } // NOT FOUND    
      else {
          res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
          });
          res.end('<h1>Page could not be found</h1>');
        }
});
server.listen(8000, '127.0.0.1', function () {
  console.log('Listening to requests on port 8000');
});