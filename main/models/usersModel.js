const updateQuery = require('./updateQuery');

module.exports = {

  async getUserData(client) {
    const query = 'SELECT name, email, age, contact, gender, birthdate, city FROM USERS ORDER BY user_id ASC';
    const result = await client.query(query);
    return result;
  },

  async getUsersWithSkillsData(client) {
    const query = `SELECT 
                    U.user_id, 
                    U.name, 
                    U.email, 
                    U.age, 
                    U.contact, 
                    U.gender, 
                    U.birthdate, 
                    U.city, 
                    S.skill_id, 
                    S.skill_name 
                   FROM 
                    users U 
                   JOIN userSkills US 
                    ON U.user_id = US.user_id  
                   JOIN skills S 
                    ON US.skill_id = S.skill_id 
                   order by U.user_id`;

    const result = await client.query(query);
    return result;
  },

  async insertUser(values, client) {
    const query = 'INSERT INTO users(name, email, age, contact, gender, birthdate, city)  VALUES($1, LOWER($2), $3, $4, $5, $6,$7) RETURNING user_id';
    const result = await client.query(query, values);
    return result;
  },

  async sortUsersData(requestQuery, client) {
    const { sortField } = requestQuery;
    const { sortOrder } = requestQuery;
    const query = `SELECT name, email, age, contact, gender, birthdate, city FROM users ORDER BY ${ sortField } ${ sortOrder }`;
    const result = await client.query(query);
    return result;
  },

  async userDataByNameAndEmail(requestQuery, client) {
    const { name } = requestQuery;
    const { email } = requestQuery;
    const query = `SELECT name, email, age, contact, gender, birthdate, city FROM users WHERE name ILIKE '${ name }' OR email ILIKE '${ email }'`;
    const result = await client.query(query);
    return result;
  },

  async birthdayUserdata(client) {
    const query = `SELECT 
                    user_id, 
                    name, 
                    email, 
                    age,
                    contact, 
                    gender, 
                    birthdate, 
                    city 
                   FROM 
                    users 
                   WHERE EXTRACT(month from birthdate) 
                   BETWEEN EXTRACT(month from now()) AND EXTRACT(month from now() + interval '7 days') 
                   AND EXTRACT(day from birthdate) BETWEEN EXTRACT(day from now() + interval '1 days') 
                   AND EXTRACT(day from now() + interval '7 days')`;
    const result = await client.query(query);
    return result;
  },

  async updateDataById(params, requestBody, client) {
    const { id } = params;
    const columns = Object.keys(requestBody);
    const values = Object.values(requestBody);
    const parameter = [ ...values, id ];
    const query = `UPDATE users SET ${ updateQuery.updateQueryData(columns) } WHERE user_id = $${ columns.length + 1 }`;
    const result = await client.query(query, parameter);
    return result;
  },

  async getDataByMatchSkills(requestQuery, client) {
    const values = requestQuery.skills.split(',');
    const query = `SELECT 
                    U.name, 
                    U.email, 
                    U.age, 
                    U.contact, 
                    U.gender, 
                    U.birthdate, 
                    U.city 
                   FROM 
                    users U 
                   JOIN userSkills US 
                    ON U.user_id = US.user_id  
                   JOIN skills S 
                    ON US.skill_id = S.skill_id  
                   WHERE S.skill_name = ANY($1) 
                   GROUP BY U.user_id,U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city `;
    const result = await client.query(query, [ values ]);
    return result;
  }
};
