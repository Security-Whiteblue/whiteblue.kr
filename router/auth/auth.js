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
const router = express.Router();

const mysql = require('mysql');

/**
 * WARNING { DATA }
 * This document should not be published as a security document.
 */
const data = require('../../utils/data');
const logger = require('../../utils/logger');

const pool = mysql.createPool(data.mysql_data('auth'));

const html = (content, url) => {
	return '<script type="text/javascript">alert("' + content + '"); document.location.href="' + url + '";</script>';
};

const checkEmail = (content) => {
	var email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	return !email.test(email) ? true : false;
}

/**
 * ../auth/login			{GET, POST}
 * ../auth/logout			{GET}
 * ../auth/register			{GET, POST}
 */

router.get('/login', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) !== 'undefined'){
		res.redirect('/');
		return;
	}

	res.render('auth/login', { session: req.session.user });
});

router.post('/login', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) !== 'undefined'){
		res.redirect('/');
		return;
	}

	const { email, pwd } = req.body;

	if (!checkEmail(email)){
		res.send(html('fail.', '/auth/login'));
		return;
	}

	if (email && pwd){
		pool.getConnection(function(error, connection){
			if (error) throw error;

			connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, pwd], function(error, results, fields){
				if (error) throw error;

				connection.release();

				if (results.length <= 0){
					res.send(html('account does not match.', '/auth/login'));
					return;
				}

				req.session.user = {
					id: results[0].id,
					username: results[0].username,
					password: results[0].password,
					email: results[0].email
				};

				res.send(html('login success.', '/'));
			});
		});
	}else{
		res.send(html('fail.', '/auth/login'));
	}
});

router.get('/logout', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) === 'undefined'){
		res.redirect('/auth/login');
		return;
	}

	req.session.destroy(function(error){
		if (error) throw error;
		
		res.send(html('logout success.', '/'));
	});
});

router.get('/register', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) !== 'undefined'){
		res.redirect('/');
		return;
	}
	
	res.render('auth/register', { session: req.session.user });
});

router.post('/register', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) !== 'undefined'){
		res.redirect('/');
		return;
	}

	const { usr, email, pwd, pwdc } = req.body;

	if (!checkEmail(email)){
		res.send(html('fail.', '/auth/register'));
		return;
	}

	if (pwd != pwdc){
		res.send(html('password does not match.', '/auth/register'));
		return;
	}

	if (usr && pwd && email && pwdc){
		pool.getConnection(function(error, connection){
			if (error) throw error;

			connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [usr, pwd, email], function(error, results, fields){
				if (error) throw error;

				if (results.length > 0){
					res.send(html('email already.', '/auth/register'));
					return;
				}

				connection.query('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [usr, pwd, email], function (error, results){
					if (error) throw error;

					connection.release();
				});

				res.send(html('register success', '/'));
			});
		});
	}else{
		res.send(html('fail.', '/auth/register'));
	}
});

module.exports = router;