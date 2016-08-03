var express = require('express');
var router = express.Router();
var functions = require('../functions.js');
var queries = require('../queries.js');
var Promise = require('bluebird');
var requestLib = Promise.promisify(require("request"));


router.post('/login', function(req, res) {//todo for 
	console.log("req body" + JSON.stringify(req.body));
	var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.contains('name', req.body.name);
   query.first().then(function(objAgain) {
      console.log("user found" + JSON.stringify(objAgain));
      var score = objAgain.get('score');
      res.end(JSON.stringify(score));
    }, function(err) {
       console.log(JSON.stringify(err)); 
       res.end("5");
      console.log(err); 
    });
});

/* GET home page. */
router.get('/',function (req, res, next) {
  var current_person = {
    "name":"Bogdan Mihail Tirca",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };

   var postUrl = "http://52.31.174.126:8001/api/saveLastLocation";
     console.log("postUrl" + postUrl);
     
  console.log("xx");
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.descending('score');
   query.limit(10);//so
   
   query.find().then(function(users) {// query to fetch top scorers
	  console.log("load data at refresh" + JSON.stringify(users));
	  var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {leaderboard_list: users, cluster : "buzesti", password:"4loc4"}
     };

     requestLib(data);
	  res.render('index', { current_person: users[0], leaderboard_list: users });
	}, function(err) {// when error
	  console.log("err3" + JSON.stringify(err));
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
router.get('/voted/:voteValue/:fbId/:nrOfVotes/:score', function(req, res, next) {

	//var cookie = req.cookies.espress:sessid;
	//console.log('Cookies: ', cookie);
	console.log("req id" + JSON.stringify(req.session.id));
	var sessid = req.session.id;
  //register vote to parse for last generated person for this user (only if exists)
   var vote = parseInt(req.params.voteValue);
   var nrOfVotes = parseInt(req.params.nrOfVotes);
   var lastScore = parseInt(req.params.score);
   var scoreAverage = parseInt((vote + nrOfVotes * lastScore)/(nrOfVotes+1));

   var userFetched = queries.updateUserWithScore(req.params.fbId, parseInt(req.params.voteValue));/// score,fbId
   var leaderboard = [];
   var skip = 0;
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   var hasUser = 0;
   var hasTop = false;
   
   
  /* query.find().then(function(users) {// query to fetch top scorers
	  console.log("users fetch from query" + JSON.stringify(users));
	  leaderboard = users;
	  hasTop = true;
	}, function(err) {// when error
	  console.log("err" + err);
	});*/
     var postUrl = "http://52.31.174.126:8001/api/saveLastMacObjects";
     console.log("postUrl" + postUrl);
     var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {fbId: sessid, cluster : "buzesti", password:"4loc4"}
     };
    return Promise.resolve(requestLib(data)).then(function(redis ){
		console.log("bucket" + JSON.stringify(redis));
		if(redis.body != null) {
		  	 //skip = redis.body.;
		  	 leaderboard = redis.body.leaderboard_list;
		  	 skip = parseInt(redis.body.bucket) * 10 + parseInt(redis.body.userIndex);
		  	 var obj = new Parse.Object('Oameni');
  		     var queryUser = new Parse.Query('Oameni');
	  		 queryUser.ascending('createdAt');
			   queryUser.limit(1);//so
			   queryUser.skip(skip);
			   queryUser.find().then(function(users) {// query to fetch top scorers
				  console.log("users fetch from query" + JSON.stringify(users));
				  nextUserToVote = users;
				  console.log("leaderBoard" + JSON.stringify(leaderboard));
				  console.log("score scoreAverage" + JSON.stringify(scoreAverage));
				  res.render('index', { current_person: nextUserToVote[0], leaderboard_list: leaderboard ,  prevGivenScore: parseInt(req.params.voteValue) , prevAvgScore : scoreAverage });
				  console.log("next user to vote" + JSON.stringify(users));
				  hasUser = 1;
				}, function(err) {// when error
				  console.log("er2" + err);
		    });
		}
   });
});

router.get('/users', function(req, res, next) {
  console.log("get /users @@@@@@@@@@###")
  res.send('YESS! respond with a resource');
});

module.exports = router;
