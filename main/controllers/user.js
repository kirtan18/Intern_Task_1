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
        const result = await pool.query("SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, ARRAY(SELECT S.skill_name FROM userSkills US JOIN skills S ON US.skill_id = S.skill_id WHERE US.user_id = U.user_id) AS skills FROM users U");
        res.json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

//! Post API || Create user API that should add new user object in the JSON file
const createPerson = async (req, res) => {
    try {
        const { name, email, age, contact, gender, birthdate, city, skillIds } = req.body;
        const queryParams = [];

        const userResult = await pool.query(
            'INSERT INTO users(name, email, age, contact, gender, birthdate, city) VALUES($1, LOWER($2), $3, $4, $5, $6,$7) RETURNING user_id', [name, email, age, contact, gender, birthdate, city]);

        const userId = userResult.rows[0].user_id;

        let query = `INSERT INTO userSkills(user_id,skill_id) VALUES`;

        skillIds.forEach((id) => {
            queryParams.push(`(${userId}, ${id})`);
        })

        query = `${query} ${queryParams.join(', ')}`;

        await pool.query(query);

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

        const query = `SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, 
        ARRAY(SELECT S.skill_name FROM userSkills US JOIN skills S ON US.skill_id = S.skill_id WHERE US.user_id = U.user_id) AS skills FROM users U ORDER BY ${sortField} ${sortOrder}`;

        const result = await pool.query(query);
        
        if (result.rows.length == 0) {
            res.status(404).json({ error: 'Data is Not available' });
            return;
        }
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
        const name = req.query.name;
        const email = req.query.email;

        let query = `SELECT name, email, age, contact, gender, birthdate, city FROM users WHERE name ILIKE '${name}' OR email ILIKE '${email}'`;

        const result = await pool.query(query);
        if (result.rows.length == 0) {
            res.status(404).json({ error: 'This type of data is not available' });
            return;
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};


// //! Get users whose birthday is coming in next seven days' excluding today 
const birthdayUsers = async (req, res) => {
    try {

        let query = `SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, ARRAY(SELECT S.skill_name FROM userSkills US JOIN skills S ON US.skill_id = S.skill_id WHERE US.user_id = U.user_id) AS skills FROM users U WHERE EXTRACT(month from birthdate) BETWEEN EXTRACT(month from now()) AND EXTRACT(month from now() + interval '7 days') AND EXTRACT(day from birthdate) BETWEEN EXTRACT(day from now() + interval '1 days') AND EXTRACT(day from now() + interval '7 days');`;

        const result = await pool.query(query);

        if (result.rows.length == 0) {
            res.status(404).json({ error: 'No one have birthday in next comming seven days' });
            return;
        }

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};


// //! Update User data by ID || API to Update user by id that should update user details in the JSON file 

const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        let query = `UPDATE users SET`;

        let keys = Object.keys(req.body);
        const queryParams = [];

        keys.forEach((key) => {
            queryParams.push(`${key} = '${req.body[key]}'`)
        });
       
        query = `${query} ${queryParams.join(', ')} WHERE user_id = ${id}`;
    
        await pool.query(query);
        res.json("Data successfully updated");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//! Get users by matching skills 
const getUserByMatchSkill = async (req, res) => {
    try {
        const skillsArray = req.query.skills.split(',');
        const query = `SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, 
                       ARRAY(SELECT S.skill_name FROM skills S JOIN userSkills US ON S.skill_id = US.skill_id 
                       WHERE US.user_id = U.user_id) AS skills FROM users U 
                       WHERE EXISTS(SELECT 1 FROM userSkills US JOIN skills S ON US.skill_id = S.skill_id WHERE US.user_id = U.user_id AND S.skill_name = ANY($1)); `;

        // const query = `SELECT U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city, ARRAY_AGG(S.skill_name) AS skills FROM users U JOIN userSkills US ON U.user_id = US.user_id JOIN skills S ON US.skill_id = S.skill_id WHERE S.skill_name = ANY($1) GROUP BY U.user_id,U.name, U.email, U.age, U.contact, U.gender, U.birthdate, U.city `;

        const result = await pool.query(query, [skillsArray]);

        if (result.rows.length == 0) {
            res.status(404).json({ error: 'Skills Not Found' });
            return;
        }
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
        const newSkillIds = req.body.skillIds;
        const queryParams = [];

        const existenceIds = await pool.query(`SELECT user_id,skill_id FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2`, [newSkillIds, userId]);

        const foundIds = existenceIds.rows.map(row => row.skill_id);
        const presentIds = newSkillIds.filter(id => foundIds.includes(id));

        if (presentIds.length > 0) {
            res.status(409).json({ error: `IDs ${presentIds.join(', ')} already present in database` });
            return;
        }

        let query = `INSERT INTO userSkills(user_id,skill_id) VALUES`;

        newSkillIds.forEach((skillId) => {
            queryParams.push(`(${userId}, ${skillId})`);
        });

        query = `${query} ${queryParams.join(', ')}`;

        await pool.query(query);

        res.json("New Skills added");
    }
    catch (error) {
        if (error.code == 23503) {
            res.status(404).json({ error: 'Please write correct Id' });
            return;
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//! API to remove skill(s) for particular user 
const removeSkillInUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const removeSkillsID = req.body.skillIds;

        const existenceIds = await pool.query(`SELECT skill_id FROM userSkills WHERE user_id = ${userId}`);

        const foundIds = existenceIds.rows.map(row => row.skill_id);
        const notPresentIds = removeSkillsID.filter(id => !foundIds.includes(id));

        if (notPresentIds > 0) {
            res.status(404).json({ error: `This Ids ${notPresentIds.join(', ')} is not present in user skills, So please write correct Id` });
            return;
        }

        await pool.query(`DELETE FROM userSkills WHERE skill_id = ANY($1) AND user_id = $2`, [removeSkillsID, userId]);

        res.json("User Delete from Database");

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
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
};



