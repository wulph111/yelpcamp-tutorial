const express = require('express'),
      router = express.Router(),
      Campground = require('../models/campground.js'),
      middleware = require('../middleware/middleware.js');


// =============
//  CAMPGROUND ROUTES
// =============
// INDEX
router.get('/', (req, res)=>{
  console.log('**in campgrounds list route, msgs:', res.locals.msgs);
  Campground.find({}, (err, allCampgrounds)=>{
    if (err || !allCampgrounds || allCampgrounds.length == 0) {
      req.flash('error', 'No campgrounds found');
      if (err) {
        req.flash('error', err.message);
      }
    }
    return res.render('campgrounds/index.ejs', {msgs: res.locals.msgs, campgrounds: allCampgrounds});
  });
});

// NEW
router.get('/new', middleware.isLoggedIn, (req, res)=>{
  res.render('campgrounds/new.ejs');
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res)=>{
  req.body.campground.author = req.user;
  Campground.create(req.body.campground, (err, newlyCreated)=>{
    if (err) {
      req.flash('success', 'Could not create new campground:', err.message);
      return res.redirect('/new', {campground: req.body.campground});
    }
    req.flash('success', 'Created new campground');
    return res.redirect(`/campgrounds/${newlyCreated._id}`);
  });
});

// SHOW
router.get('/:id', (req, res)=>{
  Campground.findById(req.params.id).populate('comments').exec((err, campground)=>{
    if (err || !campground) {
      req.flash('error', 'Cannot find requested campground');
      return res.redirect('/campgrounds');
    }
    return res.render('campgrounds/detail.ejs', {campground});
  });
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) { // should not occur because we verified this in the middleware already
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.render('campgrounds/edit.ejs', {campground});
  });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/campgrounds');
    }
    req.flash('success', 'Campground information updated');
    return res.redirect(`/campgrounds/${campground._id}`);
  });
});

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
  console.log("DESTROY");
  Campground.findByIdAndRemove(req.params.id, (err, campground)=>{
      if (err) {
        res.flash('error', err.message);
        return res.redirect(`/campgrounds/${req.parms.id}`);
      }
      req.flash('success', 'Campground deleted');
      return res.redirect('.');
  });
});

module.exports = router;