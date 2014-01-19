var fs = require('fs'),
    eyes = require('eyes'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();

parser.on('end', function(result) {
  eyes.inspect(result);
});

fs.readFile(__dirname + '/test.xml', function(err, data) {
  parser.parseString(data);
});
