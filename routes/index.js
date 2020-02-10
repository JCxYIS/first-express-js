var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) 
{
  //res.render('index', { title: '首頁\n<a src="index.html">Title</a>' });
  res.sendFile( path.dirname(__dirname) + "/views/index.html" );
});

router.post('/loginAction', function (req, res) 
{
  res.send('POST request to the homepage');
  // 输出 JSON 格式
  var response = {
    "uname":req.body.uname,
    "psw":req.body.psw
  };
  console.log(response);
  res.send(JSON.stringify(response));
})



module.exports = router;
