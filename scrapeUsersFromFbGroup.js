var peopleLinks = document.querySelectorAll("div.result-image > a")
var finalObjects=[];
for(var i = 0; i < peopleLinks.length; i ++){ 
	var obj={};  

  obj.href = peopleLinks[i].href;
 
	finalObjects.push(obj)
}
finalObjects.length;
JSON.stringify(finalObjects);


var peopleLinks1 = document.getElementsByClassName("result-image");
var peopleLinks2 = document.getElementsByClassName("title main-headline");
var peopleLinks3 = document.getElementsByClassName("description");
var finalObjects=[];
for(var i = 0; i < peopleLinks1.length; i ++){ 
	var obj={};  
  var href  = peopleLinks1[i].getAttribute("href");
  obj.url =  "";
  obj.name = peopleLinks2[i].innerHTML;

  var joblink = peopleLinks3[i + 2].innerHTML;
  
  joblink = joblink.replace("<b>", "");
  joblink = joblink.replace("</b>","");
  var position = 0;

  var newjoblink = joblink.split("<b>");
  var country =  newjoblink[1];

  var newjoblink2 =  newjoblink[0].split("</b>");

  newjoblink2 =newjoblink2[0].split(" at ");
 // var jobName = newjoblink[0];
  //var companyLink = "";
  //for(var i = 1;  i < newjoblink.length; i++){
  //	companyLink =  companyLink + + joblink[i];
 // }
 /// var company =  companyLink;
  obj.job = newjoblink2[0];
  obj.company = newjoblink2[1];
  //country = country.replace("</b>","");
 // obj.country = country;
  //obj.company = companyLink;
  finalObjects.push(obj)
}
finalObjects.length;
JSON.stringify(finalObjects);


var finalObjects=[];
for(var i = 0; i < peopleLinks.length; i ++){ 
	var obj={};  

 
 
	finalObjects.push(obj)
}
finalObjects.length;
JSON.stringify(finalObjects);

var peopleLinks = document.getElementsByClassName("description");
var finalObjects=[];
for(var i = 0; i < peopleLinks.length; i ++){ 
	var obj={};  

  obj.href = peopleLinks[i].innerHTML;
 
	finalObjects.push(obj)
}
finalObjects.length;
JSON.stringify(finalObjects);