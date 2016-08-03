peopleLinks = document.querySelectorAll("div.fsl.fwb.fcb > a")
var finalObjects=[];
for(var i = 0; i < peopleLinks.length; i ++){ 
	var obj={};  
	obj.name = peopleLinks[i].innerHTML;
  obj.href = peopleLinks[i].href;
  var datah = peopleLinks[i].getAttribute("data-hovercard");
  obj.data = datah;
  obj.id = parseInt(datah.replace(/.*\?id=/g,""))
	finalObjects.push(obj)
}
finalObjects.length;
JSON.stringify(finalObjects);
