
var models = require('../models');
var std = require("../std");

/*
 * GET home page.
 */

exports.view = function(req, res){
  var obj = {};
  obj["dining"] = diningNames;
  obj["nondining"] = nondiningNames;
  if (req.session.user) {
    obj["loggedin"] = true;
  }
  
  res.render('index', obj);
  /*
    if (!req.session.user) {
      res.redirect("/login");
    } else {
    	res.render('index');
    }
  */
};





/*
exports.view = function(req, res){

    if (!req.session.user) {
       res.redirect("/login");
    } else {
      
      //models.User.find().exec(function(err, us) {console.log(us); res.render('index');});
      
       var filters = {'owner':req.session.user._id, 'status': "in progress"};
       var ff = {};
       if (req.body.status == "completed") {
            filters['status'] = "completed";
            ff['stat2'] = true;
       }

       var checks = ["durre", "durrm", "durrh", "diffe", "diffm", "diffh"];
       for (var i = 0; i < checks.length; i++) {
                  if (req.body.tofilter) {
                        if (req.body[checks[i]]) { 
                              ff[checks[i]] = true;
                        }
                  } else {
                        ff[checks[i]] = true;
                  }
       }

       filters['difficulty'] = {$in: []};
       if (ff["diffe"]) {
              filters['difficulty']["$in"].push("easy");
       }
       if (ff["diffm"]) {
              filters['difficulty']["$in"].push("medium");
       }
       if (ff["diffh"]) {
              filters['difficulty']["$in"].push("hard");
       }

       if (req.body.category && req.body.category != "All") {
              filters['category'] = req.body.category;
       }

       if (req.body.location && req.body.location != "All") {
              filters['location'] = req.body.location;
       }

       ff["mindurr"] = 0;
       ff["maxdurr"] = 10;
       if (req.body.mindurr) {
          ff["mindurr"] = req.body.mindurr;
       }
       if (req.body.maxdurr) {
          ff["maxdurr"] = req.body.maxdurr;
       }
       if (ff["mindurr"] != 0 || ff["maxdurr"] != 10) {
              if (ff["maxdurr"] == 10) {
            filters['duration'] = {$gte: ff["mindurr"]};
              } else {
                  filters['duration'] = {$gte: ff["mindurr"], $lte: ff["maxdurr"] };
              }

       }
       console.log("filters: ", filters)
       
       models.Task.find({'owner':req.session.user._id}).exec(
              function (err2, task2) {
                  // this code handles the listing all task categories and location for this user
                  ff["cats"] = []; seencats = {};
                  ff["locs"] = []; seenlocs = {};
                  for (var i = 0; i < task2.length; i++) {
                        if (!seencats[task2[i].category]) {
                              seencats[task2[i].category] = true;
                              if (task2[i].category == req.body.category) {
                                    ff["cats"].push({'cat':task2[i].category, 'sel':true});
                              } else {
                                    ff["cats"].push({'cat':task2[i].category});
                              }
                        }
                        if (!seenlocs[task2[i].location]) {
                              seenlocs[task2[i].location] = true;
                              if (task2[i].location == req.body.location) {
                                    ff["locs"].push({'loc':task2[i].location,'sel':true});
                              } else {
                                    ff["locs"].push({'loc':task2[i].location});
                              }
                              
                        }
                  }
                  ff["cats"].sort(); ff["locs"].sort();

                  models.Task
                  .find(filters)
                  .exec(renderTasks); 

                function renderTasks(err, tasks) {
                        console.log(tasks);

                        obj = { 'tasks': tasks, 'filters': filters, 'ff': ff };

                        res.render('index', obj);
                  }
              }
       );

       
    }

};
*/