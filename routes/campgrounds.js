const express = require('express'),
      router = express.Router(),
      Campground = require('../models/campground.js');


// =============
//  CAMPGROUND ROUTES
// =============
// INDEX
router.get('/', (req, res)=>{
  console.log(req.user);
  console.log(typeof req.user);
  Campground.find({}, (err, allCampgrounds)=>{
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.render('campgrounds/index.ejs', {campgrounds: allCampgrounds});
    }
  });
});

// NEW
router.get('/new', isLoggedIn, (req, res)=>{
  res.render('campgrounds/new.ejs', {err: req.query.err});
});

// CREATE
router.post('/', isLoggedIn, (req, res)=>{
  Campground.create({
    name: req.body.name,
    image: req.body.image,
    description: req.body.desc,
    author: req.user,
  }, (err, newlyCreated)=>{
    if (err) {
      res.redirect('/new?err=Error,+cannot+create+new+campground');
    } else {
      res.redirect(`/campgrounds/${newlyCreated._id}`);
    }
  });
});

// SHOW
router.get('/:id', (req, res)=>{
  console.log('GET /campgrounds/' + req.params.id);
  if (req.params && req.params.id) {
    Campground.findById(req.params.id).populate('comments').exec((err, campground)=>{
      if (err) {
        console.log("********** ERROR:", err);
      } else {
        console.log(campground);
        res.render('campgrounds/detail.ejs', {campground});
      }
    });
  } else {
    res.send(`${req.parms.id} NOT FOUND`);
  }
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


module.exports = router;