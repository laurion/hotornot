var express = require('express');
var router = express.Router();
var functions = require('../functions.js');
var queries = require('../queries.js');
var Promise = require('bluebird');
var requestLib = Promise.promisify(require("request"));


router.post('/login', function(req, res) {//todo for 
	console.log("req body" + JSON.stringify(req.body));
		var sessid = req.session.id;
	console.log("sessid" + sessid);
	var obj = new Parse.Object('UntoldPeople');
   var query = new Parse.Query('UntoldPeople');

   
   query.contains('name', req.body.name);
   query.first().then(function(objAgain) {
      console.log("user found" + JSON.stringify(objAgain));
      if(objAgain != null){
    	  var score = objAgain.get('score');
      	  res.end(JSON.stringify(score));
  	   } else {
  	   	  var newobj = new Parse.Object('UntoldPeople');
  	   	  var randomScore = (Math.floor(Math.random() * 2) )+ 3;
          var randomNrOfVotes = (Math.floor(Math.random() * 50)) + 1;
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
});
router.get('/profile/:current_user_id', function(req, res, next) {//todo for 
	console.log("bb");
	var currentUserId = req.params.current_user_id;
	console.log("current_user_id" + JSON.stringify(req.params));
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
   var obj = new Parse.Object('UntoldPeople');
   var query = new Parse.Query('UntoldPeople');
   var queryCurrentUser = new Parse.Query('UntoldPeople');
   queryCurrentUser.equalTo('fbId', parseInt(req.params.current_user_id));
   queryCurrentUser.limit(1);
   var xx = queryCurrentUser.find().then(function(user) {
   	currentUser = user;
   		return Promise.resolve(user);
   });
 
   query.descending('score');
   query.limit(10);//so 
   query.find().then(function(users) {// query to fetch top scorers
	  console.log("load data at refresh" + JSON.stringify(users));
	  var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {leaderboard_list: users, cluster : "untold", password:"4loc4"}
     };

      requestLib(data);
       var randomFirstCard = (Math.floor(Math.random() * 9) );
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

	//var cookie = req.cookies.espress:sessid;
	//console.log('Cookies: ', cookie);

	console.log("req id" + JSON.stringify(req.session.id));
	var sessid = req.session.id;

 var gender ;
  //register vote to parse for last generated person for this user (only if exists)
   var vote = parseInt(req.params.voteValue);
   var nrOfVotes = parseInt(req.params.nrOfVotes);
   var lastScore = parseFloat(req.params.score);
   var scoreAverage = parseFloat((vote + lastScore*nrOfVotes)/(nrOfVotes + 1));;
   
   scoreAverage = parseFloat((parseInt(scoreAverage * 100))/100);
  
   var userFetched = queries.updateUserWithScore(req.params.fbId, parseInt(req.params.voteValue));/// score,fbId
   var leaderboard = [];
   var skip = 0;
   var obj = new Parse.Object('UntoldPeople');
   var query = new Parse.Query('UntoldPeople');
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
        body: {fbId: sessid, cluster : "untold", password:"4loc4"}
     };
    return Promise.resolve(requestLib(data)).then(function(redis ){
		console.log("bucket" + JSON.stringify(redis));
		
		if(redis.body != null) {
			gender = redis.body.gender;
			if(gender == null){
				console.log("gender null");
				gender = "female";
			}
		  	 //skip = redis.body.;
		  	 leaderboard = redis.body.leaderboard_list;
		  	 skip = parseInt(redis.body.bucket) * 10 + parseInt(redis.body.userIndex);
		  	 var obj = new Parse.Object('UntoldPeople');
  		     var queryUser = new Parse.Query('UntoldPeople');
	  		 queryUser.ascending('createdAt');
			   queryUser.limit(1);//so
			   if(gender != "both"){
			   	 	console.log("AAAAAAAAAAAAAA");
			   		queryUser.equalTo('gender', gender);
			   }
			   queryUser.skip(skip);
			   queryUser.find().then(function(users) {// query to fetch top scorers
				  console.log("users fetch from query" + JSON.stringify(users));
				  nextUserToVote = users;
			//	  console.log("leaderBoard" + JSON.stringify(leaderboard));
			//	  console.log("score scoreAverage" + JSON.stringify(scoreAverage));
				  res.render('index', { current_user_id: 4, current_person: nextUserToVote[0], leaderboard_list: leaderboard ,  prevGivenScore: parseInt(req.params.voteValue) , prevAvgScore : scoreAverage });
			//	  console.log("next user to vote" + JSON.stringify(users));
				  hasUser = 1;
				}, function(err) {// when error
				  console.log("er2" + err);
		    });
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
        body: {sessionId: sessid, cluster : "untold", password:"4loc4", gender: req.body.interested_in}
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
