var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var json = {
 "prix" : 0,
 "ville": 0,
 "type":"",
 "surface":""
};

app.get('/scrape', function(req,res){
  url= 'https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s';
  request(url, function(error, response, html){
    // First we'll check to make sure no errors occurred when making the request

    if(!error){
      var $ = cheerio.load(html);
      $('#adview > section > section > section.properties.lineNegative > div:nth-child(9) > h2 > span.value').filter(function(){
          var data = $(this);
        json.surface = data.text().replace(/[^0-9]+/ig,"").slice(0,json.surface.length-1);
      })
      $('#adview > section > section > section.properties.lineNegative > div:nth-child(5) > h2 > span.value').filter(function(){
          var data = $(this);
        json.prix = data.text().replace(/[^0-9]+/ig,"");
      })
      $('#adview > section > section > section.properties.lineNegative > div.line.line_city > h2 > span.value').filter(function(){
          var data = $(this);
        json.ville = data.text().replace(/[^0-9]+/ig,"");
      })
      $('#adview > section > section > section.properties.lineNegative > div:nth-child(7) > h2 > span.value').filter(function(){
          var data = $(this);
        json.type = data.text();
      })
    }
    fs.writeFile('output.json',JSON.stringify(json,null,4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');

    })
    res.send('Check your console!')
  });
})



app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
