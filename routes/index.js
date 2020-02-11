var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) 
{
	// 如果沒登入就給我去登入
	if (req.session.logined)
	{
		res.render("index", {title:"signed in"});
	}
	else
		res.redirect("login");
});
module.exports = router;
