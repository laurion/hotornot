var people = document.getElementsByClassName("_3u1 _gli _5und");
var peopleIds = []; 
for(var i = 0; i < people.length; i ++){ 
	var data = people[i].getAttribute("data-bt");
	peopleIds.push(JSON.parse(data).id); 
}

people = document.getElementsByClassName("_gll");
var peopleLinks = []; 
for(var i = 0; i < people.length; i ++){ 
	peopleLinks.push(people[i]); 
	while(peopleLinks[i].nodeName != "A") 
		peopleLinks[i] = peopleLinks[i].childNodes[0]
}
var finalObjects=[];
for(var i = 0; i < peopleLinks.length; i ++){ 
	var obj={}; 
	obj.id = peopleIds[i]; 
	obj.name = peopleLinks[i].childNodes[0].childNodes[0].innerHTML;
	finalObjects.push(obj)
}

peopleIds.length;
finalObjects.length;
JSON.stringify(finalObjects);

