var mongoose = require('mongoose');

///
var user = mongoose.Schema({
    uname       : {type: String, unique: true},
    name        : String,
    psw         : String,
});

/* export module */
module.exports = mongoose.model( 'user', user );
