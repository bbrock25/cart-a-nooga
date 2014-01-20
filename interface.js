var rest = require('restler'),
    xml2js = require('xml2js'),
    eyes = require('eyes'),
    events = require('events');

function API_Interface(){
  this.query_args = {};
  this.base_query = '';
  this.variable;
  events.EventEmitter.call(this);
};

API_Interface.prototype = Object.create(events.EventEmitter.prototype);

API_Interface.prototype.form_uri = function(){

  var options = {
    host: 'bustracker.gocarta.org',
    base_path: '/bustime/api/v1',
    api_key: '77v7HfWzn9upAYD9EutQ9PpEa'
  };

  var query_string = this.get_query();
  var query_args = this.get_query_args();
  var key_string = '?key=' + options.api_key;
  return options.host + options.base_path + query_string + key_string + query_args;
}

API_Interface.prototype.get_query = function(){
  return this.base_query;
}
API_Interface.prototype.get_query_args = function(){
  query_string = '';
  for(key in this.query_args)
    if(this.query_args[key].length >0)
      query_string += '&' + key + '=' + this.query_args[key].join(',');
  return query_string;
}
API_Interface.prototype.set_query_args = function(args){
  this.query_args = args;
}
API_Interface.prototype.print_query_args = function(){
  console.log(this.query_args);
}
API_Interface.prototype.update = function(value){
  this.variable = value;
  this.emit('update');
}

API_Interface.prototype.submit_query = function(){
  var parser = new xml2js.Parser();
  var current_instance = this;

  parser.on('end', function(result) {
    eyes.inspect(result);
    current_instance.update(result);
  });

  var url = 'http://' + this.form_uri();

  rest.get(url).on('complete', function(result) {

    if (result instanceof Error) {
      console.log('Error:', result.message, 'for', url);
      this.retry(5000); // try again after 5 sec
    } 
    else {
      parser.parseString(result)
    }
  });
}

exports.Vehicles = function Vehicles(){
  API_Interface.call(this);
  this.query_args = {
    vid: [],
    rt: []
  };
  this.base_query = '/getvehicles';
}

exports.Vehicles.prototype = new API_Interface();
exports.Vehicles.prototype.constructor = exports.Vehicles;
exports.Vehicles.prototype.set_query_args = function(args){
  if(args.rt !== undefined)
    this.query_args.rt = args.rt;

  if(args.vid !== undefined)
    this.query_args.vid = args.vid;
}

exports.Routes = function Routes(){
  API_Interface.call(this);
  this.base_query = '/getroutes';
}
exports.Routes.prototype = new API_Interface();
exports.Routes.prototype.constructor = exports.Routes;

exports.SystemTime = function SystemTime(){
  API_Interface.call(this);
  this.base_query = '/gettime';
}
exports.SystemTime.prototype = new API_Interface();
exports.SystemTime.prototype.constructor = exports.SystemTime;


