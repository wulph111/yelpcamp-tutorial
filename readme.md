# YelpCamp

* Add landing page
* Add Campgrounds page that lists all campgrounds

Each campground has:
* Name
* Image


# Layout and Basic Styling
* Create header and footer partials
* Add in Bootstrap

# Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

# Style the campgrounds page
* Add a better header/title
* Make the campgrounds display in a grid

# Style the Navbar and Form
* Adda  navbar to all templates
* Style the new campground form

# Add Mongoose
* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes

# Show Page
* Review RESTful routes we've seen so far
* Add description to campground model
* Show db.collection.drop()
* Add a show route/templates

RESTFUL ROUTES

name    url              verb   description
==========================================================
INDEX   /dogs            GET    Display a list of all dogs
NEW     /dogs/new        GET    Display a form to make a new dog
CREATE  /dogs            POST   Add new dog to DB and redirect to index
SHOW    /dogs/:id        GET    Show info about one dog
EDIT    /dogs/:id/edit   GET    Display a form to edit a dog
UPDATE  /dogs/:id        PUT    Save the dog cmanges and redirect to index
DESTROY /dogs/:id/delete DELETE Remove a dog and redirect to index

# Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!

# Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts

# Add the Comment model
* Make our errors go away
* Display comments on campground show page

# Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

    INDEX  /campgrounds
    NEW    /campgrounds/new
    CREATE /campgrounds (POST)
    SHOW   /campgrounds/:id

    NEW    /campgrounds/:id/comments/new
    CREATE /campgrounds/:id/comments (POST)
    ...etc

# Style Show Page
* Add sidebar to show page
* Display comments nicely
* Add public directory
* Add custom stylesheet

# Authentication
## Add User Model
* Install all packages needed for auth
* Define User model

## Register
* Configure passport
* Add register routes
* Add register template

## Login
* Add login routes
* Add login template

## Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar
* Show/hide auth links correctly

