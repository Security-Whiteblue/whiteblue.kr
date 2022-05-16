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

const data = require('../setting/data');
const logger = require('../setting/logger');

const isNumber = (num) => {
	if (typeof num === 'number') {
		return num - num === 0;
	}
	if (typeof num === 'string' && num.trim() !== ''){
		return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
	}
	return false;
};

//const connection = mysql.createConnection(data.mysql_data('notice'));
// mysql.createConnection issue
/*connection.connect(function(err){
	if (err){
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});*/

/*connection.query('SELECT * from user', (error, rows, fields) => {
	if (error) throw error;
	console.log('User info is: ', rows);
});
connection.end();*/

const pool = mysql.createPool(data.mysql_data('notice'));

router.get('/', function(req, res){
	logger.userInfo(req);
	pool.getConnection(function(error, connection){
		if (error) throw error;
		var sql = 'SELECT * FROM user';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
		connection.query(sql, function(error, results, fields){
			if (error) throw error;
			res.render('notice', {
				session: req.session.user,
				results: results
			});
		});
		connection.release();
	});
});

router.get('/:id', function(req, res){
	logger.userInfo(req);
	const id = req.params.id;
	if (!isNumber(id)){
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
					res.render('notice_', {
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

module.exports = router;