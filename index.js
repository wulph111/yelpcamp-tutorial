const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const seedDB = require('./seeds.js');

seedDB();

const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || '8080';


mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
  res.render("landing.ejs");
});

app.get('/secret', (req, res)=>{
  res.send("<h1>shh it's a secret</h1>");
});

// INDEX
app.get('/campgrounds', (req, res)=>{
  Campground.find({}, (err, allCampgrounds)=>{
    if (err) {
      console.log("ERROR:", err);
    } else {
      res.render('campgrounds.ejs', {campgrounds: allCampgrounds});
    }
  });
});

// NEW
app.get('/campgrounds/new', (req, res)=>{
  res.render('addCampground.ejs', {err: req.query.err});
});

// CREATE
app.post('/campgrounds', (req, res)=>{
  if (req.body && req.body.name && req.body.image) {
    Campground.create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.desc,
    }, (err, newlyCreated)=>{
      if (err) {
        res.redirect('/campgrounds/new?err=Error,+cannot+create+new+campground');
      } else {
        res.redirect('/campgrounds');
      }
    });
  } else {
    res.redirect('/campgrounds/new?err=Error,+need+name+and+image+URL');
  }
});

// SHOW
app.get('/campgrounds/:id', (req, res)=>{
  console.log('GET /campgrounds/' + req.params.id);
  if (req.params && req.params.id) {
    Campground.findById(req.params.id).populate('comments').exec((err, campground)=>{
      if (err) {
        console.log("********** ERROR:", err);
      } else {
        console.log("campground:", campground);
        res.render('showCampground.ejs', {campground});
      }
    });
  } else {
    res.send(`${req.parms.id} NOT FOUND`);
  }
});

app.listen(port, host, ()=>{
  console.log(`Listening on ${host}:${port}`);
});