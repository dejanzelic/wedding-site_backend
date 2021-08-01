var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var fs = require('fs')

var inviteRouter = require('./routes/invite');
var answersRouter = require('./routes/answers');
var healthRouter = require('./routes/health');

// Log all requests to a file. This is in the off chance that the db gets corrupted, we can at least build back what we had
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' })
var errorLogStream = fs.createWriteStream(path.join(__dirname, '/logs/error.log'), { flags: 'a' })

logger.token('body', (req, res) => JSON.stringify(req.body))
logger.token('error', (req, res) => JSON.stringify(res.errBody))
logger.token('stack', (req, res) => res.errStack ? res.errStack  : "")

var app = express();

app.use(cors({
	origin: process.env.CORS_URL,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(logger('dev'));
app.use(logger(':method :url :status :response-time ms - :res[content-length] :body',
	{
		stream: accessLogStream,
		skip: (req, res) => req.baseUrl === '/v1/healthcheck'
	}),
);
app.use(logger(':method :url :status :response-time ms - :res[content-length] :error :stack',
	{
		stream: errorLogStream,
		skip: (req, res) => res.statusCode < 400
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/v1/invite', inviteRouter);
app.use('/v1/answers', answersRouter);
app.use('/v1/healthcheck', healthRouter);
app.use(function (err, req, res, next) {
	console.error(err.stack)
	err.code = err.code ? err.code : 500
	body = {
		code: err.code,
		type: err.type ? err.type : "GENERIC_ERROR",
		message: err.customMessage ? err.customMessage : "Something went wrong"
	}
	if (process.env.NODE_ENV !== "production"){
		body.details = err.stack
	}else{
		res.errStack = err.stack
	}
	res.errBody = body
	res.status(err.code).send(body)
})


module.exports = app;
