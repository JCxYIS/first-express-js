/* Created by Andrew Lin on Jan 2018. */
/* require mongoose */
var mongoose = require('mongoose');

/**
 * user定義：
 * account     帳號      unique     string
 * name        暱稱                 string
 * password    密碼                 string
 * type        使用者or管理員        string
 */
var user = mongoose.Schema({
    account     : {type: String, unique: true},
    name        : String,
    password    : String,
    type        : String
});

/* export module */
module.exports = mongoose.model( 'user', user );
