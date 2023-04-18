module.exports = {

  async getExistenceData(paramsId, skillIds, client) {
    const query = 'SELECT user_id, skill_id FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2';
    const result = await client.query(query, [ skillIds, paramsId ]);
    return result;
  },

  async insertUserSkills(paramsId, skillIds, client) {
    const queryParams = skillIds.map((id) => `(${ paramsId }, ${ id })`);
    const values = queryParams.join(', ');
    const query = `INSERT INTO userSkills (user_id,skill_id) VALUES ${ values }`;
    const result = await client.query(query);
    return result;
  },

  async deleteUserSkills(paramsId, SkillIds, client) {
    const query = 'DELETE FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2';
    const result = await client.query(query, [ SkillIds, paramsId ]);
    return result;
  },
};
