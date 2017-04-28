var express = require('express');
var db = require('../models');
var router = express.Router();
var passport = require('../config/passportConfig');


router.get('/login', function(req, res) {
    res.render('auth/loginForm');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Login successful',
    failureRedirect: '/auth/login',
    failureFlash: 'Failed login.  Try again'
}));

router.get('/signup', function(req, res) {
    res.render('auth/signupForm');
});

router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created.  You are now logged in',
                failureRedirect: '/login',
                failureFlash: 'Unknown error occurred.  Please log in again'
            })(req, res, next);
        } else {
            req.flash('error', 'Email already exists.  Please log in');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('Logged out');
    res.redirect('/');
});

module.exports = router;
