const express = require('express');
const usersRepo = require('../../repositories/users');
const { validationResult } = require('express-validator');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireCorrectPassword } = require('./validators');

const router = express();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }))
});

router.post('/signup', [ 
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
    ], 
    async (req, res) => {
        const errors = validationResult(req); // express-validation gets attached to the req
        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }))
        }
        const {email, password} = req.body;
        const user = await usersRepo.create({email, password})

        req.session.userId = user.id; // session object added by cookie-session
        console.log(req.body);
        res.send('Signed up!')
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You have been logged out')
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
});

router.post('/signin', [
    requireEmailExists,
    requireCorrectPassword
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        console.log('errors are ', errors)
        if (!errors.isEmpty()) {
            return res.send(signinTemplate({ errors }))
        }
        const existingUser = await usersRepo.getOneBy({email: req.body.email});
        req.session.userId = existingUser.id; // session object added by cookie-session
        res.send('Signed in!')
    });

module.exports = router;