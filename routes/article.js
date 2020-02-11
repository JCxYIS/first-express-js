var express = require('express');
var router = express.Router();
var Article = require("../models/Article");


router.param("id", function (req, res, next, name) {
	req.articleId = name;
	Article.findOne({ _id: name }).exec(
		function (err, result) {
			if (err) next(err)

			//console.log(result);
			req.article = result
			return next();
		}
	);
});

router.get('/scp/:id', function (req, res) {
	console.log('[View Article] ID=' + req.articleId);
	req.session.readingArticle = req.articleId;
	if(req.article.authorUserName == req.session.loginUser)
		res.render("article", { articleObj: req.article, canEdit: true, isEditing: false });
	else
		res.render("article", { articleObj: req.article, canEdit: false, isEditing: false });
})

router.get('/create', function (req, res) {
	let newArt = new Article({ authorUserName: req.session.loginUser })
	req.session.editingArticle = 0;
	res.render("article", { articleObj: newArt, canEdit: true, isEditing: true });
})

router.post('/edit', function (req, res) {
	Article.findOne({ _id: req.session.readingArticle }).exec(
		function (err, result) 
		{
			if (err) next(err)
			req.session.editingArticle = req.session.readingArticle;
			res.render("article", { articleObj: result, canEdit: true, isEditing: true });
		}
	);
})

router.post('/delete', function (req, res) {
	Article.deleteOne({ _id: req.session.readingArticle }).exec(
		function (err, result) 
		{
			if (err) next(err)

			res.render("index", { title:"削除。", message:"除掉了" });
		}
	);
})

router.post('/save', function (req, res) {
	//
	Article.findOne({ _id: req.session.editingArticle}).exec(
		function (err, result) {
			if (err) return console.log(err)

			// result strings
			let resultStr = 
			{
				title: "ts",
				message: "ms"
			};
			
			// update database
			if (result == null) // if no existed, just save
			{
				let responce = new Article
				({
					name: req.body.name,
					authorUserName: req.session.loginUser,
					lastEdit: Date.now(),
					content: req.body.content
				})
				resultStr.title = "已建立文章";
				resultStr.message = responce.toString();
				responce.save();
			}
			else 
			{
				if(result.authorUserName == req.session.loginUser)
				{
					result.name = req.body.name;
					result.lastEdit = Date.now();
					result.content = req.body.content;
					resultStr.title = "已更新文章";
					resultStr.message = result.toString();
					result.save();
				}
				else
				{
					resultStr.title = "權限不符";
					resultStr.message = "Are you a hacker?";
				}
			}

			// let's end this
			console.log("[文章]", resultStr.message , "Result:", resultStr.title);
			res.render('index', resultStr);
		}
	);
})


module.exports = router;