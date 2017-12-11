const Campground = require('../models/campground.js'),
      Comment = require('../models/comment.js');

var middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=>{
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground)=>{
      if (err) {
        console.log('checkCampgroundOwnership: can\'t find campground: ', err);
        return res.redirect('back');
      }
      if (campground.author._id.equals(req.user.id)) {
        return next();
      } else {
        res.send("YOU ARE NOT AUTHORIZED TO EDIT THIS CAMPGROUND");
      }
    });
  } else {
    res.send("YOU NEED TO BE LOGGED IN TO EDIT CAMPGROUND");
  }
}

middlewareObj.checkCommentOwnership = (req, res, next)=>{
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment)=>{
      if (err) {
        console.log('checkCommentOwnership: can\'t find comment: ', err);
        return res.redirect('back');
      }
      if (comment.author.id.equals(req.user.id)) {
        return next();
      } else {
        res.send("YOU ARE NOT AUTHORIZED TO EDIT THIS COMMENT");
      }
    });
  } else {
    res.send("YOU NEED TO BE LOGGED IN TO EDIT COMMENTS");
  }
}

module.exports = middlewareObj;