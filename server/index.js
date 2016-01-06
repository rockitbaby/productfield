var express = require("express");
var path = require("path");
var render = require("./illustrator.generated.js");

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", function(req, res) {
  res.set('Content-Type', 'image/svg+xml');
  // add wrapping svg, as react strips xmlns attribute
  res.end('<svg viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + render(req.query) + '</svg>');
});

var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});