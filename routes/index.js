var express = require('express');
var router = express.Router();
var functions = require('../functions.js');
var queries = require('../queries.js');
var async = require('async');
var Promise = require('bluebird');
var wrap = require('co-express');
var co      = Promise.coroutine;
/* GET home page. */
router.get('/',function (req, res, next) {
  var current_person = {
    "name":"Bogdan Mihail Tirca",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };
  console.log("xx");
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.ascending('score');
   query.limit(3);//so
   
   query.find().then(function(users) {// query to fetch top scorers
	  console.log("users fetch from query" + JSON.stringify(users));
	  res.render('index', { current_person: current_person, leaderboard_list: users });
	}, function(err) {// when error
	  console.log("err" + err);
	  res.render('index', { error: "undefined"}); 
	});
   /*res.render('index', { current_person: current_person, leaderboard_list: query.find() });*/
	console.log("xxx");//asa, nu pot sa vb.....BA
});

/*router.get('/leaderboard/:leaderBoardSize', function(req, res, next) {
	console.log("rq" + req.params.leaderBoardSize);
	var limit = parseInt(req.params.leaderBoardSize);


	//TODO move back to queries
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.ascending('score');
   query.limit(limit);

   query.find().then(function(users) {
      console.log(JSON.stringify(users));
       var leaderboard_list = [];
	  for(var i = 0; i < users.lenght; i ++)
	    leaderboard_list.push(users[i]);
	  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
    }, function(err) {
      console.log("err" + err);
	  res.render('index', { error: "undefined"});
      console.log(err); 
    });
  
});*/
router.get('/voted/:voteValue/:fbId', function(req, res, next) {
  //register vote to parse for last generated person for this user (only if exists)
   var userFetched = functions.vote(req.params.voteValue, req.params.fbId);/// score,fbId
   console.log("#$#$#@@#@");
  var current_person = {
    "name":"BogdanNext1",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };
  var leaderboard_list = [];
  for(var i = 0; i < 10; i ++)
    leaderboard_list.push(current_person);
 // console.log(leaderboard_list)
  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
});

router.get('/users', function(req, res, next) {
  console.log("get /users @@@@@@@@@@###")
  res.send('YESS! respond with a resource');
});

module.exports = router;
