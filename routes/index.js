var express = require('express');
var router = express.Router();
var Article = require("../models/Article");


/* GET home page. */
router.get('/', function (req, res, next) 
{
	// 如果沒登入就給我去登入
	if (req.session.logined)
	{
		// 
		var articles = [];
		Article.find({}).exec(
			function(err,result)
			{
				if(err) next(err)

				/*
				let test = new Article
				({
					name          : "這是測試"+Date.now(),
    				authorUserName: "JCxYIS",
    				lastEdit      : Date.now(),
    				content       : "now="+Date.now().toString(),
				})
				test.save();
				*/
				
				//console.log(result);
				res.render("billboard", {articleList: result});
			}
		);
	}
	else
	{
		res.redirect("login");
	}
});
module.exports = router;
