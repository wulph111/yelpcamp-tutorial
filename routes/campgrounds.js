const express = require('express'),
      router = express.Router(),
      Campground = require('../models/campground.js');


// =============
//  CAMPGROUND ROUTES
// =============
// INDEX
router.get('/', (req, res)=>{
  console.log(req.user);
  Campground.find({}, (err, allCampgrounds)=>{
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.render('campgrounds/index.ejs', {campgrounds: allCampgrounds});
    }
  });
});

// NEW
router.get('/new', (req, res)=>{
  res.render('campgrounds/new.ejs', {err: req.query.err});
});

// CREATE
router.post('/', (req, res)=>{
  if (req.body && req.body.name && req.body.image) {
    Campground.create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.desc,
    }, (err, newlyCreated)=>{
      if (err) {
        res.redirect('/new?err=Error,+cannot+create+new+campground');
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/new?err=Error,+need+name+and+image+URL');
  }
});

// SHOW
router.get('/:id', (req, res)=>{
  console.log('GET /campgrounds/' + req.params.id);
  if (req.params && req.params.id) {
    Campground.findById(req.params.id).populate('comments').exec((err, campground)=>{
      if (err) {
        console.log("********** ERROR:", err);
      } else {
        console.log("campground:", campground);
        res.render('campgrounds/detail.ejs', {campground});
      }
    });
  } else {
    res.send(`${req.parms.id} NOT FOUND`);
  }
});

module.exports = router;