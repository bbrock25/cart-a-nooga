var http = require('http'),
    xml2js = require('xml2js');

var options = {
  host: 'bustracker.gocarta.org',
  path: '/bustime/api/v1/getvehicles?key=77v7HfWzn9upAYD9EutQ9PpEa&rt=4'
};

var parser = xml2js.Parser();

var req = http.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    console.log('BODY: ' + body);
    // ...and/or process the entire body here.
    var resp = parser.parseString(body);
    console.log(resp);
  })
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});
