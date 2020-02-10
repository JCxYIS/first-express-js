/* Created by Andrew Lin on Jan 2018. */
/* 大家加油喔喔喔喔喔喔喔喔喔喔 */
var express = require('express');
var router = express.Router();

/* require mongoose和我們所定義的mongoose schema */
var mongoose = require('mongoose');
var user = require('../models/user');
var message = require('../models/message');
var article = require('../models/article');

/* 首頁 */
router.get('/', function(req, res, next) {
  // article.find({}).then((result) => {
  //   if (Object.keys(result).length === 0){
  //     res.render('index', { title: '首頁', req: req, result: Object()});
  //   }else{
  //     return result;
  //   }
  // }, (err) => {
  //   next(err);
  // }).then((result) => {
  //   let badasspromise = [];
  //   console.log("1");
  //   console.log(result);
  //   for (let i = 0; i<=1 ;i++){
  //     console.log(i);
  //     //console.log(result[])
  //     badasspromise.push(
  //       user.findOne({account: result[i].account}).then((result_user) => {
  //         if(result_user === null){
  //           result[i].name = "已刪除用戶";
  //           return result;
  //         }else{
  //           result[i].name = result_user.name;
  //           return result;
  //         }
  //       }, (err) => {
  //         next(err);
  //       })
  //     )
  //   }
  //   Promise.all(badasspromise).then((result) => {
  //     console.log('2');
  //     console.log(result);
  //     res.render('index', { title: '首頁', req: req, result: result});
  //   })
  // })


  /* 從資料庫撈出所有article */
  article.find({}).exec(function(err,result){
    if(err){next(err)}
    /* 檢查有沒有article在資料庫裡 */
    if (Object.keys(result).length === 0){
      res.render('index', { title: '首頁', req: req, result: Object()});
    }else{
      /* 設一個counter */
      let count = 0;
      for (let i in result){
        /* 把每一個article都加入使用者的匿名 */
        user.findOne({account: result[i].account}).exec(function(err,result_user){
          if(err){next(err)}
          if(result_user === null){
            result[i].name = "已刪除用戶";
          }else{
            result[i].name = result_user.name;
          }
          /* counter加一 */
          count = count + 1;
          /* 當每一個article都加入使用者的匿名之後 */
          if(count === Object.keys(result).length){

            var model = Object();
            model.result = result;
            model.title = '首頁';
            model.req  =  req;
            res.render('index', model);
          }
        })
      }
    }
  });
});

/* 登入頁面 */
router.get('/login',function(req, res, next){
  /* 如果已經登入就導回首頁 */
  if (req.session.logined) {
  	res.redirect('/');
  }else{
    /* render頁面 */
    res.render('login', { title: '登入'});
  }
});

/* 登入功能 */
router.post('/login_action',function(req, res, next){
  /* 如果已經登入就導回首頁 */
  if (req.session.logined) {
  	res.redirect('/');
  }else{
    /* 兩格都要填不然就送回登入頁面 */
    if((req.body.account)&&(req.body.password)){
      /* 檢查是否符合帳密 */
      user.findOne({account: req.body.account, password: req.body.password}).exec(function(err,result){
        /* 找不找的到任何一筆資料 */
        if (result !== null){
          /* 登入 */
          req.session.logined = true;
          req.session.account = result.account;
          req.session.type = result.type;
          /* 導回首頁 */
          res.redirect('/');
        }else{
          res.redirect('login');
        }
      })
    }else{
      res.redirect('login');
    }
  }
});

/* 註冊頁面 */
router.get('/register',function(req, res, next){
  /* 如果已經登入就導回首頁 */
  if (req.session.logined) {
  	res.redirect('/');
  }/* render頁面 */
    res.render('register', { title: '註冊'});
});

/* 註冊功能 */
router.post('/register_action',function(req, res, next){
  /* 如果已經登入就導回首頁 */
  if (req.session.logined) {
  	res.redirect('/');
  }else{
    /* 三格都要填不然就送回註冊頁面 */
    if((req.body.account)&&(req.body.name)&&(req.body.password)){
      /* 檢查是不是有人已經用過一樣的帳號 */
      user.findOne({account:req.body.account}).exec(function(err,result){
        /* 找不到任何一筆資料 */
        if (result === null){
          /* 儲存 */
          var temp = new user({
            account:  req.body.account,
            name:     req.body.name,
            password: req.body.password,
            type:     "normal"
          }).save(function(err){
            if(err){
              return next(err)
            }
            /* 儲存完後登入 */
            req.session.logined = true;
            req.session.account = req.body.account;
            req.session.type = "normal";
            /* 導回首頁 */
            res.redirect('/');
          });
        }else{
          res.redirect('register');
        }
      })
    }else{
      res.redirect('register');
    }
  }
});

/* 登出功能 */
router.get('/logout',function(req, res, next){
  /* 把session給destory掉 */
  req.session.destroy(function(err){
    if (err){
      return next(err);
    }
    /* 導回首頁 */
    res.redirect('/');
  });
});

/* 新增文章功能 */
router.post('/post_article',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('login')
  }else{
    /* content是空的導回首頁 */
    if(!req.body.content){
      res.redirect('/');
    }else{
      /* 儲存完後導回首頁 */
      var temp = new article({
        account: req.session.account,
        content: req.body.content
      }).save(function(err){
        if(err){
          return next(err)
        }
        res.redirect('/')
      });
    }
  }
});

/* 刪除文章功能 */
router.get('/delete_article/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login')
  }else{
    /* 確定傳進來的是不是有效id */
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
      /* 確定這篇文章真的是他發的或他是管理員 */
      article.findById(req.params.id).exec(function(err,result){
        if (err) {return next(err)};
        /* 真的有這個文章 */
        if (result !== null){
          if (result.account === req.session.account || req.session.type === "admin"){
            /* 刪除 */
            result.remove();
            res.redirect('/');
          }else{
            res.redirect('/');
          }
        }else{
          res.redirect('/');
        }
      })
    }else{
      res.redirect('/');
    }
  }
})

/* 修改文章頁面 */
router.get('/edit_article/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login')
  }else{
    /* 確定傳進來的是不是有效id */
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
      /* 像資料庫查詢這篇文章是不是他發的 */
      article.findById(req.params.id).exec(function(err,result){
        if (err) {return next(err)};
        /* 真的有這個文章 */
        if (result !== null){
          /* 確定這篇文章真的是他發的或他是管理員 */
          if (result.account === req.session.account || req.session.type === "admin"){
            /* render頁面 */
            res.render('edit_article', { title: '修改文章', result: result});
          }else{
            res.redirect('/')
          }
        }else{
          res.redirect('/')
        }
      })
    }else{
      res.redirect('/')
    }
  }
});

/* 修改文章功能 */
router.post('/edit_article_action/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login');
  }else{
    /* 文章改成空的就導回前一頁 */
    if (req.body.content){
      /* 確定傳進來的是不是有效id */
      if (mongoose.Types.ObjectId.isValid(req.params.id)){
        /* 像資料庫查詢這篇文章 */
        article.findById(req.params.id).exec(function(err,result){
          if (err) {return next(err)};
          /* 真的有這個文章 */
          if (result !== null){
            /* 確定這篇文章真的是他發的或他是管理員 */
            if (result.account === req.session.account || req.session.type === "admin"){
              /* 修改資料 */
              result.set('content',req.body.content);
              result.save(function(err){
                if(err){return next(err)}
              });
              res.redirect('/');
            }else{
              res.redirect('/');
            }
          }else{
            res.redirect('/');
          }
        })
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('back')
    }
  }  
});

/* 查看文章頁面 */
router.get('/article/:id',function(req, res, next){
  /* 確定傳進來的是不是有效id */
  if (mongoose.Types.ObjectId.isValid(req.params.id)){
    /* 用Id從資料庫找文章 */
    article.findById(req.params.id).exec(function(err,result){
      if (err){return next(err)}
      /* 有沒有對應這個id的文章  */
      if (result === null){
        /* 沒這篇文章就送回首頁 */
        res.redirect('/');
      }else{
        /* 找這個使用者的暱稱 */
        user.findOne({account: result.account}).exec(function(err,result_name){
          if (err){return next(err)}
          /* 把暱稱加進去 */
          if (result === null){
            /* 沒這使用者就說是已經刪除的使用者 */
            result.name = "已刪除之使用者";
          }else{
            /* 有這使用者 */
            result.name = result_name.name;
          }
          /* 從資料庫撈出所有這則article的message */
          message.find({article_id: req.params.id}).exec(function(err,result_message){
            if (err){return next(err)}
            /* 檢查有沒有message在資料庫裡 */
            if (Object.keys(result_message).length === 0){
              res.render('article', { title: '瀏覽文章', result: result, req: req, message: Object()});
            }else{
              /* 設一個counter */
              let count = 0;
              for (let i in result_message){
                /* 把每一個message都加入使用者的匿名 */
                user.findOne({account: result_message[i].account}).exec(function(err,result_message_user){
                  if(err){next(err)}
                  if(result_message_user === null){
                    /* 沒這使用者就說是已經刪除的使用者 */
                    result_message[i].name = "已刪除用戶";
                  }else{
                    /* 沒這使用者 */
                    result_message[i].name = result_message_user.name;
                  }
                  /* counter加一 */
                  count = count + 1;
                  /* 當每一個article都加入使用者的匿名之後 */
                  if(count === Object.keys(result_message).length){
                    res.render('article', { title: '瀏覽文章', result: result, req: req, message: result_message});
                  }
                })
              }
            }
          })
        });
      }
    });
  }else{
    res.redirect('/');
  }
})

/* 新增留言功能 */
router.post('/post_message/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login');
  }else{
    /* 確定表單不是空的 */
    if(req.body.content){
      /* 確定傳進來的是不是有效id */
      if (mongoose.Types.ObjectId.isValid(req.params.id)){
        article.findById(req.params.id).exec(function(err,result){
          if (err){return next(err)}
          if(result === null){
            res.redirect('/');
          }else{
            var temp = new message({
              account: req.session.account,
              content: req.body.content,
              article_id: mongoose.Types.ObjectId(req.params.id)
            }).save(function(err){
              if (err){
                return next(err);
              }
              res.redirect('/article/'+ req.params.id);
            })
          }
        });
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/article/'+ req.params.id);
    }
  }
});

/* 刪除留言功能 */
router.get('/delete_message/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login')
  }else{
    /* 確定傳進來的是不是有效id */
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
      /* 確定這篇文章真的是他發的或他是管理員 */
      message.findById(req.params.id).exec(function(err,result){
        if (err) {return next(err)};
        if (result.account === req.session.account || req.session.type === "admin"){
          /* 刪除 */
          result.remove();
          res.redirect('back');
        }else{
          res.redirect('back');
        }
      })
    }else{
      res.redirect('back');
    }
  }
});

/* 修改留言頁面 */
router.get('/edit_message/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login')
  }else{
    /* 確定傳進來的是不是有效id */
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
      /* 像資料庫查詢這則留言是不是他發的 */
      message.findById(req.params.id).exec(function(err,result){
        if (err) {return next(err)};
        /* 確定這篇文章真的是他發的或他是管理員 */
        if (result.account === req.session.account || req.session.type === "admin"){
          /* render頁面 */
          res.render('edit_message', { title: '修改文章', result: result});
        }else{
          res.redirect('/');
        }
      })
    }else{
      res.redirect('back')
    }
  }
});

/* 修改留言功能 */
router.post('/edit_message_action/:id',function(req, res, next){
  /* 沒登入導向到登入頁面 */
  if (!req.session.logined) {
    res.redirect('/login');
  }else{
    /* 留言改成空的就導回前一頁 */
    if (req.body.content){
      /* 確定傳進來的是不是有效id */
      if (mongoose.Types.ObjectId.isValid(req.params.id)){
        /* 像資料庫查詢這則留言是不是他發的 */
        message.findById(req.params.id).exec(function(err,result){
          if (err) {return next(err)};
          /* 確定這則留言真的是他發的或他是管理員 */
          if (result.account === req.session.account || req.session.type === "admin"){
            /* 修改資料 */
            result.set('content',req.body.content);
            result.save(function(err){if(err){return next(err);}});
            res.redirect('/article/'+result.article_id);
          }else{
            res.redirect('/');
          }
        })
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('back');
    }
  }  
});

/* 印出所有路由 */
router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(JSON.stringify(r.route.methods)+"\t"+r.route.path)
  }
})

module.exports = router;
