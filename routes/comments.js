
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
    if (err || !campground) {
      req.flash('error', `Can't find campground ${req.params.id}`);
      return res.redirect('back');
    }
    return res.render('comments/new.ejs', {campground});
  });
});

//CREATE
router.post('/', middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err || !campground) {
      req.flash('error', `Can't find campground ${req.params.id}`);
      return res.redirect('back');
    }
    Comment.create(req.body.comment, (err, comment)=>{
      if (err || !comment) {
        req.flash('error', 'Can\'t create comment');
        return res.redirect('back');
      }
      // add username and id to comment
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      //save comment
      comment.save();
      campground.comments.push(comment);
      campground.save();
      req.flash('success', 'Added comment');
      res.redirect(`/campgrounds/${req.params.id}`);
    });
  });
});

// EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if (err || !comment) {
      req.flash('error', `Can't find comment ${req.params.comment_id}`);
      return res.redirect('back');
    }
    return res.render('comments/edit.ejs', {campground: {id: req.params.id}, comment});
  });
});

// UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
    if (err || !comment) {
      req.flash('error', 'Can\'t update comment');
      return res.redirect('back');
    }
    req.flash('Updated comment successfully');
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});

// DESTROY
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=>{
    if (err || !comment) {
      req.flash('error', 'Error deleting comment');
      return res.redirect(`/campgrounds/${req.params.id}`);
    }
    req.flash('success', 'Comment deleted');
    return res.redirect(`/campgrounds/${req.params.id}`);
  });
});

module.exports = router;