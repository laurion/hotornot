
var Promise = require('bluebird');
exports.fetchUserById = function (userId) {
  var User = Parse.Object.extend('Ga');
  var userQuery = new Parse.Query('Alien');
  userQuery.equalTo('name', 'Ana');
  console.log("fetch user" + JSON.stringify(userQuery)); 

  userQuery.first().then(function(results) {
    console.log("bau bau: users found: " + JSON.stringify(results));
     
    return results;
  }, function(error) {
    console.log("bau bau:loadWUsersByIds failed: " + JSON.stringify(error));
  });

}

exports.updateUserWithScore = function(fbId, score) {
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.equalTo('fbId', parseInt(fbId));
   var promise = query.first().then(function(objAgain) {
      console.log("user found" + JSON.stringify(objAgain));
      var nrVotes = parseInt(objAgain.get('nrOfVotes'));
      var oldScore = parseInt(objAgain.get('score'));
      var newScore = parseInt((score + oldScore*nrVotes)/(nrVotes + 1));
      console.log("new score" + newScore);
      objAgain.set('score', newScore);
      objAgain.set('nrOfVotes', nrVotes + 1);
      objAgain.save().then(function(obj) {
          console.log("updated" + JSON.stringify(obj));
          return Promise.resolve(obj);
        }, function(err) {
          return Promise.error(err);
         console.log(JSON.stringify(err)); 
       });
    }, function(err) {
       console.log(JSON.stringify(err)); 
      return Promise.error(err);
      console.log(err); 
    });

   return promise;
}

exports.getUsersOrderedByScore = function(limit) {
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.ascending('score');
   query.limit(limit);

   var users = query.find();

   return Promise.resolve(users);
}

