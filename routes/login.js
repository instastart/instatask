 
var models = require('../models');
var std = require("../std");
/*
 * GET home page.
 */

exports.currUserPage = function(req, res) {
    if (req.session.user) {
        models.User.find({_id: req.session.user._id}).exec(afterUserFind);

        function afterUserFind(err, users) {
            var obj = {"success": true, "user": users[0]};
            models.Location.find({_id: req.session.user.location }).exec(afterFind);
            function afterFind(err, locs) {
                if (locs.length > 0) {
                    obj["location"] = locs[0];
                }
                res.json(obj);
            }
        }
        
        
    } else {
        res.json({"error": "No user logged in", "success": false});
    }
}

exports.userInfoPage = function(req, res) {
    if (req.body.id) {
        if (req.body.status) {
            models.Friend.update({person: req.session.user._id, friend: req.body.id},
                {status: req.body.status}, afterStatusUpdate);
            function afterStatusUpdate(err) {
                if (err) {
                    console.log(err);
                }
                res.json({'success': true});
            }

        } else {
            models.User.find({_id: req.body.id}).exec(afterFind);

            function afterFind(err, users) {
                models.Friend.find({person:req.session.user._id,friend:req.body.id}).exec(afterFriendFind);
                function afterFriendFind(err, friends) {
                    res.json({"user": users[0], "friendship": friends[0], "success": true});
                }
            }
        }
    } else {
        res.json({'success': false, "error": "No user id provided"});
    }
}

exports.calPage = function(req, res) {
    if (!req.session.user) {
        res.json({"error": "No user logged in", "success": false});
        return;
    } 

    function afterRemove(err) {
        if (err) {
            console.log(err);
        }   
        res.json({"success": true});
    }
    if (req.body.def) {
        if (req.body.clear) {
            models.Cal.remove({week: req.body.week, user: req.session.user._id}, afterRemove);
        } else if (req.body.remove) {
            models.Cal.remove({
                "day": {$gt: new Date(req.body.daystart), $lt: new Date(req.body.dayend)},
                "status": 0,
                "user": req.session.user._id,
                "isDefault": req.body.def
            }, afterRemove);
        } else if (req.body.set) {
            var newCal = new models.Cal(
            {
                "cval1": req.body.cval1,
                "cval2start": req.body.cval2start,
                "cval2end": req.body.cval2end,
                "day": new Date(req.body.day),
                "status": 0, // 0 - searching, 1 - found
                "user": req.session.user._id,
                "isDefault": req.body.def
            });
            newCal.save(afterSaving);

            function afterSaving(err) {
                if (err) {
                    console.log(err);
                }
                res.json({"success": true});
            }

        } else if (req.body.get) {
            models.Cal.find({day: {$gte: new Date(req.body.daystart), $lt: new Date(req.body.dayend)}, isDefault: req.body.def, user: req.session.user._id}).exec(afterFind);

            function afterFind(err, cals) {
                if (err) {
                    console.log(err);
                }
                console.log(cals);
                res.json({ "success": true, "cals": cals});
            }
        }
    } else {
        res.json({'success': false, "error": "No default status provided"});
    }
}

exports.recentPage = function(req, res) {
    if (req.session.user) {
        models.Recent.find({owner: req.session.user._id}).exec(afterRecentFind);
        function afterRecentFind(err, recents) {
            var obj = {"success": true, "recents": recents};
            res.json(obj);
        }
    } else {
        res.json({"error": "No user logged in", "success": false});
    }
}

exports.friendsPage = function(req, res) {
    if (req.session.user) {
        models.Friend.find({person: req.session.user._id}).exec(afterFriendFind);
        function afterFriendFind(err, friends) {
            var flist = [];
            for (var i = 0; i < friends.length; i++) {
                flist.push(friends[i].friend);
            }
            models.User.find({_id: {$in: flist}}).sort("name").exec(afterFind);

            function afterFind(err, found) {
                if (err) {
                    console.log(err);
                }
                var obj = {"success": true, "friends": found, "friendships": friends};
                res.json(obj);
            }
            
        }
    } else {
        res.json({"error": "No user logged in", "success": false});
    }
}

exports.loginPage = function(req, res){
	if (req.body.email) {
        models.User.find({email: req.body.email, password: req.body.password}).exec(afterLogin);

        function afterLogin(err, user) {
        	console.log(user);
        	if (user.length > 0) { // HOADO: PREVENT MULTIPLE USERS WITH SAME EMAIL
        		req.session.user = user[0];
        	    res.json({"success": true, "user": user[0]});
        	} else {
                res.json({"error": "Bad email/password combination", "success": false});
        	}
        }
	} else {
        res.json({"error": "No information entered", "success": false});
	}
	
};

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.signupPage = function(req, res) {
    if (req.body.name) {
        var newUser = new models.User(
            {
                "name": toTitleCase(req.body.name),
                "email": req.body.email,
                "password": req.body.password,
                "imageUrl": "http://qualiadesigns.com/wp-content/uploads/qdi-generic-testimonial-person.png",
                "attendence": 0,
                "aamount": 0,
                "rating": 0,
                "ramount": 0,

                "okayFriends": true,
                "okayFOF": true,
                "okayAny": false,
                "needFriend": true
            }
        );
        models.User.find({email: req.body.email}).exec(afterCheck);

        function afterCheck(err, user) {
            if (user.length > 0) { // HOADO: PREVENT MULTIPLE USERS WITH SAME EMAIL
                res.json({'error': "This email has already been registered", "success": false});
            } else {
                newUser.save(afterSaving);

                function afterSaving(err, nuser) {
                    if (err) {
                        console.log(err);
                    }
                    req.session.user = nuser;
                    var newRecent = new models.Recent({
                        "owner": nuser._id,
                        "message": "<b>Welcome to FRIENDSnFOOD!</b><br> Be sure to input the times you are free to grab food so that you can stay in touch with your friends despite your busy life!",
                        "link": "",
                        "time": Date.now()
                    });
                    newRecent.save();
                    res.json({'success': true});
                }
            }
    		
        }
        
    } else {
    	res.json({'error': "Please fill out all the fields", "success": false});
    }
}

exports.logoutPage = function(req, res) {
	req.session.reset();
    res.render('logout');
}

// Steps pipeline
exports.step1Page = function(req, res) {
    if (req.body.url) {

        models.User.update({_id: req.session.user._id}, {
            "imageUrl": req.body.url,
            "okayFriends": req.body.f,
            "okayFOF": req.body.fof,
            "okayAny": req.body.any,
            "needFriend": req.body.req },
            function (err) {
                if (err) {
                    console.log(err);
                }
                res.json({'success': true});
            }
        )

    } else {
        res.json({'error': "An unexpected error has occurred", "success": false});
    }
}

exports.step2Page = function(req, res) {
    if (req.body.d1) {
        if (req.session.location) {
            models.Location.remove({_id: req.session.location._id},
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }
        
        var obj = {};
        for (var i = 1; i < 12; i++) {
            obj["d" + i] = req.body["d" + i] == 'true';
        }
        for (var i = 1; i < 16; i++) {
            obj["n" + i] = req.body["n" + i] == 'true';
        }
        var newLoc = new models.Location(obj);
        newLoc.save(afterLocSaving);
        function afterLocSaving(err, nobj) {
            if (err) {
                console.log(err);
            }
            models.User.update({_id: req.session.user._id}, {
                "location": nobj._id
            }, function(err, updated) {

                if (err) {
                    console.log(err);
                }
                req.session.user.location = nobj._id;
                res.json({'success': true});
            });
            
        }
    } else {
        res.json({'error': "An unexpected error has occurred", "success": false});
    }
    
}

exports.step3Page = function(req, res) {
    if (req.body.action) {
        if (req.body.action == "search") {
            if (req.body.query.indexOf("@") >= 0) {
                models.User.find({email: new RegExp(req.body.query, 'i') }).exec(afterFind);
            } else {
                models.User.find({name: new RegExp(req.body.query, 'i') }).exec(afterFind);
            }
            

            function afterFind(err, found) {
                // console.log(found);
                models.Friend.find({
                    "person": req.session.user._id
                }).exec(afterFilter);
                function afterFilter(err, repeats) {
                    var ret = [];
                    for (var i = 0; i < found.length; i++) {
                        var toAdd = true; 
                        for (var j = 0; j < repeats.length; j++) {
                            if ("" + repeats[j].friend == "" + found[i]._id) { // objectId is different from id
                                toAdd = false;
                            }
                        }
                        if (toAdd && req.session.user._id != found[i]._id) {
                            ret.push(found[i]);
                        }
                    }
                    res.json({'success': true, 'found': ret});
                }
            }
        } else if (req.body.action == "add") {
            if (req.session.user._id == req.body.id) {
                res.json({'error': "Sorry, you can't be friends with yourself", "success": false});
                return;
            }
            models.Friend.find({
                "person": req.session.user._id,
                "friend": req.body.id
            }).exec(afterPrevent);

            function afterPrevent(err, amt) {
                if (amt.length > 0) {
                    res.json({'error': "You are already friends with this person", "success": false});
                } else {
                    var newFriend = new models.Friend({
                        "person": req.session.user._id,
                        "friend": req.body.id,
                        "status": 0
                    });
                    var newFriend2 = new models.Friend({
                        "person": req.body.id,
                        "friend": req.session.user._id,
                        "status": 0
                    });
                    newFriend.save(afterAdding);
                    newFriend2.save(function(err) {});
                    function afterAdding(err) {
                        if (err) {
                            console.log(err);
                        }
                        res.json({'success': true});
                    }
                }
                
            }
            

        }
    } else {
        res.json({'error': "An unexpected error has occurred", "success": false});
    }
    
}

exports.step4Page = function(req, res) {
    res.render('step4');
}

exports.welcomePage = function(req, res) {
    res.render('welcome');
}

exports.settingsPage = function(req, res) {


    res.render('settings');
}