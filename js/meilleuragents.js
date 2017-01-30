var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


var infos{
  "ville":''
  "prixapp":0
  "prixmaison":0
  "prixloyer":0
}

app.get('/scrape2',function(req,res){
  url= 'https://www.meilleursagents.com/prix-immobilier/';
})
