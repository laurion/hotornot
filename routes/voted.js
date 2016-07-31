var express = require('express');
var router = express.Router();

router.post('/:voteValue', function(req, res, next) {
  console.log("#$#$#@@#@" + JSON.stringify(req.body));
  var current_person = {
    "name":"Bogdan22222",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };
  var leaderboard_list = [1,2,3,4,5,6,7,8,9,10];
  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
});

module.exports = router;
