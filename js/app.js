var express = require('express');
var request = require('request');
var app     = express();
var leboncoin = require('./leboncoin');
var meilleuragents = require('./meilleuragents');
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/', function(req, res){
  var url = req.body.url;
  leboncoin.readLeboncoin(url,request,function(data){
    meilleuragents.priceSquareMeter(data,request,function(info){
      console.log(info);
      var html = 'Voir console <br>'+
      '<a href="/">Try again.</a>';
      res.send(html);
    });
    //res.sendFile(path.join(__dirname + '/result.html'));
  });
});


app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})
