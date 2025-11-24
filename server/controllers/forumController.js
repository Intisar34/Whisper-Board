
const Forum = require('../models/forumModel');


// Creates a forum
exports.createForums = async (req, res, next) =>{
    try {
        
        if (!req.body.name) {
            return res.status(400).json({error: "Forum name is required"});
        }

        const forums = new Forum(req.body);
        const saveForum = await forums.save();
        res.status(201).json(saveForum) 

    } catch (err) {
        next(err);

    }
}; 

// Gets all forums
exports.getForums = async (req, res, next) => {
    try {
        const forums = await Forum.find();

        res.status(200).json({data:forums});

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

// Updates forums 
exports.updateForum = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!req.body.name) {
            return res.status(400).json({error: "Forum name is required"});
        }

        const forum = await Forum.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!forum) {
            return res.status(404).json({error: "Forum not found!"});
        } 
        
        res.status(200).json({data:forum});
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

        const forum = await Forum.findByIdAndUpdate(id, {$set: req.body}, {new: true, runValidators: true});

        if(!forum) {
            return res.status(404).json({error: "Forum not found!"});

        }
        res.status(200).json({data:forum});

      } catch (err) {
          next (err);
      }
};
