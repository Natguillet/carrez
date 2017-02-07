var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var info = {
  "prixsquare":0,
  "prixbas":0,
  "prixmoyen":"",
  "prixhaut":0
};

var data = JSON.parse(fs.readFileSync("output.json","UTF-8"));
app.get('/scrape2',function(req,res){
      url= 'https://www.meilleursagents.com/prix-immobilier/'+ data.ville.toLowerCase() + '-'+data.codePostal;
      request(url, function(error, response, html){
        if(!error){
          var $ = cheerio.load(html);
          if(data.type === "Maison"){
            $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){
              var price = $(this);
              info.prixmoyen = price.text().replace(/[^0-9]+/ig,"");
            })
            /*$('#synthese > div.prices-summary.baseline > div.prices-summary__values > div.row.medium-uncollapse.baseline--half > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){
              var price = $(this);
              info.prixmoyen = price.text().replace(/[^0-9]+/ig,"");
            })*/
            $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.medium-offset-0.columns.prices-summary__cell--muted').filter(function(){
              var price = $(this);
              info.prixbas = price.text().replace(/[^0-9]+/ig,"");
            })
            $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div:nth-child(4)').filter(function(){
              var price = $(this);
              info.prixhaut = price.text().replace(/[^0-9]+/ig,"");
            })
          }
          else if(data.type ==="Appartement"){
            $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){
              var price = $(this);
              info.prixmoyen = price.text().replace(/[^0-9]+/ig,"");
            })
            $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.medium-offset-0.columns.prices-summary__cell--muted').filter(function(){
              var price = $(this);
              info.prixbas = price.text().replace(/[^0-9]+/ig,"");
            })
            $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div:nth-child(4)').filter(function(){
              var price = $(this);
              info.prixhaut = price.text().replace(/[^0-9]+/ig,"");
            })
          }
        }
        info.prixsquare = data.prix / data.surface ;
        console.log(info.prixsquare);
        console.log(info.prixmoyen);
        console.log(url);
        if(info.prixsquare > info.prixmoyen){
          res.send("Mauvais deal");
        } else {
          res.send("Good deal");
        }
      });
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
