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

/* GET home page. */
router.get('/', function (req, res, next) {
	loadRootPage(req,res,next);
});

function loadRootPage(req,res,next) {
   var currentUser_1;
   var currentUser_2;
   var postUrl = "http://52.31.174.126:8001/api/saveLastLocation";
     console.log("postUrl" + postUrl);
     
   var currentUser;
   var obj = new Parse.Object('liceenib');
   var query = new Parse.Query('liceenib');
   var queryCurrentUser = new Parse.Query('liceenib');
   queryCurrentUser.equalTo('fbId', parseInt(req.params.current_user_id));
   queryCurrentUser.limit(1);
   var xx = queryCurrentUser.find().then(function(user) {
   	currentUser = user;
   		return Promise.resolve(user);
   });
 
   query.descending('score');
   query.equalTo('gender', 'female');
   query.limit(40);//so 
   query.find().then(function(users) {// query to fetch top scorers
	  console.log("load data at refresh" + JSON.stringify(users));
    console.log("help2");
    var licee =[];
    licee[0] = []; licee[1] = [];licee[2] = [];licee[3] = [];licee[4] = [];licee[5] = [];
    licee[0] = "Ghica"; licee[1] = "V.Alecsandri"; licee[2] = "G.Antipa"; licee[3] = "Ferdinand I";
    licee[4] = "Vranceanu"; licee[5] = "Stefan Cel Mare";licee[6] = "M.Eminescu";licee[7] = "Karpen";
    licee[8] = "Sf.Iosif"; licee[9] = "Henri Coanda";
    console.log("heeeeelp");
    var scoreHash = [];
    var highSchoolsLeaderBoard = [];
    var Vranceanu; var rating = [];
    var idx = [];
    for(var i = 0; i< users.length && i < 10 ; i++){
      rating[i] = [];rating[i] = 0;
      scoreHash[i] = [];
      scoreHash[i] = 0;
    idx[i] = [];
    idx[i]=i;}
    for(var i = 0; i < users.length && i < 10; i++){
        //calculate score
     //   console.log("users licee"  + users[i].get("liceu"));
        var liceu = users[i].get("liceu");
        if(liceu == "Ghica"){
          scoreHash[0] += 1000;
          console.log("A");
        } else if(liceu == "V.Alecsandri"){
         
          scoreHash[1] += 1000;
           console.log("B");
        } else if(liceu == "G.Antipa"){
          scoreHash[2] += 1000;
           console.log("C");
        } else if(liceu == "Ferdinand I"){
          scoreHash[3] += 1000;
           console.log("D");
        } else if(liceu == "Vranceanu"){
          scoreHash[4] += 1000;
           console.log("E");
        } else if(liceu == "Stefan Cel Mare"){
          scoreHash[5] += 1000;
           console.log("F");
        } else {
          console.log("ELSEE");
        }
      }
       console.log("score before" + JSON.stringify(scoreHash));
   for(var i = 0; i< users.length && i < 10; i++){
    idx[i] = [];
    idx[i]=i;}
    for(var i = 0; i< 9 ; i++){
       for(var j = i + 1; j < 10 ; j++){
        var scoreAux;
          if(scoreHash[i] <= scoreHash[j]){
            aux = scoreHash[j];scoreHash[j] =scoreHash[i];
            scoreHash[i]= aux;
            aux = idx[j]; idx[j]= idx[i];idx[i]=aux;
          } 
       }
    }
    console.log("score after" + JSON.stringify(scoreHash));
    console.log("liceee" + JSON.stringify(licee));
    console.log("idx" + JSON.stringify(idx));
   
    rating[0] = 100000;rating[1] = 75000;rating[2] = 60000;rating[3] = 55000;rating[4] = 50000;
    rating[5] = 40000;rating[6] = 30000;rating[7] = 20000;rating[8] = 15000;rating[9] = 10000;
    for(var i=0 ; i < 10; i++){
        highSchoolsLeaderBoard[i] = [];
        highSchoolsLeaderBoard[i] =  { liceu:licee[idx[i]] , score :( scoreHash[i] + rating[i])};
    }
    console.log("highSchoolsLeaderBoard  " + JSON.stringify(highSchoolsLeaderBoard));
    //sort
	  var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {leaderboard_list: [{ leaderboard_list : users }, {highSchoolsLeaderBoard : highSchoolsLeaderBoard}] , cluster : "liceenib", password : "4loc4"}
    };
  

      requestLib(data);
      var randomFirstCard = parseInt(Math.floor(Math.random() * 8) );
       console.log("reqqqqqq" + req.params.current_user_id);
       if(req.params.current_user_id == null || currentUser == null){
         currentUser_1 = users[randomFirstCard];
         currentUser_2 = users[randomFirstCard+1];
       	 	console.log("currentUser1 " + JSON.stringify(currentUser_1));
       } else {
       	currentUser_1 = users[8];
        currentUser_2 = users[9];
       	console.log("currentUser2 " + JSON.stringify(currentUser_2));
       }
     

	  res.render('index', { current_user_id: currentUser_2.fbId, current_person_2: currentUser_2, current_person_1: currentUser_1, leaderboard_list: users, highSchoolsLeaderBoard : highSchoolsLeaderBoard });
	}, function(err) {// when error
	  console.log("err3" + JSON.stringify(err));
	  res.render('index', { error: "undefined"}); 
	});

   /*res.render('index', { current_person: current_person, leaderboard_list: query.find() });*/
	console.log("xxx");//asa, nu pot sa vb.....BA
}

router.get('/voted/:fbId1/:fbId2/:scoreA/:scoreB/:selected', function(req, res, next) {
	console.log("req id" + JSON.stringify(req.params));
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
        body: {fbId: sessid, cluster : "liceenib", password:"4loc4"}
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
                res.render('index', { current_user_id: user1.fbId, current_person_1: user1, current_person_2: user2, leaderboard_list: topfete ,  prevGivenScore: 9 , prevAvgScore : scoreAverage, highSchoolsLeaderBoard : toplicee });
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
        body: {sessionId: sessid, cluster : "liceenib", password:"4loc4", gender: req.body.interested_in}
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
