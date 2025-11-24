
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// Defines comment schema 
const commentSchema = new mongoose.Schema({

    body: {type: String, required: true},

    // Foreign key for Post
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    // Foreign key for User
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},  {timestamps: true});

// Creates a mongoose model 
module.exports = mongoose.model("Comments", commentSchema);
