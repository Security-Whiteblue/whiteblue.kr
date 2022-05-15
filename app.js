/**
 * 
 *         888                                                    .d8888b.   .d8888b.  
 *        888                                                  d88P  Y88b d88P  Y88b 
 *       888                                                       .d88P 888        
 *   .d88888  .d88b.  888  888        888  888 .d8888b           8888"  888d888b.  
 *  d88" 888 d8P  Y8b 888  888       888  888 88K                "Y8b. 888P "Y88b 
 *  888  888 88888888 Y88  88P      888  888 "Y8888b.      888    888 888    888 
 *  Y88b 888 Y8b.      Y8bd8P       Y88b 888      X88      Y88b  d88P Y88b  d88P 
 *  "Y88888  "Y8888    Y88P         "Y88888  88888P'       "Y8888P"   "Y8888P"  
 *                                     888                                       
 *                               Y8b d88P                                       
 *                                "Y88P"                                        
 */


/**
 * latest version - 2.1 : 보안 패치 및 키 암호화 , 데이터 파일 분리
 * todo 2.2 - 지원서 폼 지원
 */


/*originText = 'TEST_KEY';

// base64 encoding
base64EncodedText = Buffer.from(originText, 'utf8').toString('base64');
console.log('Base64 Encoded Text: ', base64EncodedText);

// base decoding
base64DecodedText = Buffer.from(base64EncodedText, 'base64').toString('utf8');
console.log('Base64 Decoded Text: ', base64DecodedText);*/


const express = require('express');
const expressSession = require('express-session');
//const ejs = require('ejs');
const bodyParser = require('body-parser');

const fetch = require('node-fetch'); /** 2.6.6 */

const requestIp = require('request-ip');

const http = require('http');
const https = require('https');

const app = express();

//import { options } from __dirname + '/setting/data.js';
const data = require(__dirname + '/setting/data');

const indexjs = require(__dirname + '/router/index');
const loginjs = require(__dirname + '/router/login');
const logoutjs = require(__dirname + '/router/logout');
const registerjs = require(__dirname + '/router/register');
const noticejs = require(__dirname + '/router/notice');
const writejs = require(__dirname + '/router/write');

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const getAsync = async(ip) => {
	try{
		const response = await fetch('http://ip-api.com/json/' + ip);
		const json = await response.json();
		console.log(time() + ' country: ' + json['country']);
	}catch(err){
		console.log(err);
	}finally{
		
	}
};

const time = () => {
	let today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);
	var date = year + '-' + month + '-' + day

	var hours = ('0' + today.getHours()).slice(-2); 
	var minutes = ('0' + today.getMinutes()).slice(-2);
	var seconds = ('0' + today.getSeconds()).slice(-2);
	var time = hours + ':' + minutes + ':' + seconds;

	return '[' + date + ' ' + time + ']';
};

const log = (req) => {
	console.log(time() + ' client IP: ' + requestIp.getClientIp(req));
	console.log(time() + ' url: ' + req.url);
	getAsync(requestIp.getClientIp(req));
};

app.use(expressSession({
	secret: data.session_data(),
	resave: false,
	saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next){
	if(!req.secure){
		res.redirect('https://'+ 'whiteblue.kr' + req.url);
	}else{
		//log(req);
		next();
	}
});

app.use('/', express.static(__dirname + '/public'));

//app.use('/', indexjs);

app.get('/', function(req, res){
	res.render('index', {
		session: req.session.user
	});
	console.log(req.session.user);
	log(req);
});


app.use('/login', loginjs);

app.use('/logout', logoutjs);

app.use('/register', registerjs);

app.use('/write', writejs);

app.use('/notice', noticejs);

app.get('/profile', function(req, res){
	if (req.session.user){
		res.render('profile', {
			session: req.session.user
		});
		log(req);
	}else{
		res.redirect('/login');
	}
});

app.get('/version', function(req, res){
	res.render('version', {
		session: req.session.user
	});
});

app.get('/404', function(req, res){
	res.render('404', {
		session: req.session.user
	});
});

app.get('*', function(req, res){
	res.redirect('https://' + 'whiteblue.kr' + '/404');
	log(req);
});

http.createServer(app).listen(HTTP_PORT, '0.0.0.0');

https.createServer(data.ssl_options(), app).listen(HTTPS_PORT, '0.0.0.0');