var http = require("http");
var request = require("request");
var dateTime = require("node-datetime");
var fs = require("fs");

var config = require("./config");

var current_weather_string;
var current_weather;

function timestampConvertor(timestamp){
	var date = new Date(timestamp*1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	// will display time in 21:00:00 format
	return hours + ':' + minutes + ':' + seconds;
}

function darkSkyParser(error, response, body){
	console.log("** Dark Sky Parser! **");

	if(typeof body == "undefined"){
		console.log("typeof body == 'undefined', we didn't get a proper response back from DarkSky.net");
		console.log("Serving out of date data!");
		console.log("error: ", error);
		console.log("statusCode: ", response && response.statusCode);
		return;
	}
	current_weather_string = JSON.stringify(JSON.parse(body), 1);
	current_weather = JSON.parse(body);

	var dt = dateTime.create();
	var formatted = dt.format("Y-m-d H:M:S");

	console.log("Data retreived: ", formatted);
	console.log("error: ", error);
	console.log("statusCode: ", response && response.statusCode);
	console.log("body: ", body);

	return;
}

function updateWeather(){
	request("https://api.darksky.net/forecast/" + config.apikey + "/" + config.lat + "," + config.lon + "?exclude=minutely,hourly,daily,flags,alerts", darkSkyParser);
	return;
}

updateWeather();
setInterval(updateWeather, config.updaterate);

http.createServer(function(request, response){
		switch(request.url){
		case "/basic.css" :
		console.log("Got a request for the css");
		fs.readFile("basic.css", function(error, content){
				if(error){
				response.writeHead(200, {"Content-Type": "text/css"});
				response.writeHead(500);
				response.end();
				}
				else{
				response.writeHead(200, {"Content-Type": "text/css"});
				response.end(content, "utf-8");
				}
				});
		break;
		default:
		console.log("Got a request for: " + request.url);
		console.log("User-agent: " + request.headers['user-agent']);
		console.log("IP: " + request.connection.remoteAddress)
		console.log("referer: " + request.headers.referer);
		console.log("remoteAddress: " + request.connection.remoteAddress);

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write("<head><link rel='stylesheet' href='basic.css'><title>Is it snowing in " + config.placename + "?</title></head>\n");
		response.write("<h2>IS IT SNOWING IN " + config.placename.toUpperCase() + "?</h2>\n");
		// response.write(JSON.stringify(current_weather.currently["icon"], 1), "utf8");

		console.log("***midnight debugging: ***");
		//console.log(current_weather.currently['precipProbability'] < config.threshold);		
		//console.log(config.weather.indexOf(current_weather.currently['precipType']) == -1);
		console.log("*** end midnight debugging: ***");
		if(typeof current_weather == "undefined"){
			response.write("<h2>A: No data from <a href='https://darksky.net/forecast/" + config.lat + "," + config.lon + "/us12/en' target='_blank'>DarkSky.net</a> try again later.</h2><h3>Until then, here's a random cat picture :)</h3>");
			response.write("<a href='http://thecatapi.com'><img src='http://thecatapi.com/api/images/get?format=src&type=gif'></a>");
			response.end("");
		}
		else if(current_weather.currently["precipProbability"] < config.threshold || config.weather.indexOf(current_weather.currently["precipType"]) == -1){
			response.write("<body class='no'>\n");
			response.write("<div><h1>No.</h1></div>\n");
			response.write("<h3>...Or at least, probably not. This prediction is powered by <a href='https://darksky.net/forecast/" + config.lat + "," + config.lon + "/us12/en' target='_blank'>DarkSky.net</a> and uses their precipitation estimates to determine if it's snowing or not.</h3>");
			response.end("</body>");
		}
		else if(current_weather.currently["precipProbability"] >= config.threshold && config.weather.indexOf(current_weather.currently["precipType"]) > -1){
			// display the percipitation probability for debugging purposes. 
			/* response.write("Probability of "); 
			   response.write(JSON.stringify(current_weather.currently["precipType"]));
			   response.write(" in Bethlehem, PA: ");
			   response.write(JSON.stringify(current_weather.currently["precipProbability"]));
			   response.write(".\n\n"); */

			console.log(current_weather.currently["precipProbability"]);
			console.log(current_weather.currently["precipType"]);
			// console.log(current_weather.currently["precipType"] == "snow");
			//console.log(current_weather.currently["precipProbability"] >= config.threshold && (current_weather.currently["precipType"] == "snow" || current_weather.currently["precipType"] == "sleet"));
			console.log(current_weather.currently["precipProbability"] >= config.threshold && config.weather.indexOf(current_weather.currently["precipType"]) > -1);

			console.log("Holy shit it's snowing!\n");
			response.write("<body class='yes'>");
			response.write("<div><h1>YES- COMMENCE PANIC!</h1></div></body>");
			response.write("<h3>This website is powered by DarkSky.net and uses their precipitation estimates to determine if it's snowing or not.</h3>");
			response.write("</body>");
			response.end("");
		}
		else{
                        response.write("<h1>An unknown error occured :(</h1><h2>so here's a random cat picture :)</h2>");
			response.write("<a href='http://thecatapi.com'><img src='http://thecatapi.com/api/images/get?format=src&type=gif'></a>");
                        response.end("");
		}

		break;
		}

}).listen(config.port, "0.0.0.0");

console.log("Server network accessible at http://127.0.0.1:" + config.port);
