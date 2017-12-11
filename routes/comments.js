
const express = require('express'),
      router = express.Router({mergeParams: true}),
      Campground = require('../models/campground.js'),
      Comment = require('../models/comment.js'),
      middleware = require('../middleware/middleware.js');

// ==============
//  COMMENTS ROUTES
// ==============
// NEW
router.get('/new', middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err)
      console.log("ERROR", err);
    else {
      res.render('comments/new.ejs', {campground});
    }
  });
});

//CREATE
router.post('/', middleware.isLoggedIn, (req, res)=>{
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

// EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if (err)
      console.log('ERROR finding comment', err);
    else {
      res.render('comments/edit.ejs', {campground: {id: req.params.id}, comment});
    }
  });
});

// UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
    if (err) {
      console.log('ERROR UPDATING COMMENT', err);
      res.redirect('back');
    }
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});

// DESTROY
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=>{
    if (err) {
      console.log('ERROR DELETING COMMENT', err);
      return res.redirect('back');
    }
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});

module.exports = router;