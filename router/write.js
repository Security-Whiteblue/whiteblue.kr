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
	if (req.session.user){
		res.render('write', {
			session: req.session.user
		});
		console.log(req.session.user);
	}else{
		res.redirect('/login');
	}
});

router.post('/', function(req, res){
	const { subject, editordata, files } = req.body;
	const username = 'admin';
	if (editordata){
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
		//connection.end();
	}else{
		res.send('<script type="text/javascript">alert("fail."); document.location.href="/login";</script>');	
		res.end();
	}
});

module.exports = router;