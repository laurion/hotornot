
var queries = require('./queries.js');

exports.vote = function(score, fbId) {
  console.log("enter vote");
  //queries.updateUserWithScore(fbId, score);
  //TODO
  //create vote relation
       // run script that depends on scripta.js and scriptb.js
  var  votingsStatus = queries.updateUserWithScore(fbId, score);
};
  
  /* $.when(
    $.getScript( "/javascripts/queries.js" ),
    $.getScript( "http://www.parsecdn.com/js/parse-1.6.12.min." ),
     $.Deferred(function( deferred ){
        $( deferred.resolve );
    })).done(function(){
       console.log( "bb" );
      
   		//place your code here, the scripts are all loaded

	}).fail(function( jqxhr, settings, exception ) {
          console.log("fail" + exception);
          $( "div.log" ).text( "Triggered ajaxError handler." );
    });*/