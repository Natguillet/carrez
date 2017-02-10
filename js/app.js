var express = require('express');
var request = require('request');
var app     = express();
var leboncoin = require('./leboncoin');
var meilleuragents = require('./meilleuragents');
var path = require('path');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(bodyParser());
app.use(express.static(path.join(__dirname+'/public')));
app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/public/index.ejs'),{resp:'',square:'',low:'',hight:'',mean:''});
})

app.post('/', function(req, res){
  var url = req.body.url;
  leboncoin.readLeboncoin(url,request,function(data){
    meilleuragents.priceSquareMeter(data,request,function(info){
      console.log(info);
      res.render(path.join(__dirname + '/public/index.ejs'), {resp: info.type,square:info.prixsquare,low:info.prixbas,hight:info.prixhaut,mean:info.prixmoyen});
    });
    //res.sendFile(path.join(__dirname + '/result.html'));
  });
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})
