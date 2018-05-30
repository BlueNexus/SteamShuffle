

function primary(){
	var v = document.getElementById("steamid").value;
	var req = makeCorsRequest(v, "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=B11B3D3F6508C67AAAEFC72418EE6A88&steamid=", "&format=xml");
	return false;
	}

function pausecomp(millis) {
	//Used for slowing down computation, to give steam enough time to respond.
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}
function execute(params){
	alert("1")
	alert(params);
}

function createCORSRequest(m, u, f, p) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(m, f + u + p, true);


  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(m, f + u + p);
	
  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}


function makeCorsRequest(url,foreurl,posturl) {
  // Sends a CORS request to the steam server. I've never used CORS before, so bear with me.

  var xhr = createCORSRequest("GET", url, foreurl, posturl);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
	var allgames = text.match(/[^\r\n]+/g);
	var games = [];
	//This section exists to find lines containing appids, strip the surrounding text and add it to our list.
	for (i = 0; i < allgames.length; i++) {
		if(allgames[i].includes("appid")){
			games.push(allgames[i].replace(/\D/g,''));
		}
	}
	//Picks a random game from all the available appids
	var rand = games[Math.floor(Math.random() * games.length)];
	if(!rand){
		alert("Invalid steam ID. User might have their games set to private.")
	}
	process_game(rand);
    var title = getTitle(text);
	//This section is only used if there's an error, such as a 500 error.
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
 
	//Sends the request with our unique steam key
  xhr.send("B11B3D3F6508C67AAAEFC72418EE6A88");
  pausecomp(1000); //Intentionally delays it to give steam enough time to respond.
};

function process_game(game) {
	//This function sets the background image to one appropriate for the given game, and assigns it a URL.
	var bgdiv = document.getElementById("backing_image");
	var bgimg = 'https://steamcdn-a.akamaihd.net/steam/apps/' + game + '/header.jpg'
	bgdiv.src = bgimg;
	var bglink = 'steam://rungameid/' + game;
	document.getElementById("backing_link").href=bglink; //So they can click on the image to launch th egame.
}
	
		
/*
function httpGetAsync(r, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=B11B3D3F6508C67AAAEFC72418EE6A88&steamid=" + r + "&format=xml", true); // true for asynchronous 
    xmlHttp.send("B11B3D3F6508C67AAAEFC72418EE6A88");
}
*/