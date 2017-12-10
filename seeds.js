const mongoose = require('mongoose'),
      Campground = require('./models/campground.js'),
      Comment = require('./models/comment.js');

var initCampgrounds = [
    {
      name: 'Allegany',
      image: 'http://thesummerlocal.com/sites/default/files/styles/full_width/public/main/articles/cabin3_WEB.jpg',
      description: 'Known for its two lakes and wonderful camping experiences.'
    },
    {
      name: 'Ives Run',
      image: 'http://3.bp.blogspot.com/-tYyUZx04yOI/UfWxTINhhsI/AAAAAAAAIQg/OM5itatxvME/s640/1-Ives+Run+113.jpg',
      description: 'Surrounded by lush forested ridges, the lake offers recreation for the entire family, including picnicking, swimming, boating, fishing, hiking, hunting and wildlife watching.'
    },
    {
      name: 'Watkins Glen',
      image: 'https://www.watkinsglenchamber.com/sites/default/files/styles/480x240/public/2017-07/20170724_111041.jpg?itok=OXM2asrg',
      description: 'Within two miles, the glen\'s stream descends 400 feet past 200-foot cliffs, generating 19 waterfalls along its course.'
    },
  ];

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true});
mongoose.Promise = global.Promise;

function seedDB() {

  //Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      console.log('Removed All Campgrounds');

      //Add sample campgrounds
      initCampgrounds.forEach( (c)=>{
        Campground.create(c, (err, campground)=>{
          if (err) {
            console.log('ERROR:', err);
          } else {
            console.log('Added a campground');

            //Create a comment
            Comment.create({
              text: 'This place is great but i wish there was internet.',
              author: 'homer'
            }, (err, comment)=>{
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log('Created new comment');
              }
            });

          }
        });
      });

    }
  });


}



module.exports = seedDB;