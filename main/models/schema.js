const Joi = require('joi');

module.exports = {
    userSchema: {
       body: Joi.object({
        name: Joi.string().alphanum().required(),
        email:Joi.string().email().required(),
        age:Joi.number().integer().required(),
        contact:Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).required().messages({
            'number.min': 'Mobile number should be 10 digit.',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender:Joi.string().required(),
        skills:Joi.array().items(Joi.string()).required(),
        birthdate:Joi.date().iso().required(),
        city:Joi.string()
    })
},
sortSchema:{
    query: Joi.object({
        sortString: Joi.string().trim().max(100)
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
        contact:Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit.',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender:Joi.string(),
        skills:Joi.array().items(Joi.string()),
        birthdate:Joi.date().iso(),
        city:Joi.string()
    }),
},
searchSchema:{
    query: Joi.object({
        name: Joi.string().trim().max(100).required(),
        email:Joi.string().email().required()
    }) 
},
addSkillSchema:{
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        name: Joi.string().alphanum().min(3),
        email:Joi.string().email(),
        age:Joi.number().integer(),
        contact:Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit.',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender:Joi.string(),
        skills:Joi.array().items(Joi.string()),
        birthdate:Joi.date().iso(),
        city:Joi.string()
    })
},
removeSkillSchema:{
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        name: Joi.string().alphanum().min(3),
        email:Joi.string().email(),
        age:Joi.number().integer(),
        contact:Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit.',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender:Joi.string(),
        skills:Joi.array().items(Joi.string()),
        birthdate:Joi.date().iso(),
        city:Joi.string()
    })
},
matchSchema:{
    query: Joi.object({
        matchSkill: Joi.string().trim().max(100)
    })
}
};