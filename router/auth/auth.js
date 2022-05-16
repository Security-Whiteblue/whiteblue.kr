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


const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const data = require('../../setting/data');
const logger = require('../../setting/logger');

const pool = mysql.createPool(data.mysql_data('auth'));

/**
 * ../auth/login			{GET, POST}
 * ../auth/logout	        {GET}
 * ../auth/register		    {GET, POST}
 */

router.get('/login', function(req, res){
	logger.userInfo(req);
	if (req.session.user){
		res.redirect('/');
	}else{
		res.render('auth/login', {
			session: req.session.user
		});
	}
});

router.post('/login', function(req, res){
	logger.userInfo(req);
	const { email, pwd } = req.body;
	if (email && pwd){
		pool.getConnection(function(error, connection){
			if (error) throw error;
			connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, pwd], function(error, results, fields){
				if (error) throw error;
				console.log(results);
				if (results.length > 0){
					req.session.user = {
						email: email,
						pwd: pwd,
						name: 'no',
						authorized: true
					};
					res.send('<script type="text/javascript">alert("login success."); document.location.href="/";</script>');
					res.end();
				}else{
					res.send('<script type="text/javascript">alert("account does not match."); document.location.href="/login";</script>');
				}
			});
			connection.release();
		});
	}else{		
		res.send('<script type="text/javascript">alert("fail."); document.location.href="/login";</script>');	
		res.end();
	}
});

router.get('/logout', function(req, res){
	logger.userInfo(req);
	if (req.session.user){
		req.session.destroy(function(err){
			if(err){
				console.log('세션 삭제 에러');
				return;
			}
			console.log('세션 삭제 성공');
			res.send('<script type="text/javascript">alert("logout success."); document.location.href="/";</script>');
			res.end();
		});
	}else{
		res.redirect('/auth/login');
	}
});

router.get('/register', function(req, res){
	logger.userInfo(req);
	if (!req.session.user){
		res.render('auth/register', {
			session: req.session.user
		});
		console.log(req.session.user);
	}else{
		res.redirect('/');
	}
});

router.post('/register', function(req, res){
	logger.userInfo(req);
	const { usr, email, pwd, pwdc } = req.body;
	if (usr && pwd && email && pwdc){
		pool.getConnection(function(error, connection){
			if (error) throw error;
			connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [usr, pwd, email], function(error, results, fields){
				if (error) throw error;
				if (results.length <= 0 && pwd == pwdc){
					connection.query('INSERT INTO user (username, password, email) VALUES(?,?,?)', [usr, pwd, email], function (error, data){
						if (error) throw error;
						console.log(data);
					});
					res.send('<script type="text/javascript">alert("register success"); document.location.href="/";</script>');
				}else if(pwd != pwdc){			
					res.send('<script type="text/javascript">alert("password does not match."); document.location.href="/auth/register";</script>');
				}else{
					res.send('<script type="text/javascript">alert("email already."); document.location.href="/auth/register";</script>');
				}
				res.end();
			});
			connection.release();
		});
	}else{
		res.send('<script type="text/javascript">alert("fail."); document.location.href="/auth/register";</script>');
		res.end();
	}
	console.log(req.body);
	console.log(usr);
	console.log(email);
	console.log(pwd);
});

module.exports = router;