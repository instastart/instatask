
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');
var session = require('client-sessions');

var index = require('./routes/index');
var project = require('./routes/project');
var login = require('./routes/login');
var task = require('./routes/task');
// Example route
// var user = require('./routes/user');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'instatask';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

var app = express();

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.post('/', index.view);
app.get('/project/:id', project.projectInfo);

app.get('/login', login.loginPage);
app.post('/login', login.loginPage);
app.get('/signup', login.signupPage);
app.post('/signup', login.signupPage);
app.get('/logout', login.logoutPage);
app.get('/welcome', login.welcomePage);
app.get('/settings', login.settingsPage);
app.post('/settings', login.settingsPage);
app.get('/step1', login.step1Page);
app.post('/step1', login.step1Page);
app.get('/step2', login.step2Page);
app.post('/step2', login.step2Page);
app.get('/step3', login.step3Page);
app.post('/step3', login.step3Page);
app.get('/step4', login.step4Page);
app.post('/step4', login.step4Page);
app.get('/curruser', login.currUserPage);
app.get('/recent', login.recentPage);
app.get('/friends', login.friendsPage);
app.post('/user', login.userInfoPage);

app.post('/cal', login.calPage);

app.get('/add', task.addTask);
app.post('/add', task.addTask);
app.post('/complete', task.completeTask);
app.get('/task/:id', task.editTask);
app.post('/task/:id', task.editTask);
app.post('/delete', task.deleteTask);

app.post('/project/new', project.addProject);
app.post('/project/:id/delete', project.deleteProject);

app.get('/calendar', task.viewCalendar);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
