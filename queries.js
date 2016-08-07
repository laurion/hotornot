
var Promise = require('bluebird');

exports.updateUserWithScore = function(fbId, score) {
   var obj = new Parse.Object('Racovita');
   var query = new Parse.Query('Racovita');
   query.equalTo('fbId', parseInt(fbId));
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

exports.getUsersOrderedByScore = function(limit) {
   var obj = new Parse.Object('Racovita');
   var query = new Parse.Query('Racovita');
   query.ascending('score');
   query.limit(limit);

   var users = query.find();

  return Promise.resolve(users);
}

