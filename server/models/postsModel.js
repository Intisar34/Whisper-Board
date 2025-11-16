var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var postsSchema = new Schema({
    title: {type: String},
    body: {type: String},
    usersID: {type: String},
    forumID: {type: String}
});

module.exports = mongoose.model('posts', postsSchema); 