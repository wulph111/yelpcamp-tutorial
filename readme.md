#YelpCamp

* Add landing page
* Add Campgrounds page that lists all campgrounds

Each campground has:
* Name
* Image


#Layout and Basic Styling
* Create header and footer partials
* Add in Bootstrap

#Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

#Style the campgrounds page
* Add a better header/title
* Make the campgrounds display in a grid

#Style the Navbar and Form
* Adda  navbar to all templates
* Style the new campground form

#Add Mongoose
* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes

#Show Page
* Review RESTful routes we've seen so far
* Add description to campground model
* Show db.collection.drop()
* Add a show route/templates

RESTFUL ROUTES

name    | url          | verb   | description
--------|--------------|--------|-------------
INDEX   | /dogs        | GET    | Display a list of all dogs
NEW     | /dogs/new    | GET    | Display a form to make a new dog
CREATE  | /dogs        | POST   | Add new dog to DB
SHOW    | /dogs/:id    | GET    | Show info about one dog