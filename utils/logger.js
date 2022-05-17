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
 * 
 * 
 * @author dev-ys-36
 * @link https://github.com/dev-ys-36
 * @license MIT LICENSE
 * 
 * 
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 * 
 * 
 */


const fs = require('fs');

const fetch = require('node-fetch'); /** 2.6.6 */

const requestIp = require('request-ip');

const VERSION = '2.1v';

const log = (content) => {
	var path =  './log.txt';

	if (!fs.existsSync(path)){
		fs.open(path, 'w', function(error, fd){
			if (error) throw error;
		});
	}

	fs.appendFile(path, content + "\n", function(error){
		if (error) throw error;
	});
};

const getAsync = async(ip) => {
	try{
		const response = await fetch('http://ip-api.com/json/' + ip);
		const json = await response.json();
		const log1 = time() + ' country: ' + json['country'];
		log(log1);
		console.log(log1);
	}catch(error){
		console.log(error);
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

const logo = () => {
	var logo = '';
	logo += ",--.   ,--,--.    ,--. ,--.       ,--.  ,--.              \n";
	logo += "|  |   |  |  ,---.`--,-'  '-.,---.|  |-.|  ,--.,--.,---.  \n";
	logo += "|  |.'.|  |  .-.  ,--'-.  .-| .-. | .-. |  |  ||  | .-. : \n";
	logo += "|   ,'.   |  | |  |  | |  | \\   --| `-' |  '  ''  \\   --. \n";
	logo += "'--'   '--`--' `--`--' `--'  `----'`---'`--'`----' `----' \n";

	console.log(logo);
	console.log(time() + ' Version: ' + VERSION);
	console.log(time() + ' Author: dev-ys-36 / https://github.com/dev-ys-36');
	console.log(time() + ' Github: https://github.com/Security-Whileblue');
	console.log(time() + ' Website: https://whiteblue.kr');
};

const userInfo = (req) => {
	var log1 = time() + ' client IP: ' + requestIp.getClientIp(req);
	var log2 = time() + ' url: ' + req.originalUrl;
	console.log(log1);
	console.log(log2);
	log(log1);
	log(log2);
	getAsync(requestIp.getClientIp(req));
};

module.exports.logo = logo;
module.exports.userInfo = userInfo;