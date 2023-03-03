const express = require('express');
const router = express.Router();
const { userSchema, sortSchema, updateSchema, searchSchema, addSkillSchema, removeSkillSchema, matchSchema } = require('../models/schema');
const validate = require('../utils/validationHelper')
const users = require('../controllers/user');
// const auth  = require('../authentication/auth');


router.get( '/users' , users.getUsers);
router.get('/skills' , users.getSkills);
router.get('/userWithSkill' , users.userWithSkill);
router.post('/create' ,validate(userSchema) ,users.createPerson);
router.get('/sort' , validate(sortSchema) , users.sortUser);
router.get('/search' , validate(searchSchema) , users.searchUserByNameAndemail);
router.get('/birthday' , users.birthdayUsers);
router.put('/update/:id' ,validate(updateSchema) , users.updateUserById);
router.get('/matchData' , validate(matchSchema) , users.getUserByMatchSkill);
router.put('/addSkill/:id' , validate(addSkillSchema) , users.addSkillInUserById);
router.delete('/removeSkill/:id' , validate(removeSkillSchema) , users.removeSkillInUserById);

module.exports = router;