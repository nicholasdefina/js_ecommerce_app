const express = require('express');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireCorrectPassword } = require('./validators');
const { handleErrors } = require('./middlewares')

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }))
});

router.post('/signup', [ 
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
    ], 
    handleErrors(signupTemplate), 
    async (req, res) => {
        const {email, password} = req.body;
        const user = await usersRepo.create({email, password})
        req.session.userId = user.id; // session object added by cookie-session
        res.redirect('/admin/products');
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/signin');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
});

router.post('/signin', [
    requireEmailExists,
    requireCorrectPassword
    ],
    handleErrors(signinTemplate), 
    async (req, res) => {
        const existingUser = await usersRepo.getOneBy({email: req.body.email});
        req.session.userId = existingUser.id; // session object added by cookie-session
        res.redirect('/admin/products');
    });

module.exports = router;