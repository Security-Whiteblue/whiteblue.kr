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

const pool = mysql.createPool(data.mysql_data('form'));

const html = (content, url) => {
	return '<script type="text/javascript">alert("' + content + '"); document.location.href="' + url + '";</script>';
};

const rand_num = () => {
	const characters ='0123456789';
	let result = '';
	const charactersLength = characters.length;

	for (let i = 0; i < 4; i++){
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	
	return result;
}

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
 * ../form				{GET}
 * ../form/email		{POST}
 * ../form/read/id		{GET}
 * ../form/write		{GET, POST}
 */

router.get('/', function(req, res){
	logger.userInfo(req);

	if (typeof(req.session.user) === 'undefined'){
		res.redirect('/auth/login');
		return;
	}

	pool.getConnection(function(error, connection){
		if (error) throw error;

		connection.query('SELECT * FROM user ORDER BY id DESC', function(error, results, fields){
			if (error) throw error;

			connection.release();

			res.render('form/form', {
				session: req.session.user,
				results: results
			});
		});
	});
});

router.post('/email', function(req, res){
	logger.userInfo(req);

	const { email } = req.body;

	if (email){
		if (typeof(req.session.form) !== 'undefined'){
			if (req.session.form['fcount'] >= 5){
				res.send('??????????????? 5??? ?????? ??????????????????. 12?????? ??? ?????? ???????????????.');
				return;
			}
			
			res.send('<p>?????? ?????? ???????????? ??????????????? ??????????????????.</p><br><input type="text" name="email_num" id="email_num" placeholder="??????????????? ???????????????.." style="width: 100%;"><button type="button" class="email_button" onclick="return ajax2()">????????????</button>');
			return;
		}

		res.send('<p>?????? ???????????? ??????????????? ?????????????????????.</p><br><input type="text" name="email_num" id="email_num" placeholder="??????????????? ???????????????.." style="width: 100%;"><button type="button" class="email_button" onclick="return ajax2()">????????????</button>');
	}else{
		res.send('fail');
	}

	var random_number = rand_num();

	req.session.form = {
		id : email,
		num: random_number,
		fcount: 0,
		status: false
	};
	req.session.save();

	data.sendEmail(email, '[Security Whiteblue] ???????????? ??????', '????????????: ' + random_number);
});

router.post('/email_test', function(req, res){
	logger.userInfo(req);

	const { email_num } = req.body;

	console.log(req.session);

	if (email_num){
		if (req.session.form['fcount'] >= 5){
			res.send('??????????????? 5??? ?????? ??????????????????. 12?????? ??? ?????? ???????????????.');
			return;
		}

		if (email_num != req.session.form['num']){
			++req.session.form['fcount'];
			res.send('??????????????? ' + req.session.form['fcount'] + '??? ??????????????????.');
			return;
		}

		res.send('<br><div class="form_form"><form name="form_write" action="/form/write" method="post" onsubmit="return check(this)"><h3 style="text-align: center;">????????? ?????????</h3><div><input type="text" name="name" id="name" placeholder="????????? ???????????????.." style="width: 100%;"></div><div><input type="text" name="num" id="num" placeholder="????????? ???????????????.." style="width: 100%;"></div><div><input type="text" name="phone" id="phone" placeholder="??????????????? ???????????????.." style="width: 100%;"></div><br><h4>?????? ??????</h4><textarea class="form-control" name="motive" id="motive" rows="9" placeholder="??????????????? ???????????????.." onkeyup="counter(this, 400)"></textarea><span id="count">0 / 400 ???</span><div class="form_btn"><input type="submit" value="????????????" style="width: 100%;"></div></form></div>');
		req.session.form['status'] = true;
		req.session.save();
	}

	/*if (email_num){
		if (email_num != req.session.form['num']){
			res.send(html('wrong number.', '/'));
			return;
		}

		res.send(html('correct number.', '/'));
		req.session.form['status'] = true;
		req.session.save();
	}*/
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
			if (error) throw error;

			connection.release();
			
			if (results.length <= 0){
				res.send(html('fail.', '/'));
				return;
			}

			res.render('form/read', { data: results[0] });
		});
	});
});

router.get('/write', function(req, res){
	logger.userInfo(req);

	res.render('form/write', { /*session: req.session.form*/ });
});

router.post('/write', function(req, res){
	logger.userInfo(req);

	const { name, num, phone, motive } = req.body;

	if (name && num && phone && motive){
		if (typeof(req.session.form) === 'undefined'){
			res.send(html('????????? ?????? ??? ????????? ??? ????????????.', '/'));
			return;
		}

		if (!req.session.form['status']){
			res.send(html('????????? ?????? ??? ????????? ??? ????????????.', '/'));
			return;
		}

		pool.getConnection(function(error, connection){
			if (error) throw error;

			connection.query('SELECT * FROM user WHERE studentid = ?', [num], function(error, results, fields){
				if (error) throw error;

				if (results.length > 0){
					res.send(html('form fail.', '/'));
					return;
				}

				const date = logger.date() + ' ' + logger.time();
				const email = req.session.form.id;

				connection.query('INSERT INTO user (date, username, studentid, email, phone, content1, content2, content3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [date, name, num, email, phone, motive , ' ', ' '], function(error, results, fileds){
					if (error) throw error;
					
					connection.release();
				});

				res.send(html('form success.', '/'));
			});
		});
	}else{
		res.send(html('form fail.', '/'));
	}
});

module.exports = router;