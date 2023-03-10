const express = require('express');
const router = express.Router();
const { userSchema, sortSchema, updateSchema, searchSchema, addSkillSchema, removeSkillSchema, matchSchema } = require('../models/schema');
const validate = require('../utils/validationHelper')
const users = require('../controllers/user');


router.get( '/users' , users.getUsers);
router.get('/skills' , users.getSkills);
router.get('/userWithSkill' , users.userWithSkills);
router.post('/create' ,validate(userSchema) ,users.createPerson);
router.get('/sort' , validate(sortSchema) , users.sortUsers);
router.get('/search' , validate(searchSchema) , users.searchUserByNameAndemail);
router.get('/birthday' , users.birthdayUsers);
router.put('/update/:id' ,validate(updateSchema) , users.updateUserById);
router.get('/matchData' , validate(matchSchema) , users.getUsersByMatchSkills);
router.put('/addSkill/:id' , validate(addSkillSchema) , users.addSkillsInUserById);
router.delete('/removeSkill/:id' , validate(removeSkillSchema) , users.removeSkillsInUserById);

module.exports = router;