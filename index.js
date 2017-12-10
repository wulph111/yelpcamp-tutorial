const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || '8080';

var campgrounds = [
    {name: 'Allegany', image: 'http://thesummerlocal.com/sites/default/files/styles/full_width/public/main/articles/cabin3_WEB.jpg'},
    {name: 'Ives Run', image: 'http://3.bp.blogspot.com/-tYyUZx04yOI/UfWxTINhhsI/AAAAAAAAIQg/OM5itatxvME/s640/1-Ives+Run+113.jpg'},
    {name: 'Watkins Glen', image: 'https://www.watkinsglenchamber.com/sites/default/files/styles/480x240/public/2017-07/20170724_111041.jpg?itok=OXM2asrg'},
    {name: 'Allegany', image: 'http://thesummerlocal.com/sites/default/files/styles/full_width/public/main/articles/cabin3_WEB.jpg'},
    {name: 'Ives Run', image: 'http://3.bp.blogspot.com/-tYyUZx04yOI/UfWxTINhhsI/AAAAAAAAIQg/OM5itatxvME/s640/1-Ives+Run+113.jpg'},
    {name: 'Watkins Glen', image: 'https://www.watkinsglenchamber.com/sites/default/files/styles/480x240/public/2017-07/20170724_111041.jpg?itok=OXM2asrg'},
    {name: 'Allegany', image: 'http://thesummerlocal.com/sites/default/files/styles/full_width/public/main/articles/cabin3_WEB.jpg'},
    {name: 'Ives Run', image: 'http://3.bp.blogspot.com/-tYyUZx04yOI/UfWxTINhhsI/AAAAAAAAIQg/OM5itatxvME/s640/1-Ives+Run+113.jpg'},
    {name: 'Watkins Glen', image: 'https://www.watkinsglenchamber.com/sites/default/files/styles/480x240/public/2017-07/20170724_111041.jpg?itok=OXM2asrg'},
    {name: 'Allegany', image: 'http://thesummerlocal.com/sites/default/files/styles/full_width/public/main/articles/cabin3_WEB.jpg'},
    {name: 'Ives Run', image: 'http://3.bp.blogspot.com/-tYyUZx04yOI/UfWxTINhhsI/AAAAAAAAIQg/OM5itatxvME/s640/1-Ives+Run+113.jpg'},
    {name: 'Watkins Glen', image: 'https://www.watkinsglenchamber.com/sites/default/files/styles/480x240/public/2017-07/20170724_111041.jpg?itok=OXM2asrg'},
  ];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
  res.render("landing.ejs");
});

app.get('/secret', (req, res)=>{
  res.send("<h1>shh it's a secret</h1>");
});

app.get('/campgrounds', (req, res)=>{
  res.render('campgrounds.ejs', {campgrounds});
});

app.get('/campgrounds/new', (req, res)=>{
  res.render('addCampground.ejs', {err: req.query.err});
});

app.post('/campgrounds', (req, res)=>{
  if (req.body && req.body.name && req.body.image) {
    campgrounds.push({name: req.body.name, image: req.body.image});
    res.redirect('/campgrounds');
  } else {
    res.redirect('/campgrounds/new?err=Error,+need+name+and+image+URL');
  }
});

app.listen(port, host, ()=>{
  console.log(`Listening on ${host}:${port}`);
});