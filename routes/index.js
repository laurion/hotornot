var express = require('express');
var router = express.Router();
var functions = require('../functions.js');
var queries = require('../queries.js');
var Promise = require('bluebird');
var elo = require('elo-rank')(15);
var requestLib = Promise.promisify(require("request"));


router.post('/login', function(req, res) {//todo for 
	console.log("req body" + JSON.stringify(req.body));
		var sessid = req.session.id;
	console.log("sessid" + sessid);
	var obj = new Parse.Object('moisil');
   var query = new Parse.Query('moisil');

   var gender = req.body.gender;
   query.contains('name', req.body.name);
   if(gender == "male") {
      res.end("Doar fetele isi pot afla nota. Te invitam sa le votezi!");
   } else {
   query.first().then(function(objAgain) {
      console.log("user found" + JSON.stringify(objAgain));
      if(objAgain != null){
    	  var score = objAgain.get('score');
      	  res.end(JSON.stringify(score));
  	   } else {
  	   	  var newobj = new Parse.Object('moisil');
  	   	  var randomScore = (Math.floor(Math.random() * 4) )+ 3;
          var randomNrOfVotes = (Math.floor(Math.random() * 2)) + 1;
  	   	  newobj.set('score', randomScore);
  	   	  newobj.set('fbId', parseInt(req.body.id));
  	   	  newobj.set('nrOfVotes', randomNrOfVotes);
  	   	  newobj.set('name', req.body.name);
  	   	  newobj.save().then(function(obj) {
          console.log("save new user" + JSON.stringify(obj));
          res.end(JSON.stringify(randomScore));
        }, function(err) {
          res.end("5");
       });;
  	   }
    }, function(err) {
       console.log("error"+ JSON.stringify(err)); 
       res.end("5");
      console.log(err); 
    });
 }
});
router.get('/profile/:current_user_id', function(req, res, next) {//todo for 
	console.log("bb");
	//var currentUserId = req.params.current_user_id;
	//console.log("current_user_id" + JSON.stringify(req.params));
	loadRootPage(req, res,next);
});

/* GET home page. */
router.get('/', function (req, res, next) {
	loadRootPage(req,res,next);
});

function loadRootPage(req,res,next) {

   var postUrl = "http://52.31.174.126:8001/api/saveLastLocation";
     console.log("postUrl" + postUrl);
     
   var currentUser;
   var obj = new Parse.Object('moisil');
   var query = new Parse.Query('moisil');
   var queryCurrentUser = new Parse.Query('moisil');
   queryCurrentUser.equalTo('fbId', parseInt(req.params.current_user_id));
   queryCurrentUser.limit(1);
   var xx = queryCurrentUser.find().then(function(user) {
   	currentUser = user;
   		return Promise.resolve(user);
   });
 
   query.descending('score');
   query.equalTo('gender', 'female');
   query.limit(10);//so 
   query.find().then(function(users) {// query to fetch top scorers
	  console.log("load data at refresh" + JSON.stringify(users.length));
	  var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {leaderboard_list: users, cluster : "moisil", password:"4loc4"}
     };

      requestLib(data);
       var randomFirstCard = (Math.floor(Math.random() * 10) );
       console.log("reqqqqqq" + req.params.current_user_id);
       if(req.params.current_user_id == null || currentUser == null){
       	 currentUser = users[randomFirstCard];
       	 	console.log("currentUser1 " + JSON.stringify(currentUser));
       } else {
       	currentUser = currentUser[0];
       	console.log("currentUser2 " + JSON.stringify(currentUser));
       }
	  res.render('index', { current_user_id: currentUser.fbId, current_person: currentUser, leaderboard_list: users });
	}, function(err) {// when error
	  console.log("err3" + JSON.stringify(err));
	  res.render('index', { error: "undefined"}); 
	});

   /*res.render('index', { current_person: current_person, leaderboard_list: query.find() });*/
	console.log("xxx");//asa, nu pot sa vb.....BA
}

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
	console.log("req id" + JSON.stringify(req.session.id));
	var sessid = req.session.id;
  var user1;
  var user2;
  var gender;
  //register vote to parse for last generated person for this user (only if exists)

  // var cardSelected = parseInt(req.params.selected);
  var nextUserToVote ;
   var scoreA = 1200;
   var scoreB = 1400;
   var scoreAverage = 0;
   var userfetched = queries.updateUserWithScoreForFaceMash(req.params.fbId, "100001708273358", scoreA, scoreB, 0);
   var leaderboard = [];
   var skip = 0;
   var obj = new Parse.Object('moisil');
   var query = new Parse.Query('moisil');

    var postUrl = "http://52.31.174.126:8001/api/saveVote";
     console.log("postUrl" + postUrl);
     var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {fbId: sessid, cluster : "moisil", password:"4loc4"}
    };
    return Promise.resolve(requestLib(data)).then(function(redis ){
		    console.log("bucket" + JSON.stringify(redis));
    		if(redis.body != null) {
    			gender = redis.body.gender;
		  	  leaderboard = redis.body.leaderboard_list;
		  	  skip = parseInt(redis.body.bucket) * 10 + parseInt(redis.body.userIndex);
		  	  
          var obj = new Parse.Object('moisil');
  		    var queryUser = new Parse.Query('moisil');
	  	  	queryUser.ascending('createdAt');
			    queryUser.limit(1);//so
			   	queryUser.equalTo('gender', 'female');
    			queryUser.skip(10);//TODO modify
    			queryUser.find().then(function(users) {// query to fetch top scorers
    				  
              console.log("users fetch from query" + JSON.stringify(users));
              user1 = users[0];
              var queryUser2 = new Parse.Query('moisil');
              queryUser2.ascending('createdAt');
              queryUser2.limit(1);//so
              queryUser2.skip(11);//todo modify
              queryUser2.equalTo('gender', 'female');
              queryUser2.find().then(function(users) {
                user2 = users[0];
                console.log("users fetch from query2 " + JSON.stringify(users));
                nextUserToVote = users;
                res.render('index', { current_user_id: nextUserToVote[0].fbId, current_person: nextUserToVote[0], leaderboard_list: leaderboard ,  prevGivenScore: parseInt(req.params.voteValue) , prevAvgScore : scoreAverage });
               });
    				}, function(err) {// when error
    				  console.log("er2" + err);
        });
    	} else {
          console.log("redis body null");
      }
    });
});

router.post("/interested_in", function(req, res){
	console.log("POSTed interested_in");
	console.log(req.body);
	var sessid = req.session.id;
	 var postUrl = "http://52.31.174.126:8001/api/identifyUserByGender";
     console.log("postUrl" + postUrl);
     var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {sessionId: sessid, cluster : "moisil", password:"4loc4", gender: req.body.interested_in}
     };
   requestLib(data);
	if(req.body.interested_in == "male") 
		loadRootPage(req,res);//I want to refresh page - go to next card; not sure this works
	else
		res.send("interested_in :: go on, success");//TODO
});

router.get('/users', function(req, res, next) {
  console.log("get /users @@@@@@@@@@###")
  res.send('YESS! respond with a resource');
});

module.exports = router;
