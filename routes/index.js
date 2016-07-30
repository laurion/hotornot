var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var current_person = {
    "name":"Bogdan",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };
  var leaderboard_list = [1,2,3,4,5,6,7,8,9,10];
  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
});

router.get('/voted/:voteValue', function(req, res, next) {
  console.log("#$#$#@@#@")
  var current_person = {
    "name":"BogdanNext1",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };
  var leaderboard_list = [1,2,3,4,5,6,7,8,9,10];
  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
});

router.get('/users', function(req, res, next) {
  console.log("get /users @@@@@@@@@@###")
  res.send('YESS! respond with a resource');
});

module.exports = router;
