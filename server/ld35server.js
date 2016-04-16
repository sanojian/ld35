/**
 * Created by jonas on 2016-04-16.
 */

var express = require('express');
var config = require('./config');
var http = require('http');
var path = require('path');

var app = module.exports = express();

app.set('port', config.express.port);

app.use(express.static(path.join(__dirname, '../client/dist')));

var theApp = http.createServer(app);
theApp.listen(app.get('port'));

