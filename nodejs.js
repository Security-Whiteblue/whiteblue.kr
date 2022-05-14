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
 * @deprecated 1.x
 * latest version 1.3
 */


const express = require('express');

const fetch = require('node-fetch'); /** 2.6.6 */

const requestIp = require('request-ip');

const http = require('http');

const https = require('https');
const fs = require('fs');

const app = express();

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const options = {
	ca: fs.readFileSync('/etc/letsencrypt/live/whiteblue.kr/fullchain.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/whiteblue.kr/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/whiteblue.kr/cert.pem')
};

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

app.use(function(req, res, next){
	if(!req.secure){
		res.redirect('https://'+ 'whiteblue.kr' + req.url);
	}else{
		next();
	}
});

app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.status(200).sendFile(__dirname + '/html/index.html');
	console.log(time() + ' client IP: ' + requestIp.getClientIp(req));
	console.log(time() + ' url: ' + req.url);
	getAsync(requestIp.getClientIp(req));
});

app.get('/version', function(req, res){
	res.status(200).sendFile(__dirname + '/html/version.html');
	console.log(time() + ' client IP: ' + requestIp.getClientIp(req));
	console.log(time() + ' url: ' + req.url);
	getAsync(requestIp.getClientIp(req));
});

app.get('/404', function(req, res){
	res.status(200).sendFile(__dirname + '/html/404.html');
});

app.get('*', function(req, res){
	res.redirect('https://' + 'whiteblue.kr' + '/404');
	console.log(time() + ' client IP: ' + requestIp.getClientIp(req));
	console.log(time() + ' url: ' + req.url);
	getAsync(requestIp.getClientIp(req));
});

http.createServer(app).listen(HTTP_PORT, '0.0.0.0');

https.createServer(options, app).listen(HTTPS_PORT, '0.0.0.0');