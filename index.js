const express = require('express'),
      session = require('express-session'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),

      app = express(),

      Campground = require('./models/campground.js'),
      Comment = require('./models/comment.js'),
      User = require('./models/user.js'),
      seedDB = require('./seeds.js'),

      commentRoutes = require('./routes/comments.js'),
      campgroundRoutes = require('./routes/campgrounds.js'),
      authRoutes = require('./routes/auth.js'),

      host = process.env.IP || '0.0.0.0',
      port = process.env.PORT || '8080';

// seedDB();


mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

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

app.use(authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.get('/', (req, res)=>{
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }
  return res.render("landing.ejs");
});

app.get('/secret', (req, res)=>{
  res.send("<h1>shh it's a secret</h1>");
});








app.listen(port, host, ()=>{
  console.log(`Listening on ${host}:${port}`);
});