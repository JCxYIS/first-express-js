var express = require('express');
var router = express.Router();
var User = require('../models/User');
const path = require('path');

// Page
router.get('/', function(req, res, next) 
{
  //
  res.sendFile( path.dirname(__dirname) + "/views/loginPage.html" );
  //res.render("loginPage");
});


// Log in
router.post('/loginAction', function (req, res) {
	let newuser = new User
	({
		name: req.body.name,
		uname: req.body.uname,
		psw: req.body.psw
	});

	// result strings
	let resultStr = 
	{
		title: "ts",
		message: "ms"
	};

	// find if account has already exist
	User.findOne({uname: req.body.uname, psw: req.body.psw}).exec(
		function(err,result)
		{
			if(err)	
				return next(err); // throw err to expressjs;

			if (result == null) // no 
			{
				resultStr.title = "身分認證失敗";
				resultStr.message = "帳號或密碼錯誤";
			}
			else // yes
			{
        	  	req.session.logined = true;
			  	req.session.loginUser = result.uname;
			  	resultStr.title = "身分認證成功";
				resultStr.message = "登入身分為 "+req.session.loginUser;
			}
			
			console.log("[登入]用戶資訊：", newuser, "\nResult:", resultStr.title);
			res.render('index', resultStr);
		}
	);
	// load
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
		title: "t",
		message: "m"
	};
	
	// find if account has already exist
	User.findOne({uname: req.body.uname}).exec(
		function(err,result)
		{
			if(err)	
				return next(err); // throw err to expressjs;

			if(result == null) // no cunt yee
			{
				// save account
				newuser.save(
					function(err)
					{
						return next(err); // throw err to expressjs
					}
				);

				resultStr.title = "創建成功！";
				resultStr.message = "你的帳號是"+req.body.uname+"\n請重新登入！";
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

// Log out
router.post('/logoutAction', function (req, res) {
	console.log("[登出]用戶：", req.session.loginUser);
	req.session.loginUser = null;
	req.session.logined = false;
	res.render('index', {title:"登出成功", message: "再見"});
});


module.exports = router;
