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
          // add username and id to comment
          console.log("USER: " + req.user);
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log('COMMENT: ' + comment);
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