const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const postsSchema = new Schema({
    title: {
        type: String,
        lowercase: true,
        required:true
    },

    body: {
        type: String,
        lowercase:true,
        required:true
    },

    postDate:{
        type: Date,
        default: Date.now
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    forumID: {
        type: String,
        index: true
    },
}, 
{ timestamps: true } );

module.exports = mongoose.model('Post', postsSchema); 