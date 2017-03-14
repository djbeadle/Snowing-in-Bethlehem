var config = {};

// port number
config.port = 8181;

// location name, ex: Bethlehem, Omond House, Washington DC
config.placename = "Bethlehem, PA";

// You can sign up for a free DarkSky.net developer account at https://darksky.net/dev/
// You'll get 1,000 free API calls per day.
config.apikey = "ABCD1234EFGH5678";

// DarkSky.net polling interval. Calling every 2 minutes works out to 720 calls per day.
config.updaterate = 120000;

// What kinds of weather qualify as 'snow'?
config.weather = ["snow", "sleet"];

// Latitude and Longitude up to four decimal places
// use http://www.latlong.net to find it
config.lat = 40.6067;
config.lon = -75.384;

// Threshold - at what precipitation probability do we say, "It's snowing"
// Raise and lower based on your experience at your particular location
config.threshold = 0.7;

module.exports = config
