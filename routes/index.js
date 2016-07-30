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
  var leaderboard_list = [];
  for(var i = 0; i < 10; i ++)
    leaderboard_list.push(current_person);
  console.log(leaderboard_list)
  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
});

router.get('/voted/:voteValue', function(req, res, next) {
  //register vote to parse for last generated person for this user (only if exists)
  console.log("#$#$#@@#@")
  var current_person = {
    "name":"BogdanNext1",
    "fbId": 100001008058747,
    "score":10,
    "nrOfVotes":1
  };
  var leaderboard_list = [];
  for(var i = 0; i < 10; i ++)
    leaderboard_list.push(current_person);
  console.log(leaderboard_list)
  res.render('index', { current_person: current_person, leaderboard_list: leaderboard_list });
});

router.get('/users', function(req, res, next) {
  console.log("get /users @@@@@@@@@@###")
  res.send('YESS! respond with a resource');
});

module.exports = router;
