var express = require('express');
var router = express.Router();
var functions = require('../functions.js');
var queries = require('../queries.js');
var Promise = require('bluebird');
var elo = require('elo-rank')(15);
var requestLib = Promise.promisify(require("request"));


router.post('/login', function(req, res) {//todo for 
	//console.log("req body" + JSON.stringify(req.body));
		var sessid = req.session.id;
	console.log("sessid" + sessid);
	var obj = new Parse.Object('liceenib');
   var query = new Parse.Query('liceenib');

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
  	   	  var newobj = new Parse.Object('liceenib');
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


router.get('/liked/:likedIndex', function (req, res, next) {
  console.log("like render" + JSON.stringify(req.params));
  var likedIndex = req.params.likedIndex;
 
  var sessid = req.session.id;
  var postUrl = "http://52.31.174.126:8001/api/likePost";
  

  var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {sessid: sessid, cluster : "afterBuzesti", password:"4loc4", "likedIndex" : likedIndex}
  };
  
  console.log("postUrl" + postUrl);
  return Promise.resolve(requestLib(data)).then(function(redis ){
    if(redis.body != null && redis.body != "failed") {
      console.log("redis like body" + JSON.stringify(redis.body));
      var array =  redis.body.posts;
      res.data = { "posts" : array, userName : redis.body.userName};
      res.redirect('/');
    } else {
       loadRootPage(req,res,next);
      console.log("redis like body failed");
      res.redirect('/');
    }
  });
  loadRootPage(req,res,next);
});

router.get('/comment/:commentIndex/:comment', function (req, res, next) {
  console.log("comment render" + JSON.stringify(req.params));
  var commentIndex = req.params.commentIndex;
  var comment = req.params.comment;
  var sessid = req.session.id;
  var postUrl = "http://52.31.174.126:8001/api/saveComment";
  console.log("postUrl" + postUrl);
  var data = {
    url: postUrl,
    method: 'POST',
    json: true,
    body: {sessid: sessid, cluster : "afterBuzesti", password:"4loc4", "commentIndex" : commentIndex, comment : comment}
  };
  
  return Promise.resolve(requestLib(data)).then(function(redis ){
    if(redis.body != null && redis.body != "failed") {
      console.log("redis comment body" + JSON.stringify(redis.body));
      var array =  redis.body.posts;
      res.data = { "posts" : array, userName : redis.body.userName};
      res.redirect('/');
    } else {
       loadRootPage(req,res,next);
      console.log("redis like body failed");
      res.redirect('/');
    }
  });
  loadRootPage(req,res,next);
});


/* GET home page. */
router.get('/', function (req, res, next) {
  if(res.data != null) {
    res.render('index', res.data);
  } else {
    loadRootPage(req,res,next);  
  }
});

function loadRootPage(req,res,next) {
   var postUrl = "http://52.31.174.126:8001/api/getPOSTS";
   var sessid = req.session.id;
    var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {sessid : sessid, cluster : "afterBuzesti", password : "4loc4"}
    };

   return Promise.resolve(requestLib(data)).then(function(redis ){
    if(redis.body != null && redis.body != "failed") {
      console.log("redis load body" + JSON.stringify(redis.body));
      var array =  redis.body.posts;
      array = array.reverse();
      res.render('index', { "posts" : array, userName : redis.body.userName});
    } else {
      loadRootPage(req,res,next);
      console.log("redis like body failed");
    }
  });
   /*res.render('index', { current_person: current_person, leaderboard_list: query.find() });*/
	console.log("xxx");//asa, nu pot sa vb.....BA
}

router.get('/voted/:fbId1/:fbId2/:scoreA/:scoreB/:selected', function(req, res, next) {
	//console.log("req id" + JSON.stringify(req.params));
	var sessid = req.session.id;
  var user1;
  var user2;
  var gender;
  //register vote to parse for last generated person for this user (only if exists)

  // var cardSelected = parseInt(req.params.selected);
   var nextUserToVote ;
   var scoreA = parseInt(req.params.scoreA);
   var scoreB = parseInt(req.params.scoreB);
   var selected = parseInt(req.params.selected);
   var scoreAverage = 0;
   var userfetched = queries.updateUserWithScoreForFaceMash(req.params.fbId1, req.params.fbId2, scoreA, scoreB, selected);
   var leaderboard = [];
   var skip = 0;
   var obj = new Parse.Object('liceenib');
   var query = new Parse.Query('liceenib');
   var cardOne,cardTwo;
    var postUrl = "http://52.31.174.126:8001/api/saveLastMacObjects";
     console.log("postUrl" + postUrl);
     var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {fbId: sessid, cluster : "afterBuzesti", password:"4loc4"}
    };
    return Promise.resolve(requestLib(data)).then(function(redis ){
		   // console.log("bucket" + JSON.stringify(redis));
    		if(redis.body != null) {

          var pair = [];
          var randomPair = (Math.floor(Math.random() * 13) );
          pair[0] = ["Ghica", "V.Alecsandri"];
          pair[1] = ["Ghica", "G.Antipa"];
          pair[2] = ["Ghica", "Ferdinand I"];
          pair[3] = ["Ghica", "Vranceanu"];
          pair[4] = ["Ghica", "Stefan Cel Mare"];
          pair[5] = ["Ferdinand I", "Vranceanu"];
          pair[6] = ["Ferdinand I", "Stefan Cel Mare"];
          pair[7] = ["Ferdinand I" , "V.Alecsandri"];
          pair[8] = ["Ferdinand I", "G.Antipa"];
          pair[9]  = ["G.Antipa", "Vranceanu"];
          pair[10]  = ["G.Antipa", "Stefan Cel Mare"];
          pair[11] = ["G.Antipa", "V.Alecsandri"];
          pair[12] = ["V.Alecsandri", "Vranceanu"];
          pair[13] = ["V.Alecsandri", "Stefan Cel Mare"];
///Vranceanu
    			gender = redis.body.gender;
          cardOne = pair[randomPair][0];
          cardTwo = pair[randomPair][1];
          console.log("cardone" + cardOne);
          console.log("cardTw0" + cardTwo);
          console.log("pair" +randomPair);
		  	  leaderboard = redis.body.leaderboard_list;
		  	  skip = parseInt(redis.body.bucket) * 10 + parseInt(redis.body.userIndex);
		  	  console.log("skip" + skip);

          var obj = new Parse.Object('liceenib');
  		    var queryUser = new Parse.Query('liceenib');
	  	  	queryUser.ascending('createdAt');
			    queryUser.limit(1);//so
			   	
          queryUser.equalTo('liceu',cardOne);
    			queryUser.skip(skip);//TODO modify
    			queryUser.find().then(function(users) {// query to fetch top scorers
    				  
              console.log("users fetch from query" + JSON.stringify(users));
              user1 = users[0];
              var queryUser2 = new Parse.Query('liceenib');
              queryUser2.ascending('createdAt');
              queryUser2.limit(1);//so
              queryUser2.skip(skip);//todo modify 

              queryUser2.equalTo('liceu', cardTwo);
              queryUser2.find().then(function(users) {
                user2 = users[0];
                console.log("users fetch from query2 " + JSON.stringify(users));
                nextUserToVote = users;
                var topfete  = leaderboard[0].leaderboard_list;
                var toplicee = leaderboard[1].highSchoolsLeaderBoard;
                console.log("top fete" + JSON.stringify(topfete));
                console.log("top licee" + JSON.stringify(toplicee));
                res.render('index', { posts: p, current_user_id: user1.fbId, current_person_1: user1, current_person_2: user2, leaderboard_list: topfete ,  prevGivenScore: 9 , prevAvgScore : scoreAverage, highSchoolsLeaderBoard : toplicee });
               });
    				}, function(err) {// when error
    				  console.log("er2" + err);
        });
    	} else {
          console.log("redis body null");
      }
    });
});


router.get('/posts/:text', function(req, res, next) {
  console.log("req id" + JSON.stringify(req.params));
  var sessid = req.session.id;
  var text =  req.params.text;
  var postUrl = "http://52.31.174.126:8001/api/savePost";
   console.log("postUrl" + postUrl);
   var data = {
      url: postUrl,
      method: 'POST',
      json: true,
      body: {sessid: sessid, cluster : "afterBuzesti", password:"4loc4", "text" : text}
  };
  return Promise.resolve(requestLib(data)).then(function(redis ){
      console.log("bucket" + JSON.stringify(redis));
      if(redis.body != null) {
        console.log("redis body" + JSON.stringify(redis));
        var array =  redis.body.posts;
        res.data = { "posts" : array, userName : redis.body.userName};
        res.redirect('/');
      } else {
        res.render('index', { "ana" : 3, posts: [{"index" : 0, "nrOfLikes" : 0, "text" : "A4"},{"index" : 0, "nrOfLikes" : 0, "text" : "A3"}]});
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
        body: {sessionId: sessid, cluster : "afterBuzesti", password:"4loc4", gender: req.body.interested_in}
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
