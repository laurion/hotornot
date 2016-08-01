var people = document.getElementsByClassName("_5pbw");
var peopleLinks = []; 
for(var i = 0; i < people.length; i ++){ 
	peopleLinks.push(people[i]); 
	while(peopleLinks[i].nodeName != "A") 
		peopleLinks[i] = peopleLinks[i].childNodes[0]
}
var finalObjectsFromPosts=[];
for(var i = 0; i < peopleLinks.length; i ++){ 
	var obj={}; 
	obj.href = peopleLinks[i].href; 
	obj.datahovercard = peopleLinks[i].getAttribute("data-hovercard"); 
	obj.innerHTML = peopleLinks[i].innerHTML;
	finalObjectsFromPosts.push(obj)
}

var postsContent = document.getElementsByClassName("userContent");
var isSeller = function(content){
	if(!content.childNodes[0])//no content (probably music shared)
		return false;
	var text = content.childNodes[0].innerHTML.toLowerCase();
	return text.match("vand") || text.match("inchiriez");
}

var allPeople = [];
var finalPostsPeople = [];
for(var i = 0; i < finalObjectsFromPosts.length; i ++){ 
	if(isSeller(postsContent[i]))
		continue;
	finalPostsPeople.push(finalObjectsFromPosts[i]);
	allPeople.push(finalObjectsFromPosts[i]);
}

var commentsPeople = document.getElementsByClassName("UFICommentActorName");
var finalCommentsPeople=[];
for(var i = 0; i < commentsPeople.length; i ++){ 
	var obj={}; 
	obj.href = commentsPeople[i].href; 
	obj.datahovercard = commentsPeople[i].getAttribute("data-hovercard"); 
	obj.innerHTML = commentsPeople[i].innerHTML;
	finalCommentsPeople.push(obj);
	allPeople.push(obj);
}
finalPostsPeople.length;
finalCommentsPeople.length;
allPeople.length;
JSON.stringify(allPeople);

