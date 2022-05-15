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


const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
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
		//log(req);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;