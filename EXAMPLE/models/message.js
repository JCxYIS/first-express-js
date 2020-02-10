/* Created by Andrew Lin on Jan 2018. */
/* require mongoose */
var mongoose = require('mongoose');

/**
 * message定義：
 * account     帳號       string
 * content     內容       string
 * article_id  哪篇blog   number
 */
var message = mongoose.Schema({
    account     : String,
    content     : String,
    article_id  : mongoose.Schema.Types.ObjectId
});

/* export module */
module.exports = mongoose.model( 'message', message );