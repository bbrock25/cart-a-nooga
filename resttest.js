var rest = require('restler'),
    xml2js = require('xml2js'),
    eyes = require('eyes');

var options = {
  host: 'bustracker.gocarta.org',
  path: '/bustime/api/v1/getvehicles?key=77v7HfWzn9upAYD9EutQ9PpEa&rt=4'
};

function printLatLon(element, index, array){
  console.log('[' + element['lat'] 
   + ', ' + element['lon'] + '],'); 
}
var parser = new xml2js.Parser();
parser.on('end', function(result) {
  //eyes.inspect(result);
  var response = result['bustime-response'];
  response['vehicle'].forEach(printLatLon);
});

var url = 'http://' 
  + options['host']
  + options['path'];

rest.get(url).on('complete', function(result) {

  if (result instanceof Error) {
    console.log('Error:', result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    parser.parseString(result)
  }
});
