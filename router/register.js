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
 * 보안 패치가 완료된 파일입니다.
 */


const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const data = require('../setting/data');

const connection = mysql.createConnection(data.mysql_data('auth'));
// mysql.createConnection issue
connection.connect(function(err){
	if (err){
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

/*connection.query('SELECT * from user', (error, rows, fields) => {
	if (error) throw error;
	console.log('User info is: ', rows);
});
connection.end();*/

router.get('/', function(req, res){
	res.render('register', {
		session: req.session.user
	});
});

router.post('/', function(req, res){
	const { usr, email, pwd, pwdc } = req.body;
	if (usr && pwd && email && pwdc) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [usr, pwd, email], function(error, results, fields){
			if (error) throw error;
			if (results.length <= 0 && pwd==pwdc) {
				connection.query('INSERT INTO user (username, password, email) VALUES(?,?,?)', [usr, pwd, email], function (error, data){
					if (error) throw error;
					console.log(data);
				});
				res.send('<script type="text/javascript">alert("register success"); document.location.href="/";</script>');	
			}else if(pwd!=pwdc){				
				res.send('<script type="text/javascript">alert("password does not match."); document.location.href="/register";</script>');	
			}else{
				res.send('<script type="text/javascript">alert("email already."); document.location.href="/register";</script>');	
			}			
			res.end();
		});
		//connection.end();
	} else {
		res.send('<script type="text/javascript">alert("fail."); document.location.href="/register";</script>');	
		res.end();
	}
	console.log(req.body);
	console.log(usr);
	console.log(email);
	console.log(pwd);
});

module.exports = router;