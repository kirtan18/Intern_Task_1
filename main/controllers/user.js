const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'person',
    password: '12345',
    port: 5432
});

const getUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT user_id, name, email, age, contact, gender, birthdate, city FROM users ORDER BY user_id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const getSkills = async (req, res) => {
    try {
        const result = await pool.query("SELECT skill_id, skill_name FROM skills ORDER BY skill_id ASC");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

// TODO: Without array_agg function 
const userWithSkill = async (req, res) => {
    try {
        const result = await pool.query("SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, ARRAY_AGG(S.skill_name) AS skills FROM users U JOIN userSkills US ON U.user_id = US.user_id JOIN skills S ON US.skill_id = S.skill_id GROUP BY U.user_id,U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

//! Post API || Create user API that should add new user object in the JSON file

const createPerson = async (req, res) => {
    try {
        const { name, email, age, contact, gender, birthdate, city, skillId } = req.body;
        const queryParams = [];

        const userResult = await pool.query(
            'INSERT INTO users(name,email,age,contact,gender,birthdate,city)VALUES(LOWER($1),LOWER($2),$3,$4,$5,$6,$7) RETURNING user_id', [name, email, age, contact, gender, birthdate, city]);
        const userId = userResult.rows[0].user_id;

        // Create userSkills Table
        let query = `INSERT INTO userSkills(user_id,skill_id) VALUES`;

        skillId.forEach((id, i) => {
            queryParams.push(`(${userId}, $${++i})`);
        })

        query = `${query} ${queryParams.join(', ')}`;

        console.log(query);

        const result = await pool.query(query, skillId);

        res.status(201).json("User Added");
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};

// //!Sort Data || Get list of users from the JSON file with the ability to sort users by their name, email and age 

const sortUser = async (req, res) => {
    try {
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder;

        const query = `SELECT  name, email, age, contact, gender, birthdate, city FROM users ORDER BY  
                       ${sortField} ${sortOrder} `;

        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

// //! Search API || Search user(s) by name and email 
const searchUserByNameAndemail = async (req, res) => {
    try {
        let name = req.query.name;
        let email = req.query.email;

        if (name) name = name.toLowerCase();
        if (email) email = email.toLowerCase();

        let query = `SELECT name, email, age, contact, gender, birthdate, city FROM users WHERE name LIKE '${name}' OR email LIKE '${email}'`;

        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
    }
};


// //! Get users whose birthday is coming in next seven days' excluding today 
const birthdayUsers = async (req, res) => {
    try {

        let query = `SELECT * FROM users WHERE EXTRACT(month from birthdate) BETWEEN EXTRACT(month from now()) AND EXTRACT(month from now() + interval '7 days') AND EXTRACT(day from birthdate) BETWEEN EXTRACT(day from now() + interval '1 days') AND EXTRACT(day from now() + interval '7 days');`;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
};


// //! Update User data by ID || API to Update user by id that should update user details in the JSON file 

const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        let query = `UPDATE users SET`;

        let keys = Object.keys(req.body);
        const arr = [];
        const queryParams = [];

        keys.forEach((key, i) => {
            queryParams.push(`${key} = $${++i}`)
            arr.push(req.body[key])
        });

        query = `${query} ${queryParams.join(', ')} WHERE id = $${queryParams.length + 1}`;
        arr.push(id);

        const result = await pool.query(query, arr);
        res.json("Data successfully updated");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//! Get users by matching skills 
const getUserByMatchSkill = async (req, res) => {
    try {
        const skill = req.query.skill;

        const query = `SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, ARRAY_AGG(S.skill_name) AS skills FROM users U JOIN userSkills US ON U.user_id = US.user_id JOIN skills S ON US.skill_id = S.skill_id WHERE S.skill_name = $1 GROUP BY U.user_id,U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city `;

        const result = await pool.query(query, [skill]);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//! API to add skill(s) for particular user 
const addSkillInUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const newSkillsID = req.body.skillIds;
        const queryParams = [];

        const check = await pool.query(`SELECT * FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2`, [newSkillsID, userId]);

        console.log(check.rows);
        if (check.rows[0] != undefined) {
            res.json("This ID is already present in database");
        }
        else {
            let query = `INSERT INTO userSkills(user_id,skill_id) VALUES`;

            newSkillsID.forEach((id, i) => {
                queryParams.push(`(${userId}, $${++i})`);
            });

            query = `${query} ${queryParams.join(', ')}`;

            const result = await pool.query(query, newSkillsID);

            res.json("New Skills added");
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//! API to remove skill(s) for particular user 
const removeSkillInUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const removeSkillsID = req.body.skillIds;

        const check = await pool.query(`SELECT * FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2`, [removeSkillsID, userId]);

        console.log(check.rows.length);

        if (check.rows.length != removeSkillsID.length) {
            res.json("Id is not available in userSkills");
        }
        else {
            const result = await pool.query(`DELETE FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2`, [removeSkillsID, userId]);

            res.json("User Deleted from Database");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    createPerson,
    getUsers,
    getSkills,
    userWithSkill,
    sortUser,
    searchUserByNameAndemail,
    birthdayUsers,
    updateUserById,
    getUserByMatchSkill,
    addSkillInUserById,
    removeSkillInUserById
    // createToken
};