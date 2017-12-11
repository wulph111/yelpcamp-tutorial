const express = require('express'),
      router = express.Router(),
      Campground = require('../models/campground.js'),
      middleware = require('../middleware/middleware.js');


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
router.get('/new', middleware.isLoggedIn, (req, res)=>{
  res.render('campgrounds/new.ejs', {err: req.query.err});
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res)=>{
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

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) { // should not occur because we verified this in the middleware already
      return res.redirect('back');
    }
    res.render('campgrounds/edit.ejs', {campground});
  });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
    if (err) {
      return res.redirect('/campgrounds');
    }
    return res.redirect(`/campgrounds/${campground._id}`);
  });
});

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findByIdAndRemove(req.params.id, (err, campground)=>{
      if (err) {
        console.log('DELETE CAMPGROUND ERROR: ', err);
        return res.redirect(`/campgrounds/${campground._id}`);
      }
      return res.redirect('/campgrounds');
  });
});

module.exports = router;