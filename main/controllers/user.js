const usersService = require('../services/usersService');
const usersWithSkillsService = require('../services/usersWithSkillsService');

const getUsers = async (req, res, next) => {
  try {
    const result = await usersService.getUsers();
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const usersWithSkills = async (req, res, next) => {
  try {
    const result = await usersService.getUsersWithSkills();

    const temp = [];

    result.rows.forEach((rows) => {
      const userExistance = temp.find((user) => user.id === rows.user_id);
      if (userExistance) userExistance.skills.push({
        id: rows.skill_id,
        name: rows.skill_name,
      });
      else temp.push({
        id: rows.user_id,
        name: rows.name,
        email: rows.email,
        age: rows.age,
        contact: rows.contact,
        gender: rows.gender,
        birthdate: rows.birthdate,
        city: rows.city,
        skills: [ {
          id: rows.skill_id,
          name: rows.skill_name,
        } ],
      });
    });
    res.status(200).json(temp);
  } catch (error) {
    next(error);
  }
};

//! Post API || Create user API that should add new user object in the JSON file
const createUser = async (req, res, next) => {
  try {
    await usersService.createUserService(req.body);
    res.status(200).json({ msg: 'User Added' });
  } catch (error) {
    next(error);
  }
};

// //!Sort Data || Get list of users from the JSON file with the ability to sort users by their name, email and age
const sortUsers = async (req, res, next) => {
  try {
    const result = await usersService.getSortUsers(req.query);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

//! Search API || Search user(s) by name and email
const searchUserByNameAndEmail = async (req, res, next) => {
  try {
    const result = await usersService.getUserByNameAndEmail(req.query);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found for this Name Or Email' });
      return;
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

//! Get users whose birthday is coming in next seven days' excluding today
const birthdayUsers = async (req, res, next) => {
  try {
    const result = await usersService.getBirthdayUsers();

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'No one have birthday in next comming seven days' });
      return;
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// //! Update User data by ID || API to Update user by id that should update user details in the JSON file
const updateUserById = async (req, res, next) => {
  try {
    const result = await usersService.updateUserById(req.params, req.body);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ msg: 'Data successfully updated' });
  } catch (error) {
    next(error);
  }
};

//! Get users by matching skills
const getUsersByMatchSkills = async (req, res, next) => {
  try {
    const result = await usersService.UsersByMatchSkills(req.query);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

//! API to add skill(s) for particular user
const addSkillsInUserById = async (req, res, next) => {
  try {
    await usersWithSkillsService.getExistenceUserForAddSkills(req.params, req.body, res);
    res.status(200).json({ msg: 'New Skills added in user' });
  } catch (error) {
    if (error.code === 23503) {
      res.status(404).json({ error: 'Please write correct Id' });
      return;
    }
    next(error);
  }
};

//! API to remove skill(s) for particular user
const removeSkillsInUserById = async (req, res, next) => {
  try {
    await usersWithSkillsService.getExistenceUserForRemoveSkills(req.params, req.body, res);
    res.status(200).json({ msg: 'SkillIds Delete from user' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  usersWithSkills,
  createUser,
  sortUsers,
  searchUserByNameAndEmail,
  birthdayUsers,
  updateUserById,
  getUsersByMatchSkills,
  addSkillsInUserById,
  removeSkillsInUserById,
};
