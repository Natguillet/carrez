var cheerio = require('cheerio');
var fs = require('fs');
var json = {
  "prix" : 0,
  "codePostal": 0,
  "ville":"",
  "type":"",
  "surface":""
};
var regAccentE = new RegExp('[éèêë]', 'gi');

var readLeboncoin = function(url,request,callback){
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
        json.codePostal = data.text().replace(/[^0-9]+/ig,"");
        json.ville = data.text().replace(new RegExp("[^a-zA-Z\-]", "g"), '');
      })
      $('#adview > section > section > section.properties.lineNegative > div:nth-child(7) > h2 > span.value').filter(function(){
        var data = $(this);
        json.type = data.text();
        if(json.type === "Oui" || json.type === "Non"){
          $('#adview > section > section > section > div:nth-child(8) > h2 > span.value').filter(function(){
            var data = $(this);
            json.type = data.text();
          })
          $('#adview > section > section > section > div:nth-child(10) > h2 > span.value').filter(function(){
            var data = $(this);
            json.surface = data.text().replace(/[^0-9]+/ig,"").slice(0,json.surface.length-1);
          })
        }
      })
    }
    console.log(json);
    callback(json);
  });
}
exports.readLeboncoin = readLeboncoin;
