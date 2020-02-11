var express = require('express');
var router = express.Router();
var User = require('../models/User');

// Log in
router.post('/loginAction', function (req, res) {
	let response =
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
router.post('/signupAction', function (req, res, next) {

	// make new user class
	let newuser = new User
		({
			name: req.body.name,
			uname: req.body.uname,
			psw: req.body.psw
		})
	
	// result strings
	let resultStr = 
	{
		title: "loading",
		message: "now loading"
	};
	
	// find if account has already exist
	User.findOne({uname: req.body.uname}).exec(
		function(err,result)
		{
			if(err)
			{	
				return next(err); // throw err to expressjs;
			}

			if(result == null) // no cunt yee
			{
				// save account
				newuser.save(
					function(err)
					{
						return next(err); // throw err to expressjs
					}
				);

				// then, u r logged in
				req.session.logined = true;
				req.session.account = req.body.account;
				resultStr.title = "創建成功！";
				resultStr.message = "你的帳號是"+req.body.uname;
			}
			else // you cunt
			{
				resultStr.title = "錯誤";
				resultStr.message = req.body.uname+" 已經有同名的帳號了";
			}

			// print success msg
			console.log("[創號]用戶資訊：", newuser, "\nResult:", resultStr.title);
			res.render('index', resultStr);
		}
	);

	// loading
	
})



module.exports = router;
