const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const DO_INIT_DB = false;

const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || '8080';

var initCampgrounds = [
    {name: 'Allegany', image: 'http://thesummerlocal.com/sites/default/files/styles/full_width/public/main/articles/cabin3_WEB.jpg', description: 'Known for its two lakes and wonderful camping experiences.'},
    {name: 'Ives Run', image: 'http://3.bp.blogspot.com/-tYyUZx04yOI/UfWxTINhhsI/AAAAAAAAIQg/OM5itatxvME/s640/1-Ives+Run+113.jpg', description: 'Surrounded by lush forested ridges, the lake offers recreation for the entire family, including picnicking, swimming, boating, fishing, hiking, hunting and wildlife watching.'},
    {name: 'Watkins Glen', image: 'https://www.watkinsglenchamber.com/sites/default/files/styles/480x240/public/2017-07/20170724_111041.jpg?itok=OXM2asrg', description: 'Within two miles, the glen\'s stream descends 400 feet past 200-foot cliffs, generating 19 waterfalls along its course.'},
  ];

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

var Campground = mongoose.model('Campground', campgroundSchema);
if (DO_INIT_DB) {
  initCampgrounds.forEach( (c)=>{
    Campground.create(c, (err, campground)=>{
      if (err) {
        console.log('ERROR:', err);
      } else {
        console.log('ADDED:', campground);
      }
    });
  });
}

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
    Campground.findById(req.params.id, (err, campground)=>{
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