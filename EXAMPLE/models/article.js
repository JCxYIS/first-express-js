/* Created by Andrew Lin on Jan 2018. */
/* require mongoose */
var mongoose = require('mongoose');

/**
 * article定義：
 * account     帳號   string
 * content     內容   string
*/
var article = mongoose.Schema({
    account     : String,
    content     : String
});

/* export module */
module.exports = mongoose.model( 'article', article );