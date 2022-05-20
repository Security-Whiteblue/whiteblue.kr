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

const pool = mysql.createPool(data.mysql_data('notice'));

const html = (content, url) => {
	return '<script type="text/javascript">alert("' + content + '"); document.location.href="' + url + '";</script>';
};

const isNumeric = (value) => {
	if (typeof value === 'number'){
		return value - value === 0;
	}
	if (typeof value === 'string' && value.trim() !== ''){
		return Number.isFinite ? Number.isFinite(+value) : isFinite(+value);
	}
	return false;
};

/**
 * ../notice			{GET}
 * ../notice/read/id	{GET}
 * ../notice/write		{GET, POST}
 */

router.get('/', function(req, res){
	logger.userInfo(req);

	pool.getConnection(function(error, connection){
		if (error) throw error;

		connection.query('SELECT * FROM user', function(error, results, fields){
			connection.release();

			if (error) throw error;

			res.render('notice/notice', {
				session: req.session.user,
				results: results
			});
		});
	});
});

router.post('/modify', function(req, res){
	logger.userInfo(req);

	const { subject, editordata, files } = req.body;
	const id = req.session.ids;

	if (typeof(req.session.user) === 'undefined'){
		res.redirect('/auth/login');
		return;
	}

	if (editordata){
		pool.getConnection(function(error, connection){
			if (error) throw error;

			connection.query('SELECT * FROM user WHERE id = ?', [id], function(error, results, fields){
				if (error) throw error;

				if (results.length <= 0){
					res.send(html('fail.', '/'));
					return;
				}

				connection.query('UPDATE user SET subject = ?, txt = ? WHERE id = ?', [subject, editordata, id], function(error, results){
					connection.release();

					if (error) throw error;

					res.send(html('modify success', '/notice'));
				});
			});
		});
	}else{
		res.send(html('fail.', '/auth/login'));
	}
});

router.get('/modify/:id', function(req, res){
	logger.userInfo(req);

	const id = req.params.id;
	req.session.ids = id; // notice id

	if (typeof(req.session.user) === 'undefined'){
		res.redirect('/auth/login');
		return;
	}

	if (!isNumeric(id)){
		res.send(html('only number.', '/'));
		return;
	}
	
	pool.getConnection(function(error, connection){
		if (error) throw error;
		
		connection.query('SELECT * FROM user WHERE id = ?', [id], function(error, results, fields){
			connection.release();
			
			if (error) throw error;
			
			if (results.length <= 0){
				res.send(html('fail.', '/'));
				return;
			}

			res.render('notice/modify', {
				session: req.session.user,
				subject: results[0].subject,
				html: results[0].txt
			});
		});
	});
});

router.get('/read/:id', function(req, res){
	logger.userInfo(req);

	const id = req.params.id;

	if (!isNumeric(id)){
		res.send(html('only number.', '/'));
		return;
	}

	pool.getConnection(function(error, connection){
		if (error) throw error;
		
		connection.query('SELECT * FROM user WHERE id = ?', [id], function(error, results, fields){
			connection.release();
			
			if (error) throw error;
			
			if (results.length <= 0){
				res.send(html('fail.', '/'));
				return;
			}

			res.render('notice/read', {
				session: req.session.user,
				subject: results[0].subject,
				html: results[0].txt
			});
		});
	});
});

router.get('/write', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) === 'undefined'){
		res.redirect('/auth/login');
		return;
	}

	res.render('notice/write', { session: req.session.user });
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

				if (results.length > 0){
					res.send(html('fail', '/notice'));
					return;
				}

				connection.query('INSERT INTO user (username, subject, txt) VALUES (?, ?, ?)', [username, subject, editordata], function(error, results){
					connection.release();

					if (error) throw error;
				});

				res.send(html('write success', '/notice'));
			});
		});
	}else{
		res.send(html('fail', '/auth/login'));
	}
});

module.exports = router;