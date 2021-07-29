var express = require('express');
var MongoClient = require('mongodb').MongoClient
var bParser = require('body-parser');
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//body-parser package is used to handle the data from the POST
app.use(bParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/login', function (req, res) {
	var html =   '<img src = "logo.png" />' + '<form action="/login" method="post">' +
               'Enter Username:' +
               '<input type="text" name="userName" />' +
               '<br>' +
			   'Enter Password:' +
			   '<input type="password" name="password" />' +
			   '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>' +
          '<br>' + '<a href="/create">Create user</a>'


  res.send(html);
});

app.post('/login', function(req, res){
  var userName = req.body.userName;
  var password = req.body.password;
  MongoClient.connect('mongodb://localhost:27017/app', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('logins');
          dbCollection.findOne({'Username':userName}, function (err, document) {
          if(document.Password === password)
          {
            res.redirect('/default');
            console.log(document);
          }
          else
          {
            res.send("Error <br>" + '<a href="/login">Try again</a>')
            console.log(document);
          }

			 db.close();
			}); //end findOne
	}); //end .connect
});

app.get('/default', function(req, res){
  var userURL = req.body.newURL;
  MongoClient.connect('mongodb://localhost:27017/app', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('tasks');
			dbCollection.find().toArray(function (err, documents) {
			var arrayLength = documents.length;
			var html = "";
			for (var i = 0; i < arrayLength; i++) {
			 html = html + documents[i].Task + '<br/>'
       var links = '<a href="/enterTasks">Enter a task</a>' + '<br/>' + '<a href="/create">Create user</a>';
			}
			res.send(html + links);
			 db.close();
			}); //end find
	}); //end .connect
}); //end app.get

app.get('/enterTasks', function (req, res) {
	var html = '<form action="/enterTasks" method="post">' +
               'Enter task:' +
               '<input type="text" name="task" />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>' +
                '<br>' + '<a href="/default">Go to Default</a>'

  res.send(html);
});

app.post('/enterTasks', function (req, res){
	//get the url that was typed into the input with the name newURL
  var task = req.body.task;
  //connect to database testing
  MongoClient.connect('mongodb://localhost:27017/app', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('tasks');
		dbCollection.insert({"Task":task}, function(err, result) {
			dbCollection.find().toArray(function (err, documents) {
			console.log(documents);
      res.send("Task added" + '<br>' + '<a href="/default">Go to Default</a>');
			 //close database for performance
			 db.close();
			}); //end find
		}); //end insert
	}); //end .connect
});

app.get('/create', function (req, res) {
	var html = '<form action="/create" method="post">' +
               'Username:' +
               '<input type="text" name="userName" />' +
               '<br>' +
               'First name:' +
               '<input type="text" name="firstName" />' +
               '<br>' +
               'Last name:' +
               '<input type="text" name="lastName" />' +
               '<br>' +
               'Email:' +
               '<input type="text" name="email" />' +
               '<br>' +
               'Password:' +
               '<input type="password" name="password" />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';

  res.send(html);
});

app.post('/create', function (req, res){
	//get the url that was typed into the input with the name newURL
  var userName = req.body.userName;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  //connect to database testing
  MongoClient.connect('mongodb://localhost:27017/app', function (err, db) {
	if (err) throw err
	var dbCollection = db.collection('logins');
		dbCollection.insert({"Username":userName,"First name":firstName,"Last name":lastName,"Email":email,"Password":password}, function(err, result) {
			dbCollection.find().toArray(function (err, documents) {
			console.log(documents);
      res.send("success" + '<br>' + '<a href="/login">Login</a>');
			 //close database for performance
			 db.close();
			}); //end find
		}); //end insert
	}); //end .connect
});



app.listen(3001, function () {
    console.log('Listening on port 3001');
});
