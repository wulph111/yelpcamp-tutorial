const Campground = require('../models/campground.js'),
      Comment = require('../models/comment.js');

var middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=>{
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('danger', 'Please log in first!');
  return res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground)=>{
      if (err || !campground) {
        req.flash('danger', 'Can\'t find campground');
        return res.redirect('back');
      }
      if (campground.author._id.equals(req.user.id)) {
        return next();
      }
      req.flash('danger', 'You are not authorized to edit this campground');
      return res.redirect('back');
    });
  } else {
    req.flash('danger', 'You need to be logged in to edit campgrounds');
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnership = (req, res, next)=>{
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment)=>{
      if (err || !comment) {
        req.flash('danger','Can\'t find comment');
        return res.redirect('back');
      }
      if (comment.author.id.equals(req.user.id)) {
        return next();
      }
      req.flash('danger','You are not authorized to edit this comment');
      res.redirect('back');
    });
  } else {
    req.flash('danger','You need to be logged in to edit comments');
    res.redirect('back');
  }
}

module.exports = middlewareObj;