var cheerio = require('cheerio');
var fs = require('fs');
var info = {
  "prixsquare":0,
  "prixbas":0,
  "prixmoyen":0,
  "prixhaut":0,
  "type":""
};


var priceSquareMeter = function(json,request,callback){
  var url= 'https://www.meilleursagents.com/prix-immobilier/'+ json.ville.toLowerCase() + '-'+json.codePostal;
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div.row.medium-uncollapse.baseline--half > div.small-12.medium-6.columns.prices-summary__cell--row-header').filter(function(){
        var price = $(this);
        info.type = price.text();
      })
      if(json.type === "Maison"){
        if (info.type.includes("maison")) {
          $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div.row.medium-uncollapse.baseline--half > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){
            var price = $(this);
            info.prixmoyen = price.text().replace(/[^0-9]+/ig,"");
          })
          $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div.row.medium-uncollapse.baseline--half > div.small-4.medium-2.medium-offset-0.columns.prices-summary__cell--muted').filter(function(){
            var price = $(this);
            info.prixbas = price.text().replace(/[^0-9]+/ig,"");
          })
          $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div.row.medium-uncollapse.baseline--half > div:nth-child(4)').filter(function(){
            var price = $(this);
            info.prixhaut = price.text().replace(/[^0-9]+/ig,"");
          })
        } else {
          $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){
            var price = $(this);
            info.prixmoyen = price.text().replace(/[^0-9]+/ig,"");
          })
          $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.medium-offset-0.columns.prices-summary__cell--muted').filter(function(){
            var price = $(this);
            info.prixbas = price.text().replace(/[^0-9]+/ig,"");
          })
          $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div:nth-child(4)').filter(function(){
            var price = $(this);
            info.prixhaut = price.text().replace(/[^0-9]+/ig,"");
          })
        }
      }
      else if(json.type ==="Appartement"){
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
    info.prixsquare = json.prix / json.surface ;
    if(info.prixsquare > info.prixmoyen){
      info.type="Bad deal";
    } else {
      info.type="Good deal";
    }
      callback && callback(info);
  });
}

exports.priceSquareMeter = priceSquareMeter;
