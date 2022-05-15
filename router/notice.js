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

const connection = mysql.createConnection(data.mysql_data('notice'));
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
	var sql = 'SELECT * FROM user';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
	connection.query(sql, function(error, results, fields){
		if (error) throw error;
		res.render('notice', {
			session: req.session.user,
			results: results
		});
	});
});

router.get('/:id', function(req, res){
	id = req.params.id;
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
	//connection.end();
});

module.exports = router;