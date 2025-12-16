const Forum = require('../models/forumModel');
const User = require('../models/userModel');

// Creates a forum
exports.createForums = async (req, res, next) =>{
    try {
        
        if (!req.body.name) {
            return res.status(400).json({error: "Forum name is required!"});
        }

        if (!req.body.category) {
            return res.status(400).json({error: "Category is required!"});
        }

        const newForum = new Forum(req.body);
        const saveForum = await newForum.save();
        
        res.status(201).json({forum: saveForum});

    } catch (err) {
        next(err);

    }
}; 

// Gets all forums
exports.getForums = async (req, res, next) => {
    try {
        const forums = await Forum.find();

        res.status(200).json({forums: forums});

    } catch(err) {
        next(err);
    }
};

// Gets specific forum
exports.getForumByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findById(id);

        if(!forum){
            return res.status(404).json({error: "Forum not found!"});
        }

        res.status(200).json({forum: forum});
    } catch(err) {
        next(err);
    }
};

// Updates forums 
exports.updateForum = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!req.body.name) {
            return res.status(400).json({error: "Forum name is required!"});
        }

        const updatedForum = await Forum.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!updatedForum) {
            return res.status(404).json({error: "Forum not found!"});
        }
        
        res.status(200).json({forum: updatedForum});
        } catch (err) {
            next (err);
        }
};

// Deletes specific forum
exports.deleteForumByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const deletedForum = await Forum.findByIdAndDelete(id);

        if(!deletedForum) {
            return res.status(404).json({error: "Forum not found!"});
        } 
        
         res.status(204).send();

        } catch (err) {
            next(err);
    }
};

// Updates forums field
exports.updateForumField = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (req.body.name !== undefined && req.body.name === "") {
            return res.status(400).json({error: "Forum name cannot be empty!"});
        }

        const updatedForumField = await Forum.findByIdAndUpdate(id, {$set: req.body}, {new: true, runValidators: true});

        if(!updatedForumField) {
            return res.status(404).json({error: "Forum not found!"});

        }
        res.status(200).json({forum: updatedForumField});

      } catch (err) {
          next (err);
      }
};

//GET: get all forums for a specific user 
exports.getUserForums = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username})

        if(!user) {
            return res.status(404).json({ error: "User not found"})
        }

        const forums = await Forum.find({ userID: user._id });
        
        return res.status(200).json(forums)

    } catch(err) {
        next(err);
    }
}