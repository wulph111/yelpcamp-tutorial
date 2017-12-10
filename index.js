const express = require('express'),
      session = require('express-session'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),

      app = express(),

      Campground = require('./models/campground.js'),
      Comment = require('./models/comment.js'),
      User = require('./models/user.js'),
      seedDB = require('./seeds.js'),

      host = process.env.IP || '0.0.0.0',
      port = process.env.PORT || '8080';

seedDB();


mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));

// PASSPORT CONFIGURATION
app.use(session({
  secret: 'kumquats are purple',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Apply this middleware to every route
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  next();
});



app.get('/', (req, res)=>{
  res.render("landing.ejs");
});

app.get('/secret', (req, res)=>{
  res.send("<h1>shh it's a secret</h1>");
});


// =============
//  CAMPGROUND ROUTES
// =============
// INDEX
app.get('/campgrounds', (req, res)=>{
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
app.get('/campgrounds/new', (req, res)=>{
  res.render('campgrounds/new.ejs', {err: req.query.err});
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
        res.render('campgrounds/detail.ejs', {campground});
      }
    });
  } else {
    res.send(`${req.parms.id} NOT FOUND`);
  }
});


// ==============
//  COMMENTS ROUTES
// ==============
// NEW
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err)
      console.log("ERROR", err);
    else {
      res.render('comments/new.ejs', {campground});
    }
  });
});

//CREATE
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err) {
      console.log('ERROR', err);
    } else {
      Comment.create(req.body.comment, (err, comment)=>{
        if (err) {
          console.log('ERROR', err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      });
    }
  });
});


// ==============
//  AUTH ROUTES
// ==============

// show registration form
app.get('/register', (req, res)=>{
  res.render("register.ejs");
});

// process registration form
app.post('/register', (req, res)=>{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user)=>{
    if (err) {
      console.log(err);
      return res.render('register.ejs');
    }
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/campgrounds');
    });
  });
});

// show login form
app.get('/login', (req, res)=>{
  res.render("login.ejs");
});

// process login form
//app.post(route, middleware, callback)
app.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/campgrounds',
      failureRedirect: '/login'
    }
  ), (req, res)=>{
    // do nothing
  }
);

// process logout
app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/campgrounds');
});


// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(port, host, ()=>{
  console.log(`Listening on ${host}:${port}`);
});