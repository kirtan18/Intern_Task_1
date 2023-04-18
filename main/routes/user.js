const express = require('express');
const users = require('../controllers/user');
const validate = require('../utils/validationHelper');
const {
  userSchema, sortSchema, updateSchema, searchSchema, addSkillSchema, removeSkillSchema, matchSchema,
} = require('../validation/validation');

const router = express.Router();

router.get('/users', users.getUsers);
router.get('/usersWithSkills', users.usersWithSkills);
router.post('/createUser', validate(userSchema), users.createUser);
router.get('/sort', validate(sortSchema), users.sortUsers);
router.get('/search', validate(searchSchema), users.searchUserByNameAndEmail);
router.get('/birthday', users.birthdayUsers);
router.put('/update/:id', validate(updateSchema), users.updateUserById);
router.get('/matchData', validate(matchSchema), users.getUsersByMatchSkills);
router.put('/addSkill/:id', validate(addSkillSchema), users.addSkillsInUserById);
router.delete('/removeSkill/:id', validate(removeSkillSchema), users.removeSkillsInUserById);

module.exports = router;
