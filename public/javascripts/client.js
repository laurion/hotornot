//event handlers
function isNumeric(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
}
$(document).ready(function(){
  var prevGivenScore = $("#prevGivenScore")[0].getAttribute("data");
  var prevAvgScore = $("#prevAvgScore")[0].getAttribute("data");
  if(isNumeric(prevGivenScore) && isNumeric(prevAvgScore)){
    var $toastContent = $('<span> Ai dat nota ' + prevGivenScore + '. Scor mediu: ' + prevAvgScore +'</span>');
    Materialize.toast($toastContent, 1000);
  }
  
//   $(".voting-button-li").on("click", function(event){ 
//     // Materialize.toast(message, displayLength, className, completeCallback);
// //     Materialize.toast("this.name", 4000) // 4000 is the duration of the toast
//     var given_score = event.target.name;
// //     console.log(document.current_person);
//     var final_score = 0;//(document.current_person.score * document.current_person.nrOfVotes + given_score)/(document.current_person.nrOfVotes + 1);//TODO
//     var $toastContent = $('<span> Ai dat nota ' + given_score + '. Scor mediu: ' + final_score +'</span>');
//     Materialize.toast($toastContent, 500);
//   });

  $(".leaderboard-item").on("click", function(event){
//     console.log(event.currentTarget);
    var currentCard = $(event.currentTarget);
    if(currentCard.hasClass("horizontal")){
      currentCard.removeClass("horizontal");
      var pic = currentCard.find(".smallCardPic");
      pic.removeClass("smallCardPic");
      pic.addClass("bigCardPic");
      currentCard.find(".extraContent").css("display","block");
    }
    else {
      var pic = currentCard.find(".bigCardPic");
      pic.removeClass("bigCardPic");
      pic.addClass("smallCardPic");
      currentCard.find(".extraContent").css("display","none");
      $(event.target.parentNode).addClass("horizontal");
    }
  });

});