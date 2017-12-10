const express = require('express'),
      router = express.Router({mergeParams: true}),
      Campground = require('../models/campground.js'),
      Comment = require('../models/comment.js');

// ==============
//  COMMENTS ROUTES
// ==============
// NEW
router.get('/new', isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err)
      console.log("ERROR", err);
    else {
      res.render('comments/new.ejs', {campground});
    }
  });
});

//CREATE
router.post('/', isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log('ERROR', err);
    } else {
      Comment.create(req.body.comment, (err, comment)=>{
        if (err) {
          console.log('ERROR', err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      });
    }
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;