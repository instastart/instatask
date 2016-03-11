
var Mongoose = require('mongoose');

var Schema = Mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Start of Friends n Food

var UserSchema = new Mongoose.Schema({
	"name": String,
	"email": String,
	"password": String,
    "imageUrl": String,
    "attendence": Number,
    "aamount": Number,
    "rating": Number,
    "ramount": Number,
    "location": ObjectId, // default location preferences
    "calendar": ObjectId, // default calendar preferences

    "okayFriends": Boolean,
    "okayFOF": Boolean,
    "okayAny": Boolean,
    "needFriend": Boolean
});

exports.User = Mongoose.model('User', UserSchema);

/*
var CalendarSchema = new Mongoose.Schema({
	"matched": Boolean,
	"time": Date,
	"location": ObjectId
});

exports.Calendar = Mongoose.model('Calendar', CalendarSchema);
*/

var EventSchema = new Mongoose.Schema({
	"person1": ObjectId,
	"person2": ObjectId,
	"person3": ObjectId,
	"person4": ObjectId,
	"time": Date,
	"location": String
});

exports.Event = Mongoose.model('Event', EventSchema);

var CalSchema = new Mongoose.Schema({
	"cval1": Number,
	"cval2start": Number,
	"cval2end": Number,
	"day": Date,
	"user": ObjectId,
	"isDefault": Boolean,
	"event": ObjectId,
	"people": Number, // number of people
	"status": Number, // 0 - searching, 1 - found
	"location": String // where to eat
});

exports.Cal = Mongoose.model('Cal', CalSchema);

var MessageSchema = new Mongoose.Schema({
	"sender": ObjectId,
	"event": ObjectId,
	"message": String,
	"time": Date
});

exports.Message = Mongoose.model('Message', MessageSchema);

var RecentSchema = new Mongoose.Schema({
	"owner": ObjectId,
	"message": String,
	"link": String,
	"onclick": String,
	"time": Date
});

exports.Recent = Mongoose.model('Recent', RecentSchema);

var FriendSchema = new Mongoose.Schema({
	"person": ObjectId,
	"friend": ObjectId,
	"status": Number,
	"last": Date // last time eaten together
});

exports.Friend = Mongoose.model('Friend', FriendSchema);

var LocationSchema = new Mongoose.Schema({
	"d1": Boolean,
	"d2": Boolean,
	"d3": Boolean,
	"d4": Boolean,
	"d5": Boolean,
	"d6": Boolean,
	"d7": Boolean,
	"d8": Boolean,
	"d9": Boolean,
	"d10": Boolean,
	"d11": Boolean,

	"n1": Boolean,
	"n2": Boolean,
	"n3": Boolean,
	"n4": Boolean,
	"n5": Boolean,
	"n6": Boolean,
	"n7": Boolean,
	"n8": Boolean,
	"n9": Boolean,
	"n10": Boolean,
	"n11": Boolean,
	"n12": Boolean,
	"n13": Boolean,
	"n14": Boolean,
	"n15": Boolean
});

exports.Location = Mongoose.model('Location', LocationSchema);

// Depreciated

var ProjectSchema = new Mongoose.Schema({
  // fields are defined here
  "title": String,
	"date": String,
	"summary": String,
	"image": String
});

exports.Project = Mongoose.model('Project', ProjectSchema);

var TaskSchema = new Mongoose.Schema({
	"title": String,
	"location": String,
	"difficulty": String,
	"duration": Number,
    "category": String,
    "status": String,
    "owner": ObjectId
});

exports.Task = Mongoose.model('Task', TaskSchema);



