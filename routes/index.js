var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: '首頁\n<a src="index.html">Title</a>' });
  res.sendFile( __dirname + "..//views/index.html" );
});



module.exports = router;
