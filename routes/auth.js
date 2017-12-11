const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user.js');

// ==============
//  AUTH ROUTES
// ==============

// show registration form
router.get('/register', (req, res)=>{
  res.render("register.ejs");
});

// process registration form
router.post('/register', (req, res)=>{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if (err) {
      req.flash('danger', err.message);
      const rf = req.flash();
      console.log(`/register POST flash=`, rf);
      return res.render('register.ejs', {msgs: rf});
    }
    passport.authenticate('local')(req, res, ()=>{
      req.flash('success', `Welcome to YelpCamp, ${user.username}`);
      res.redirect('/');
    });
  });
});

// show login form
router.get('/login', (req, res)=>{
  res.render("login.ejs");
});

// process login form
//router.post(route, middleware, callback)
router.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/campgrounds',
      failureRedirect: '/login',
      successFlash: 'LOGIN SUCCESSFUL',
      failureFlash: true, //could also be a string message
      //
    }
  ), (req, res)=>{
    // do nothing
  }
);

// process logout
router.get('/logout', (req, res)=>{

  req.user && req.flash('success', `Goodbye, ${req.user.username}`);
  req.flash('success', 'Another message.');
  req.logout();
  res.redirect('/');
});

module.exports = router;