
const mongoose = require("mongoose");

// Defines the schema for forums
const forumSchema = new mongoose.Schema ({

    name: {type: String, required: true},
    description: {type: String},

    // Foreign key for User
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }

})

// Creates a mongoose model 
module.exports = mongoose.model("Forums", forumSchema);

