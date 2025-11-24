
const mongoose = require("mongoose");

// Defines comment schema 
const commentSchema = new mongoose.Schema({

    body: {type: String, required: true},

    // Foreign key for Post
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    // Foreign key for User
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},  {timestamps: true});

// Creates a mongoose model 
module.exports = mongoose.model("Comments", commentSchema);
