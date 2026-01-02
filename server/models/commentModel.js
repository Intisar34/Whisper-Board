
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// Defines comment schema 
const commentSchema = new mongoose.Schema({

    body: {type: String, required: true},

    // Foreign key for Post
    postID: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    // Foreign key for User
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],


},  {timestamps: true});

// Creates a mongoose model 
module.exports = mongoose.model("Comments", commentSchema);
