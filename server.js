// Require the Express Module
var express = require('express');
// Create an Express App
var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;

var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
})

var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String
})
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote')

// This is the route that we already have in our server.js
// When the user presses the submit button on index.ejs it should send a post request to '/users'.  In
//  this route we should add the user to the database and then redirect to the root route (index view).
app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var q = new Quote();
    q.name = req.body['name'];
    q.quote = req.body['quote'];
    q.save(function(err){
        if (err){
            console.log(err);
        } else {
            console.log("record saved successfully!")
        }
    } );
    // This is where we would add the user from req.body to the database.
    res.redirect('/quotes');
})

app.get('/quotes', function(req, res){
    Quote.find({}, function(err, quotes) {
        if (err){
            console.log(err);
            res.redirect('/');
        } else {
            // for q in quotes {
            //     console.log(q.name);  
            // }
            res.render('showQuotes', {quotes: quotes});
        }
    })

    
} )

   

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
