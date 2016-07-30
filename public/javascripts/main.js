//event handlers
var Parse = require('parse').Parse;

$(document).ready(function(){
  $(".voting-button-li").on("click", function(event){ 
    // Materialize.toast(message, displayLength, className, completeCallback);
//     Materialize.toast("this.name", 4000) // 4000 is the duration of the toast
    console.log("click vote");
Parse.initialize("utXysazDczvny5sBUme5HZIzfUrybjppWIc8aVGb", "kxPSoHg7ziVYonOCWfjVx3v6EHGFN6n4NYzxU5Ed");
   var obj = new Parse.Object('Oameni');
   var query = new Parse.Query('Oameni');
   query.ascending('score');
   query.limit(limit);

   query.find().then(function(users) {
      console.log(JSON.stringify(users));
      return Parse.Promise.as(users);
    }, function(err) {
      return Parse.Promise.error(err);
      console.log(err); 
    });
   // var  votingsStatus = (__dirname +'/functions.js').vote(10, 100000272888167);
    var given_score = event.target.name;
    var final_score = 0;//TODO
    var $toastContent = $('<span> Ai dat nota ' + given_score + '. Scor mediu: ' + final_score +'</span>');
    Materialize.toast($toastContent, 500);
  });

  $("#voting_card").on("click", function(){
    console.log("clicked card #$#@!@#@!$")

//     Materialize.toast("##$", 500);
  });

});
