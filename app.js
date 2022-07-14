/**
 * 
 *            888                                               .d8888b.   .d8888b.  
 *          888                                               d88P  Y88b d88P  Y88b 
 *         888                                                     .d88P 888        
 *     .d88888  .d88b.  888  888        888  888 .d8888b         8888"  888d888b.  
 *   d88" 888 d8P  Y8b 888  888       888  888 88K               "Y8b. 888P "Y88b 
 *  888  888 88888888 Y88  88P      888  888 "Y8888b.      888    888 888    888 
 *  Y88b 888 Y8b.      Y8bd8P       Y88b 888      X88      Y88b  d88P Y88b  d88P 
 *  "Y88888  "Y8888    Y88P         "Y88888  88888P'       "Y8888P"   "Y8888P"  
 *                                     888                                       
 *                               Y8b d88P                                       
 *                                "Y88P"                                        
 * 
 * @author dev-ys-36
 * @link https://github.com/dev-ys-36
 * @license MIT LICENSE
 * 
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 * 
 */


const express = require('express');
const expressSession = require('express-session');

//const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

/**
 * WARNING { DATA }
 * This document should not be published as a security document.
 */
const data = require(__dirname + '/utils/data');
const logger = require(__dirname + '/utils/logger');

const indexjs = require(__dirname + '/router/index');

const authjs = require(__dirname + '/router/auth/auth');

const formjs = require(__dirname + '/router/form/form');

const noticejs = require(__dirname + '/router/notice/notice');

const profilejs = require(__dirname + '/router/profile');;

const http = require('http');
const https = require('https');

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

app.use(expressSession({
	secret: data.session_secretKey(),
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: true,
		maxAge: 1000 * 60 * 60 * 12 // 12 hours
	}
}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(function(req, res, next){
	if (!req.secure){
		res.redirect('https://whiteblue.kr' + req.url);
	}else{
		next();
	}
});

app.use('/', express.static(__dirname + '/public'));

app.use('/', indexjs);

app.use('/auth', authjs);

app.use('/form', formjs);

app.use('/notice', noticejs);

app.use('/profile', profilejs);

/*app.get('/version', function(req, res){
	logger.userInfo(req);
	res.render('version', { session: req.session.user });
});*/

app.get('/404', function(req, res){
	//logger.userInfo(req);
	res.render('404', { session: req.session.user });
});

app.get('*', function(req, res){
	logger.userInfo(req);
	res.redirect('/404');
});

http.createServer(app).listen(HTTP_PORT, '0.0.0.0');
https.createServer(data.ssl_options(), app).listen(HTTPS_PORT, '0.0.0.0');

logger.logo();