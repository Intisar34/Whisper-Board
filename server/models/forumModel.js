
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// Defines the schema for forums
const forumSchema = new mongoose.Schema ({

    name: {type: String, required: true},
    description: {type: String},

    // Foreign key for User
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},

{ timestamps: true}
);

// Creates a mongoose model 
module.exports = mongoose.model("Forums", forumSchema);

