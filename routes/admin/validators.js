const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');


module.exports = {
    requireProductTitle: check('title')
        .trim()
        .isLength({min:5, max:50})
        .withMessage('Title must be between 5 and 50 characters.'),
    requireProductPrice: check('price')
        .trim()
        .toFloat()
        .isFloat({min: 1}) // not perfect but fine for demo
        .withMessage('Price must be a number greater than 1'),
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email.')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({email});
            if(existingUser) {
                throw new Error('This email has already been used.')
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({min:4, max:20})
        .withMessage('Password must be between 4 and 20 characters.'),
    
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({min:4, max:20})
        .withMessage('Password must be between 4 and 20 characters.')
        .custom(async (passwordConfirmation, {req}) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match!')
            }
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must provide valid email.')
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({email});
            if(!existingUser) {
                throw new Error('Cannot find account for this email.')
            }
        }),
    requireCorrectPassword: check('password')
        .trim()
        .custom(async (password, {req}) => {
            const existingUser = await usersRepo.getOneBy({email: req.body.email});
            if (!existingUser) {
                throw new Error('Invalid password')
            }
            if(!await usersRepo.compareHashedPasswords(existingUser.password, password)) {
                throw new Error('Invalid password')
            }
        })
};