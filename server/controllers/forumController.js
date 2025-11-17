
const Forum = require("../models/forumModel");

// Gets all forums
exports.getForums = async (req, res, next) => {
    try{
        const forums = await Forum.find();
        res.json({data:forums});
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

        res.json({data:forum});
    } catch(err) {
        next(err);
    }
};

// Updates forums name/description
exports.updateForum = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!forum) {
            return res.status(404).json({error: "Forum not found!"});
        } 
        
        res.json({data:forum});
        } catch (err) {
            next (err);
        }
};

// Deletes specific forum
exports.deleteForumByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findByIdAndDelete(id);

        if(!forum) {
            return res.status(404).json({error:"Forum not found!"});
        } 
        
        else {
            res.status(204).send();
        }

        } catch (err) {
            next(err);
    }
};

