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

    likes: {
        type: Number,
        default: 0
    },

    dislikes: {
        type: Number,
        default: 0
    },

    userID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    forumID: {
        type: Schema.Types.ObjectId,
        ref: "Forums"
    },
}, 
{ timestamps: true } );

module.exports = mongoose.model('Post', postsSchema); 