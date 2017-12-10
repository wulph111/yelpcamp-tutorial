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
      console.log(err);
      return res.render('register.ejs');
    }
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/campgrounds');
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
      failureRedirect: '/login'
    }
  ), (req, res)=>{
    // do nothing
  }
);

// process logout
router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;