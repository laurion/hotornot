
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
   query.equalTo('fbId', fbId);
   query.first().then(function(objAgain) {
      console.log(JSON.stringify(objAgain));
      objAgain.set('score', score);
      objAgain.save().then(function(obj) {
          console.log("updated" + JSON.stringify(obj));
          return Parse.Promise.as(obj);
        }, function(err) {
          return Parse.Promise.error(err);
         console.log(err); 
       });
    }, function(err) {
      return Parse.Promise.error(err);
      console.log(err); 
    });
}

exports.getUsersOrderedByScore = function(limit) {
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.ascending('score');
   query.limit(limit);

   query.find().then(function(users) {
      console.log(JSON.stringify(users));
      return Parse.Promise.as(users);
    }, function(err) {
      console.log("err" + err);
      return Parse.Promise.error(err);
      console.log(err); 
    });
}

