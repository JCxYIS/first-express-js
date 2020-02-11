var mongoose = require('mongoose');

///
var article = mongoose.Schema({
    name          : String,
    authorUserName: String,
    lastEdit      : Number,
    content       : String
});

/* export module */
module.exports = mongoose.model( 'article', article );
