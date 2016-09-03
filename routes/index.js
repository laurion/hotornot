var express = require('express');
var router = express.Router();
var functions = require('../functions.js');
var queries = require('../queries.js');
var Promise = require('bluebird');
var elo = require('elo-rank')(15);
var requestLib = Promise.promisify(require("request"));




router.post('/liked', function (req, res, next) {
  console.log("like render" + JSON.stringify(req.body.sessid));
  var likedIndex = req.body.likedIndex;
 
  var sessid = req.session.id;
  var postUrl = "http://52.31.174.126:8001/api/likePost";

  var data = {
        url: postUrl,
        method: 'POST',
        json: true,
        body: {sessid: sessid, cluster : "aftercuza", password:"4loc4", "likedIndex" : likedIndex}
  };
  
  requestLib(data);
 /* console.log("postUrl" + postUrl);
  return Promise.resolve(requestLib(data)).then(function(redis ){
    if(redis.body != null && redis.body != "failed") {
      console.log("redis like body" + JSON.stringify(redis.body));
      var array =  redis.body.posts;
     // res.data = { "posts" : array, userName : redis.body.userName};
     // res.redirect('/');
    } else {
     //  loadRootPage(req,res,next);
      console.log("redis like body failed");
   //   res.redirect('/');
    }
  });
 // loadRootPage(req,res,next);*/
});

router.post('/comment', function (req, res, next) {
  console.log("comment render" + JSON.stringify(req.body));
  var commentIndex = req.body.commentIndex;
  var comment = req.body.comment;
  var sessid = req.session.id;
  var postUrl = "http://52.31.174.126:8001/api/saveComment";
  console.log("postUrl" + postUrl);
  var data = {
    url: postUrl,
    method: 'POST',
    json: true,
    body: {sessid: sessid, cluster : "aftercuza", password:"4loc4", "commentIndex" : commentIndex, comment : comment}
  };

  requestLib(data);
  
 /* return Promise.resolve(requestLib(data)).then(function(redis ){
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
  loadRootPage(req,res,next);*/
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
        body: {sessid : sessid, cluster : "aftercuza", password : "4loc4"}
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
      body: {sessid: sessid, cluster : "aftercuza", password:"4loc4", "text" : text}
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

module.exports = router;
