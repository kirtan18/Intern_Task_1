const Joi = require('joi');

module.exports = {
    userSchema: {
       body: Joi.object({
        name: Joi.string().alphanum().required(),
        email:Joi.string().email().required(),
        age:Joi.number().integer().required(),
        contact:Joi.string().length(10).required(),
        gender:Joi.string().required(),
        birthdate:Joi.date().iso().required(),
        city:Joi.string(),
        skillIds:Joi.array().items(Joi.number())
    })
},
sortSchema:{
    query: Joi.object({
        sortField: Joi.string().valid("name","email","age").insensitive(),
        sortOrder: Joi.string().valid("asc","desc").insensitive()
    })
},
updateSchema:{
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        name: Joi.string().alphanum(),
        email:Joi.string().email(),
        age:Joi.number().integer(),
        contact:Joi.string().length(10),
        gender:Joi.string(),
        skill_id:Joi.number().integer(),
        birthdate:Joi.date().iso(),
        city:Joi.string()
    }),
},
searchSchema:{
    query: Joi.object({
        name: Joi.string().trim().max(100),
        email:Joi.string().email()
    }).or('name','email') 
},
addSkillSchema:{
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        name: Joi.string().alphanum(),
        email:Joi.string().email(),
        age:Joi.number().integer(),
        contact:Joi.string().length(10),
        gender:Joi.string(),
        skill_id:Joi.number().integer(),
        birthdate:Joi.date().iso(),
        city:Joi.string(),
        skillIds:Joi.array().items(Joi.number())
    }),
},
removeSkillSchema:{
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        name: Joi.string().alphanum(),
        email:Joi.string().email(),
        age:Joi.number().integer(),
        contact:Joi.string().length(10),
        gender:Joi.string(),
        skill_id:Joi.number().integer(),
        birthdate:Joi.date().iso(),
        city:Joi.string(),
        skillIds:Joi.array().items(Joi.number())
    }),
},
matchSchema:{
    query: Joi.object({
        skill: Joi.string().trim().max(100)
    })
}
};