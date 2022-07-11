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


const fs = require('fs');

const fetch = require('node-fetch'); /** 2.6.6 */

const requestIp = require('request-ip');

const VERSION = '2.2v';

const info = (content) => {
	log(content);
	console.log(content);
}

const log = (content) => {
	var path =  './log/' + date() + '.txt';

	if (!fs.existsSync('./log')){
		fs.mkdirSync('./log', function(error){
			if (error) throw error;
		});
	}

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
		info(prefix() + ' country: ' + json['country']);
	}catch(error){
		info(error);
	}finally{
	}
};

const date = () => {
	let today = new Date();

	var year = today.getFullYear();
	var month = ('0' + (today.getMonth() + 1)).slice(-2);
	var day = ('0' + today.getDate()).slice(-2);
	var date = year + '-' + month + '-' + day

	return date;
};

const time = () => {
	let today = new Date();

	var hours = ('0' + today.getHours()).slice(-2); 
	var minutes = ('0' + today.getMinutes()).slice(-2);
	var seconds = ('0' + today.getSeconds()).slice(-2);
	var time = hours + ':' + minutes + ':' + seconds;

	return time;
};

const prefix = () => {
	return '[' + date() + ' ' + time() + ']'; 
};

const logo = () => {
	var logo = '';
	logo += ",--.   ,--,--.    ,--. ,--.       ,--.  ,--.              \n";
	logo += "|  |   |  |  ,---.`--,-'  '-.,---.|  |-.|  ,--.,--.,---.  \n";
	logo += "|  |.'.|  |  .-.  ,--'-.  .-| .-. | .-. |  |  ||  | .-. : \n";
	logo += "|   ,'.   |  | |  |  | |  | \\   --| `-' |  '  ''  \\   --. \n";
	logo += "'--'   '--`--' `--`--' `--'  `----'`---'`--'`----' `----' \n";

	info(logo);
	info(prefix() + ' Version: ' + VERSION);
	info(prefix() + ' Author: dev-ys-36 / https://github.com/dev-ys-36');
	info(prefix() + ' Github: https://github.com/Security-Whileblue');
	info(prefix() + ' Website: https://whiteblue.kr');
};

const userInfo = (req) => {
	info(prefix() + ' client IP: ' + requestIp.getClientIp(req));
	info(prefix() + ' url: ' + req.originalUrl);
	getAsync(requestIp.getClientIp(req));
};

module.exports.date = date;
module.exports.time = time;
module.exports.logo = logo;
module.exports.userInfo = userInfo;