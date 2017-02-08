var info = {
  "prixsquare":0,
  "prixbas":0,
  "prixmoyen":0,
  "prixhaut":0,
  "type":""
};


var priceSquareMeter = function(fs){
  var data = JSON.parse(fs.readFileSync("output.json","UTF-8"));
  var url= 'https://www.meilleursagents.com/prix-immobilier/'+ data.ville.toLowerCase() + '-'+data.codePostal;
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      $('#synthese > div.prices-summary.baseline > div.prices-summary__values > div.row.medium-uncollapse.baseline--half > div.small-12.medium-6.columns.prices-summary__cell--row-header').filter(function(){
        var price = $(this);
        info.type = price.text();
        console.log(info.type.includes("maison"));
      })
      if(data.type === "Maison"){
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
  });
}

var isGoodDeal = function(){
  if(info.prixsquare > info.prixmoyen){
    console.log("Mauvais deal");
  } else {
    console.log("Good deal");
  }
}

exports.isGoodDeal = isGoodDeal;
esports.priceSquareMeter = priceSquareMeter;
