/* eslint-disable no-useless-catch */
const pool = require('../config/db.config');
const userWithSkills = require('../models/usersWithSkillsModel');

module.exports = {
  getExistenceUserForAddSkills: async (requestParams, requestBody, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const paramsId = requestParams.id;
      const { skillIds } = requestBody;
      const existenceIds = await userWithSkills.getExistenceData(paramsId, skillIds, client);

      const foundIds = existenceIds.rows.map((row) => row.skill_id);
      const presentIds = skillIds.filter((id) => foundIds.includes(id));

      if (presentIds.length > 0) {
        res.status(409).json({ error: `IDs ${ presentIds.join(', ') } already present in database` });
        return;
      }

      await userWithSkills.insertUserSkills(paramsId, skillIds, client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  createUsersWithSkills: async (paramsId, requestBody, client) => {
    try {
      const { skillIds } = requestBody;
      const result = await userWithSkills.insertUserSkills(paramsId, skillIds, client);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getExistenceUserForRemoveSkills: async (requestParams, requestBody, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const paramsId = requestParams.id;
      const removeSkillIds = requestBody.skillIds;

      const existenceIds = await userWithSkills.getExistenceData(paramsId, removeSkillIds, client);

      const foundIds = existenceIds.rows.map((row) => row.skill_id);
      const notPresentIds = removeSkillIds.filter((id) => !foundIds.includes(id));

      if (notPresentIds.length > 0) {
        res.status(404).json({ error: `This Ids ${ notPresentIds.join(', ') } is not present in user skills, So please write correct Id` });
        return;
      }

      await userWithSkills.deleteUserSkills(paramsId, removeSkillIds, client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};
