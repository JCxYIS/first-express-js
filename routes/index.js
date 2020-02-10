var express = require('express');
var router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) 
{
  //
  res.sendFile( path.dirname(__dirname) + "/views/index.html" );
});

// Log in
router.post('/loginAction', function (req, res) 
{
  var response = 
  {
    "uname":req.body.uname,
    "psw":req.body.psw
  };

  console.log("[登入]用戶資訊：", response);
  res.render( 'index', 
  {
    title: '好棒，你登入了', 
    message: '使用的帳號是'+response.uname
  } );
})

// Sign up
router.post('/signupAction', function (req, res) 
{
  var response = 
  {
    "name":req.body.uname,
    "uname":req.body.uname,
    "psw":req.body.psw
  };

  console.log("[創號]用戶資訊：", response);
  res.render( 'index', 
  {
    title: '創立帳號成功', 
    message: '新帳號是'+response.uname
  } );
})



module.exports = router;
