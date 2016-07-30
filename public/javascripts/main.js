//event handlers
var Parse = require('parse').Parse;

$(document).ready(function(){
  $(".voting-button-li").on("click", function(event){ 
    // Materialize.toast(message, displayLength, className, completeCallback);
//     Materialize.toast("this.name", 4000) // 4000 is the duration of the toast
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
