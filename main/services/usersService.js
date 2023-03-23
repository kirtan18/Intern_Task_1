const pool = require('../config/db.config');
const users = require('../models/usersModel');
const usersWithSkillsService = require('./usersWithSkillsService');

module.exports = {
  getUsers: async () => {
    const client = await pool.connect();
    try {
      const result = await users.getUserData(client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

  getUsersWithSkills: async () => {
    const client = await pool.connect();
    try {
      const result = await users.getUsersWithSkillsData(client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

  createUserService: async (requestBody) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const {
        name, email, age, contact, gender, birthdate, city,
      } = requestBody;
      const values = [ name, email, age, contact, gender, birthdate, city ];
      const result = await users.insertUser(values, client);
      const userId = result.rows[0].user_id;
      await usersWithSkillsService.createUsersWithSkills(userId, requestBody, client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getSortUsers: async (requestQuery) => {
    const client = await pool.connect();
    try {
      const result = await users.sortUsersData(requestQuery, client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

  getUserByNameAndEmail: async (requestQuery) => {
    const client = await pool.connect();
    try {
      const result = await users.userDataByNameAndEmail(requestQuery, client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

  getBirthdayUsers: async () => {
    const client = await pool.connect();
    try {
      const result = await users.birthdayUserdata(client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

  updateUserById: async (params, requestBody) => {
    const client = await pool.connect();
    try {
      const result = await users.updateDataById(params, requestBody, client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

  UsersByMatchSkills: async (requestQuery) => {
    const client = await pool.connect();
    try {
      const result = await users.getDataByMatchSkills(requestQuery, client);
      return result;
    } catch (error) {
      client.release();
      throw error;
    }
  },

};
