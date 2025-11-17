
const mongoose = require("mongoose");

// Defines the schema for forums
const forumSchema = new mongoose.Schema ({

    name: {type: String, unique: true},
    description: {type: String}

})

// Creates a mongoose model 
module.exports = mongoose.model("Forums", forumSchema);

