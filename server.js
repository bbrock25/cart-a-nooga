var express = require('express'),
    app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {'log': false});

var carta_interface = require('./interface.js')

server.listen(8000);

app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/lib"));

console.log(__dirname)

app.get('/', function (req, res) {
   console.log(req);
  res.sendfile(__dirname + '/index.html');
});

var routes_i = new carta_interface.Routes();
var time_i = new carta_interface.SystemTime();

setInterval(function(){time_i.submit_query();}, 60000);

io.sockets.on('connection', function (socket) {
  time_i.submit_query();
  routes_i.on('update', function(){
    socket.emit('route_list', routes_i.variable);
  });

  time_i.on('update', function(){
    socket.emit('system_time', time_i.variable);
  });

});