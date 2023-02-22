const allUser = require('../data.json');
const fs = require("fs");
const jwt = require("jsonwebtoken");

//! Create Token for authentication
const createToken = (req,res) => {
    jwt.sign({ msg: "Grant Access." }, "secretkey", (err, token) => {
        res.status(200).json({
          msg: "Welcome... !!",
          token
        });
      });
};


//! Post API || Create user API that should add new user object in the JSON file 
const createPerson =(req , res) => {
    try {
        const id = allUser.length + 1;
        req.body.id = id;
        const lowerName = req.body.name.toLowerCase()
        const lowerEmail = req.body.email.toLowerCase();
        const found = allUser.find(user => user.email == lowerEmail);

        if (found) {
            res.status(404).send("Email already used");
        }
        req.body.name = lowerName;
        req.body.email = lowerEmail;
        allUser.push(req.body);
        var strNotes = JSON.stringify(allUser);
        fs.writeFile('data.json', strNotes, (err) => {
            if (err) return console.log(err);
            console.log('Note added');
        });
        res.send(req.body);
    } catch (error) {
        console.error(err);
    }
};


//!Sort Data || Get list of users from the JSON file with the ability to sort users by their name, email and age 
function sortByProperty(property) {
    return function (a, b) {
        if (a[property].toLowerCase() > b[property].toLowerCase())
            return 1;
        else if (a[property].toLowerCase() < b[property].toLowerCase())
            return -1;
        return 0;
    }
};


function sortByPropertyforAge(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;
        return 0;
    }
};

const sortUser = (req,res) =>{
    try {
        let queryType = req.query.sortString;
        if (!queryType) {
            const allData = JSON.stringify(allUser);
            res.send(allData);
        }
        let sortedData;
        if (queryType == "name" || queryType == "email") {
            sortedData = allUser.sort(sortByProperty(queryType));
        }
        sortedData = allUser.sort(sortByPropertyforAge(queryType));
        res.send(sortedData);
    }
    catch (err) {
        console.error(err);
    }
};

//! Search API || Search user(s) by name and email 
const searchUserByNameAndemail = (req,res) => {
    try {
        const searchName = req.query.name.toLowerCase();
        const searchEmail = req.query.email.toLowerCase();

        const allData =  allUser.filter((user) => {
            return (user.name.includes(searchName) && user.email.includes(searchEmail));
        });
        res.send(allData);
    } catch (error) {
        console.error(err);
    }
};


//! Get users whose birthday is coming in next seven days' excluding today 
const birthdayUsers = (req,res) => {
    try {
        const birthData = [];
        const current = new Date();
        let nextSeventhDate = new Date();
        nextSeventhDate.setDate(nextSeventhDate.getDate() + 7);
        allUser.forEach((user) => {
            const birthDate = new Date(user.birthdate);
            if (birthDate > current && birthDate <= nextSeventhDate) {
                birthData.push(user);
            }
        });
        if(birthData.length == 0){
            res.status(404).send("No one have birthday in next coming seven days");
        }
        res.send(birthData);
    } catch (error) {
        console.error(err);
    }
};


//! Update User data by ID || API to Update user by id that should update user details in the JSON file 

const updateUserById = (req,res) => {
    try {
        const paramID = req.params.id;
        const found = allUser.find(u => u.id === parseInt(paramID));
        if (!found) {
            res.status(404).send("ID is not found");
        }
        for (let key in req.body) {
            found[key] = req.body[key];
        }

        const updatedData = JSON.stringify(allUser);

        fs.writeFile('data.json', updatedData, (err) => {
            if (err) console.log(err);
            res.send(found);
        });
    } catch (error) {
        console.error(err);
    }
};


//! Get users by matching skills 
const getUserByMatchSkill = (req,res) => {
    try {
        const arr =  req.query.matchSkill.split(',');
        console.log(arr);
       
        const  matchingData = [];
        allUser.forEach((user) =>{
            arr.forEach((a) =>{
                const index = user.skills.indexOf(a);
                if(index != -1){
                    matchingData.push(user);
                }
            })
        });
        res.send(matchingData);
    } catch (error) {
        console.error(err);
    }
};


//! API to add skill(s) for particular user 
const addSkillInUserById = (req,res) => {
    try {
        const found = allUser.find(u => u.id === parseInt(req.params.id));
        if (!found) {
            res.status(404).send("User Not Found");
        }
        req.body.skills.forEach((skill) => {
            const findSkill = found.skills.find(fn => fn === skill);
            if (!findSkill) {
                found.skills.push(skill);
            }
        });
        const updatedData = JSON.stringify(allUser);
        fs.writeFile('data.json', updatedData, (err) => {
            if (err) console.log(err);
            console.log("Skills Added");
            res.send(found);
        });
    }
    catch {
        console.error(err);
    }
};


//! API to remove skill(s) for particular user 
const removeSkillInUserById = (req,res) => {
    try {
        const found = allUser.find(u => u.id === parseInt(req.params.id));
        if (!found) {
            res.status(404).send("User Not Found");
        }

        req.body.skills.forEach((skill) =>{
            const index = found.skills.indexOf(skill);
            if(index != -1){
                found.skills.splice(index,1);
            }
            res.status(400).send("skill was already not available"); 
        })

        const updatedData = JSON.stringify(allUser);
        fs.writeFile('data.json', updatedData, (err) => {
            if (err) console.log(err);
            res.send(found);
        });

    } catch (error) {
        console.error(err);
    }
}

module.exports = {
    createPerson,
    sortUser,
    searchUserByNameAndemail,
    birthdayUsers,
    updateUserById,
    getUserByMatchSkill,
    addSkillInUserById,
    removeSkillInUserById,
    createToken
};