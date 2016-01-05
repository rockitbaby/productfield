var express = require("express");
var path = require("path");
var render = require("./illustrator.generated.js");

var app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", function(req, res) {
  res.set('Content-Type', 'image/svg+xml');
  // add wrapping svg, as react strips xmlns attribute
  res.end('<svg xmlns="http://www.w3.org/2000/svg">' + render() + '</svg>');
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});