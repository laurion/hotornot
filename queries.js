
var Promise = require('bluebird');
var elo = require('elo-rank')(15);
exports.updateUserWithScore = function(fbId, score) {
   var obj = new Parse.Object('antipa');
   var query = new Parse.Query('antipa');
   query.equalTo('fbId', parseInt(fbId));
   query.equalTo('gender', 'female');
   var promise = query.first().then(function(objAgain) {
      console.log("user found" + JSON.stringify(objAgain));
      var nrVotes = parseInt(objAgain.get('nrOfVotes'));
      var oldScore = parseFloat(objAgain.get('score'));
      var newScore = parseFloat((score + oldScore*nrVotes)/(nrVotes + 1));
      newScore = parseFloat((parseInt(newScore * 100))/100);
      console.log("oldScore" + oldScore);
      console.log("new score" + newScore);
      objAgain.set('score', newScore);
      objAgain.set('nrOfVotes', nrVotes + 1);
      objAgain.save().then(function(obj) {
          console.log("updated" + JSON.stringify(obj));
          return Promise.resolve(obj.get('score'));
        }, function(err) {
          return Promise.resolve("5");
         console.log(JSON.stringify(err)); 
       });
    }, function(err) {
       console.log(JSON.stringify(err)); 
      return Promise.resolve("5");
      console.log(err); 
    });
   return promise;
}

exports.updateUserWithScoreForFaceMash = function(fbId1, fbId2, scoreA, scoreB, selected) {
  console.log("updateeeee");
   var obj = new Parse.Object('antipa');
   var query = new Parse.Query('antipa');
   console.log("fbId1 " + parseInt(fbId1));
   query.equalTo('fbId', parseInt(fbId1));
   query.equalTo('gender', 'female');
  
  if(scoreA < 150)
    scoreA = 150;
  
  if(scoreB < 150)
    scoreB =  150;
  var playerA = scoreA;
  var playerB = scoreB;
  console.log("scoreA" + playerA);
  console.log("scoreB" + playerB);
  //Gets expected score for first parameter 
  var expectedScoreA = elo.getExpected(playerA, playerB);
  var expectedScoreB = elo.getExpected(playerB, playerA);
   
  //update score, 1 if won 0 if lost 
  if(selected == 0){
    playerA = elo.updateRating(expectedScoreA, 1, playerA);
    playerB = elo.updateRating(expectedScoreB, 0, playerB);
  } else {
    playerA = elo.updateRating(expectedScoreA, 0, playerA);
    playerB = elo.updateRating(expectedScoreB, 1, playerB);
  }

  var newscoreA = playerA;
  var newscoreB = playerB;
 
  console.log("newscoreA" + newscoreA);
  console.log("newscoreB" + newscoreB);
  var promise = query.first().then(function(user1) {
      console.log("u1" + JSON.stringify(user1));
      user1.set('score', newscoreA);
      user1.save().then(function(obj) {
          console.log("savee" + JSON.stringify(obj));
          var query2 = new Parse.Query('alecsandri');
          query2.equalTo('fbId', parseInt(fbId2));
          query2.equalTo('gender', 'female');
          query2.first().then(function(user2){
            console.log("u2" + JSON.stringify(user2));
            user2.set('score', newscoreB);
            user2.save();
            return Promise.resolve(user2.get('score'));
          }, function(err) {
              return Promise.resolve("5");
             console.log(JSON.stringify(err)); 
          });

        }, function(err) {
          return Promise.resolve("5");
         console.log(JSON.stringify(err)); 
       });
    }, function(err) {
       console.log(JSON.stringify(err)); 
      return Promise.resolve("5");
      console.log(err); 
    });

   return promise;
}

exports.getUsersOrderedByScore = function(limit) {
 var obj = new Parse.Object('antipa');
 var query = new Parse.Query('antipa');
 query.ascending('score');
 query.equalTo('gender', 'female');
 query.limit(limit);
 var users = query.find();

  return Promise.resolve(users);
}

