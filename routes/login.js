var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Log in
router.post('/loginAction', function (req, res) {
	var response =
	{
		"uname": req.body.uname,
		"psw": req.body.psw
	};

	console.log("[登入]用戶資訊：", response);
	res.render('index',
		{
			title: '好棒，你登入了',
			message: '使用的帳號是' + response.uname
		});
})

// Sign up
router.post('/signupAction', function (req, res) {

	// make new user class
	var newuser = new User
		({
			name: req.body.uname,
			uname: req.body.uname,
			psw: req.body.psw
		})
	
	// result strings
	var resultStr = 
	{
		title: String,
		message: String
	}

	// find if account has already exist
	User.findOne({account: req.body.account}).exec(
		function(err,result)
		{
			if(err)
				return next(err); // throw err to expressjs
			if(result == null) // no cunt yee
			{
				// save account
				newuser.save(
					function(err)
					{
						if(err)
							return next(err); // throw err to expressjs
					}
				);

				// then, you logged in
				req.session.logined = true;
				req.session.account = req.body.account;
				resultStr.title = "創建成功！";
				resultStr.message = "你的帳號是"+req.body.account;
			}
			else // you cunt
			{
				resultStr.title = "錯誤";
				resultStr.message = req.body.account+" 已經有同名的帳號了";
			}
		}
	)

	// print success msg
	console.log("[創號]用戶資訊：", newuser, "\nResult:", resultStr.title);
	res.render('index', resultStr);
})



module.exports = router;
