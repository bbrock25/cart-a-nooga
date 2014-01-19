var rest = require('restler'),
    xml2js = require('xml2js'),
    eyes = require('eyes'),
    app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {'log': false}),
    events = require('events');


var EventEmitter = new events.EventEmitter();
var express = require('express');


server.listen(8000);


app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/lib"));

console.log(__dirname)

app.get('/', function (req, res) {
   console.log(req);
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log('server socket connection opened!');
  var routes_i = new Routes();
  console.log('routes_i.submit_query:', routes_i.submit_query());
  routes_i.on('update', function(){
    console.log('emitting!');
    socket.emit('route_list', routes_i.variable);

  });


});

function API_Interface(){
  this.query_args = {};
  this.base_query = '';
  this.variable;
  events.EventEmitter.call(this);
};

API_Interface.prototype.__proto__ = events.EventEmitter.prototype;

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

function Vehicles(){
  API_Interface.call(this);
  this.query_args = {
    vid: [],
    rt: []
  };
  this.base_query = '/getvehicles';
}

Vehicles.prototype = new API_Interface();
Vehicles.prototype.constructor = Vehicles;

Vehicles.prototype.set_query_args = function(args){
  if(args.rt !== undefined)
    this.query_args.rt = args.rt;

  if(args.vid !== undefined)
    this.query_args.vid = args.vid;
}

function Routes(){
  API_Interface.call(this);
  this.base_query = '/getroutes';
}
Routes.prototype = new API_Interface();
Routes.prototype.constructor = Routes;

function SystemTime(){
  API_Interface.call(this);
  this.base_query = '/gettime';
}

SystemTime.prototype = new API_Interface();
SystemTime.prototype.constructor = SystemTime();

SystemTime.prototype.update = function(json_response){
  console.log(json_response);
  var bustime_response = json_response['bustime-response'];
  this.variable = bustime_response.tm;
}

// var time_i = new SystemTime();
// console.log('time_i.submit_query', time_i.submit_query());



