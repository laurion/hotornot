
var queries = require(__dirname + '/queries.js');

exports.vote = function(score, fbId) {
  console.log("enter vote");
  queries.updateUserWithScore(fbId, score);
  //TODO
  //create vote relation
}
