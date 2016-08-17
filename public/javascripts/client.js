ENV = "test";//comment this in production

var appId = '154672038273096';
//if(ENV == "test")
  //appId = "155244454882521";

var current_person; //the current person we are shown to vote
//appId =  156499721423661;//sincai
//appId =1131740773541327; //tiberiu popoviciu
//appId = '156819451391688';//avram
appId = '156955914711375'; //moisil
 //event handlers
function isNumeric(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var current_user = {
  id: ""
}

function inviteFb(){
  FB.ui({
   method: 'send',
   link: "http://moisil.catdehot.com"
  },function(response) {
   if (response) {
    alert('Successfully Invited');
   } else {
    alert('Failed To Invite');
   }
  });
}
function hide_my_fb(){
  var r = confirm("Are you sure you want to hide your facebook profile from other users? They won't be able to see your facebook when looking at your profile");
  if (r == true) {
      $.post( "/hide_my_fb", { fbdata: current_user.id })
        .done(function( data ) {
          //
          console.log("hide_my_fb response:");
          console.log(data);
        });
  } else {
      //nothing
  }
}
function delete_my_account(){
  var r = confirm("Are you sure you want to delete your account? Nobody will be able to see your profile or vote it.");
  if (r == true) {
      $.post( "/delete_my_account", { fbdata: current_user.id })
        .done(function( data ) {
          fbLogOut();
          console.log("delete_my_account response:");
          console.log(data);
        });
  } else {
    //
  }
}

function report_profile(fbId){
  var r = confirm("Are you sure you want to report this person?");
  if (r == true) {
      $.post( "/report", { fbId: fbId })
        .done(function( data ) {
          console.log("report_profile response:");
          console.log(data);
          location.reload();
        });
  } else {
    //
  }
}

function facemash_vote(data){
  var fbId1 = data[0];
  var fbId2 = data[1];
  var url = "/voted/" + JSON.stringify(data[0]) +"/" + JSON.stringify(data[1]) + "/" + JSON.stringify(data[2]) + "/" + JSON.stringify(data[3]) + "/" + JSON.stringify(data[4]);
  window.location = url;
 // $.get(url,  {});
  console.log("fbID1" + JSON.stringify(fbId1));
  console.log("fbId2" + JSON.stringify(fbId2));
 
}

// ---- init fb things: ----

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
console.log('statusChangeCallback');
console.log(response);

// The response object is returned with a status field that lets the
// app know the current login status of the person.
// Full docs on the response object can be found in the documentation
// for FB.getLoginStatus().
if (response.status === 'connected') {
  // Logged into your app and Facebook.
  //testAPI();

  current_user.id = response.authResponse.userID;
  
  console.log("Logged in successfully!");
  FB.api('/me?fields=name,gender,age_range', function(responseGraph) {
    console.log("fb.api responseGraph");
    console.log(responseGraph);
    current_user.id = responseGraph.id;
    current_user.name = responseGraph.name;
    current_user.gender = responseGraph.gender;
    current_user.age_range = responseGraph.age_range;
    console.log("current user" + JSON.stringify(current_user));

       $.post( "/login", { "id": responseGraph.id, "name": responseGraph.name, "gender": responseGraph.gender, "age_range": responseGraph.age_range })
      .done(function( data ) {
        $("#current_user_score")[0].innerHTML = data ;//TODO

        $(".display-when-logged-in").css("display","block");
        $(".display-when-logged-out").css("display","none");
        
        var pictureUrl = "https://graph.facebook.com/" + response.authResponse.userID + "/picture?width=350&height=350";
        $("#current_user_img").attr("src", pictureUrl);

//         var profileUrl = "http://untold.catdehot.com/profile/"+ response.authResponse.userID;
//         var $sendButtonDiv = $("<div>", {"data-href": profileUrl, "data-size":"large"});
//         $("#send_my_profile").append($sendButtonDiv);
        //#("#current_user_name")[0].innerHTML = "";
      });
  });
  $(".display-when-logged-in").css("display", "block");
  $(".display-when-logged-out").css("display", "none");
  //TODO: POST on server the response, token, etc
 
} else if (response.status === 'not_authorized') {
  // The person is logged into Facebook, but not your app.
  document.getElementById('status').innerHTML = 'Please log ' +
    'into this app.';
  $(".display-when-logged-in").css("display","none");
  $(".display-when-logged-out").css("display", "block");
} else {
  // The person is not logged into Facebook, so we're not sure if
  // they are logged into this app or not.
  document.getElementById('status').innerHTML = 'Please log ' +
    'into Facebook.';
  $(".display-when-logged-in").css("display","none");
  $(".display-when-logged-out").css("display", "block");
}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
console.log("checkLoginState()")
FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});
}

function fbLogIn() {
FB.login(function(response) {
  console.log("login response: #@#@#@####")
  console.log(response);
  checkLoginState();
});
}

function fbLogOut() {
console.log("Log out button clicked");
FB.logout(function(response) {
  // user is now logged out
  console.log(response);
  checkLoginState();
  $(".display-when-logged-in").css("display", "none");
  $(".display-when-logged-out").css("display", "block");
});
}

window.fbAsyncInit = function() {
FB.init({
appId      : appId,
cookie     : true,  // enable cookies to allow the server to access 
                    // the session
xfbml      : true,  // parse social plugins on this page
version    : 'v2.5' // use graph api version 2.5
});

// Now that we've initialized the JavaScript SDK, we call 
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/*
// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
console.log('Welcome!  Fetching your information.... ');
FB.api('/me', function(response) {
  console.log('Successful login for: ' + response.name);
  document.getElementById('status').innerHTML =
    'Thanks for logging in, ' + response.name + '!';
});
}
*/
$(document).ready(function(){

  //gender chooser
//   localStorage["nrOfSessions"] = localStorage["nrOfSessions"] + 1 || 0;
//   if(parseInt(localStorage["nrOfSessions"]) == 2){
//     $("#genderModal").openModal();
//   }
//   else{
// //     $("ul.tabs").children()[0].childNodes[0].className = "";
//     $("ul.tabs").children()[1].childNodes[0].click();
// //     $("ul.tabs").children().first().removeClass(".active");
// //     $("ul.tabs").children().first().removeClass(".active");
//   }
  if(localStorage["notNewSession"]){
    $("#voting_tab_link").click();
  }
  else {
    localStorage["notNewSession"] = true;
  }
  

  $("#genderForm>p>input").on("click", function(event){
    current_user.interested_in = event.target.getAttribute("data");
    console.log("current_user genderInt" + current_user.interested_in);
    $("#genderModal").closeModal();
    localStorage["chosenGender"] = current_user.interested_in;
    $.post( "/interested_in", { interested_in: current_user.interested_in })
      .done(function( data ) {
        //
        console.log("chosenGender POST response:");
      //  console.log(data);
      });
  })
  
//   initFacebookThings();

  current_person = {
    id: $(".fb-add-button",$("div#voting_tab"))[0].href.replace(/.*facebook\.com\//g,"")
  };

  var prevGivenScore = $("#prevGivenScore")[0].getAttribute("data");
  var prevAvgScore = $("#prevAvgScore")[0].getAttribute("data");
  if(isNumeric(prevGivenScore) && isNumeric(prevAvgScore)){
    var $toastContent = $('<span> Ai dat nota ' + prevGivenScore + '. Scor mediu: ' + prevAvgScore +'</span>');
    Materialize.toast($toastContent, 1500);
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

  $(".voting-button").on("click", function(event){
    console.log("voted: " + event.target.name)
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Actions',
      eventAction: 'vote',
      eventLabel: event.target.name
    });
  });
  $(".voting-button").on("click", function(event){
    console.log("voted: " + event.target.name)
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Actions',
      eventAction: 'vote',
      eventLabel: current_user.fbId,
      eventValue: event.target.name
    });
  });
  $(".fb-add-button").on("click", function(event){
    //for specific tab: $(".fb-add-button",$("div#voting_tab"))
    console.log("fb button click")
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Actions',
      eventAction: 'addFriend',
      eventLabel: current_user.fbId,
      eventValue: current_person.fbId
    });
  });

  $(".claim-fb-button").on("click", function(event){
    console.log("claim fb button click")
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Secondary Actions',
      eventAction: 'claimFb',
      eventLabel: current_user.fbId,
      eventValue: current_person.fbId
    });
  });

  $(".report-button").on("click", function(event){
    console.log("report button click")
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Secondary Actions',
      eventAction: 'reportProfile',
      eventLabel: current_user.fbId,
      eventValue: current_person.fbId
    });
  });

  $("#fb_login_button").on("click", function(event){
    console.log("login button click")
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Secondary Actions',
      eventAction: 'Login'
    });
  });

  $("#fb_logout_button").on("click", function(event){
    console.log("logout button click")
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Secondary Actions',
      eventAction: 'Logout',
      eventLabel: current_user.fbId
    });
  });

  $("#hide_my_fb_button").on("click", function(event){
    console.log("hide_my_fb button click")
    console.log(event);
    ga('send', {
      hitType: 'event',
      eventCategory: 'Secondary Actions',
      eventAction: 'hideFb',
      eventLabel: current_user.fbId
    });
  });
  

});