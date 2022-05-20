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

/**
 * WARNING { DATA }
 * This document should not be published as a security document.
 */
const data = require('../../utils/data');
const logger = require('../../utils/logger');

const isNumeric = (value) => {
	if (typeof value === 'number'){
		return value - value === 0;
	}
	if (typeof value === 'string' && value.trim() !== ''){
		return Number.isFinite ? Number.isFinite(+value) : isFinite(+value);
	}
	return false;
};

const pool = mysql.createPool(data.mysql_data('notice'));

/**
 * ../notice			{GET}
 * ../notice/read/id	{GET}
 * ../notice/write		{GET, POST}
 */

router.get('/', function(req, res){
	logger.userInfo(req);
	pool.getConnection(function(error, connection){
		if (error) throw error;
		var sql = 'SELECT * FROM user';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
		connection.query(sql, function(error, results, fields){
			if (error) throw error;
			res.render('notice/notice', {
				session: req.session.user,
				results: results
			});
		});
		connection.release();
	});
});

router.post('/modify', function(req, res){
	logger.userInfo(req);
	const { subject, editordata, files } = req.body;
	const username = 'admin';
	const id = req.session.ids;
	if (editordata){
		pool.getConnection(function(error, connection){
			if (error) throw error;
			var sql = 'SELECT * FROM user WHERE id=?';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
			connection.query(sql, [id], function(error, results, fields){
				if (error) throw error;
				console.log(results);
				if (results.length > 0){
					connection.query('UPDATE user SET subject = ?, txt = ? WHERE id = ?', [subject, editordata, id], function(error, data){
						if (error) throw error;
						console.log(data);
						res.send('<script type="text/javascript">alert("modify success"); document.location.href="/";</script>');
						res.end();
					});
				}else{
					res.send('<script type="text/javascript">alert("fail."); document.location.href="/";</script>');	
					res.end();
				}
			});
			connection.release();
		});
	}else{
		res.send('<script type="text/javascript">alert("fail."); document.location.href="/auth/login";</script>');	
		res.end();
	}
});

router.get('/modify/:id', function(req, res){
	logger.userInfo(req);
	const id = req.params.id;

	if (typeof(req.session.user) === 'undefined'){
		res.redirect('/auth/login');
		return;
	}
	
	req.session.ids = id; // notice id
	if (!isNumeric(id)){
		res.send('<script type="text/javascript">alert("only number."); document.location.href="/";</script>');	
		res.end();
	}else{
		pool.getConnection(function(error, connection){
			if (error) throw error;
			var sql = 'SELECT * FROM user WHERE id=?';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
			connection.query(sql, [id], function(error, results, fields){
				if (error) throw error;
				console.log(results);
				if (results.length > 0){
					res.render('notice/modify', {
						session: req.session.user,
						subject: results[0].subject,
						html: results[0].txt
					});
				}else{
					res.send('<script type="text/javascript">alert("fail."); document.location.href="/";</script>');	
					res.end();
				}
			});
		});
	}
});

router.get('/read/:id', function(req, res){
	logger.userInfo(req);
	const id = req.params.id;
	if (!isNumeric(id)){
		res.send('<script type="text/javascript">alert("only number."); document.location.href="/";</script>');	
		res.end();
	}else{
		pool.getConnection(function(error, connection){
			if (error) throw error;
			var sql = 'SELECT * FROM user WHERE id=?';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
			connection.query(sql, [id], function(error, results, fields){
				if (error) throw error;
				console.log(results);
				if (results.length > 0){
					res.render('notice/read', {
						session: req.session.user,
						subject: results[0].subject,
						html: results[0].txt
					});
				}else{
					res.send('<script type="text/javascript">alert("fail."); document.location.href="/";</script>');	
					res.end();
				}
			});
		});
	}
});

router.get('/write', function(req, res){
	logger.userInfo(req);
	if (req.session.user){
		res.render('notice/write', {
			session: req.session.user
		});
		console.log(req.session.user);
	}else{
		res.redirect('/auth/login');
	}
});

router.post('/write', function(req, res){
	logger.userInfo(req);
	const { subject, editordata, files } = req.body;
	const username = req.session.user['username'];
	if (editordata){
		pool.getConnection(function(error, connection){
			if (error) throw error;
			connection.query('SELECT * FROM user WHERE username = ? AND subject = ? AND txt = ?', [username, subject, editordata], function(error, results, fields){
				if (error) throw error;
				console.log(results)
				if (results.length <= 0){
					connection.query('INSERT INTO user (username, subject, txt) VALUES(?,?,?)', [username, subject, editordata], function(error, data){
						if (error) throw error;
						console.log(data);
					});
					res.send('<script type="text/javascript">alert("write success"); document.location.href="/";</script>');	
				}		 
				res.end();
			});
			connection.release();
		});
	}else{
		res.send('<script type="text/javascript">alert("fail."); document.location.href="/auth/login";</script>');	
		res.end();
	}
});

module.exports = router;