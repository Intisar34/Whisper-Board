const express = require('express')
const userController = require('../controllers/userController');
const router = express.Router();

// user collection route
router
  .route('/')
  .post(userController.createUser)      
  .get(userController.getUsers)       
  .delete(userController.deleteAllUsers);

// user speicific route
router
  .route('/:username')
  .get(userController.getUserByUsername)
  .put(userController.updateUserPut)
  .patch(userController.updateUserPatch)
  .delete(userController.deleteUserByUsername)
  .post(userController.loginUser);

module.exports = router;