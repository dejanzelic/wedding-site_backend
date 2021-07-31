var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var inviteRouter = require('./routes/invite');
var answersRouter = require('./routes/answers');

var app = express();

app.use(cors({
	origin: process.env.CORS_URL,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/v1/invite', inviteRouter);
app.use('/v1/answers', answersRouter);


module.exports = app;
