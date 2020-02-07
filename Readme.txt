//如何部署
記得要去app.js裡面第十六行確定自己沒有同樣的database名稱喔喔喔喔
記得要去app.js裡面第十六行確定自己沒有同樣的database名稱喔喔喔喔
記得要去app.js裡面第十六行確定自己沒有同樣的database名稱喔喔喔喔
很重要所以說三遍ＸＤ

在終端機裡面切到example_blog下面且打開資料庫(mongod)之後
$ npm i
$ DEBUG=example-blog:* npm start
剛開始會印出所有的routes
大家寒假加油～～～～～～
ps. 想要成為管理員的話，直接去robo3T裡面改就好啦～～


//有改過或新增的檔案
伺服器主要設定檔        /app.js
article定義           /models/article.js
message定義           /models/message.js
user定義              /models/user.js
路由                  /routes/indes.js
article頁面           /views/article.ejs
編輯article頁面        /views/edit_article.ejs
編輯message頁面        /views/edit_message.ejs
首頁                  /views/index.ejs
登入頁面               /views/login.ejs
註冊頁面               /views/register.ejs

//各個頁面
首頁  /顯示文章／刪除文章／發文
登入
註冊
檢視文章和文章留言／編輯留言/刪除留言
修改文章
修改留言

//關於ejs
http://ejs.co
<%  %>   這個裡面放js code，不輸出
<%- %>   這個裡面放js code，會輸出
<% /*  */ %> 所以comment可以用這個包住
在我的code裡面有"<%_"或是"-%>"是為了要讓ejs不要輸出"<%"前面的縮排和"%>"後面的換行

//MongoDB資料表設計
article:
account     帳號                 string
content     內容                 string

message:
account     帳號                 string
content     內容                 string
article_id  哪篇blog             number

user:
account     帳號      unique     string
name        暱稱                 string
password    密碼                 string
type        使用者or管理員        string


//session設計
account     帳號                 string
login       是否登入              boolean
type        使用者or管理員        string
這個我們忘記說了ＸＤ
為了要辨識哪個使用者是哪個使用者，因此cookie就誕生了。
但是cookie是存在使用者上，沒有辦法防止使用者的修改，因此session就誕生了。
session簡單的來說就是存在伺服器上的cookie，藉由把真正的資料存在伺服器上、使用者只有session id，就可以避免掉使用者修改資料，同時也能辨識使用者了。


//額外用到的npm modules
mongoose            為了和資料庫連線
express-session     為了用session


//各個路由
/                           get 
/login                      get
/login_action               post
/register                   get
/register_action            post
/logout                     get
/post_article               post
/delete_article/:id         get     id是article的id
/edit_article/:id           get     id是article的id
/edit_article_action/:id    post    id是article的id
/article/:id                get     id是article的id
/post_message/:id           post    id是article的id
/delete_message/:id         get     id是message的id
/edit_message/:id           get     id是message的id
/edit_message_action/:id    post    id是message的id