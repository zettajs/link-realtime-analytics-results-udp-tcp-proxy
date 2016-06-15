var udpServer = require('./udp_server');
var TcpSearch = require('./tcp_search');
var TcpSender = require('./tcp_sender');
var EventEmitter = require('events').EventEmitter;

var search = new TcpSearch();
var tcpSockets = [];


function createConnection(credentials) {
  var sender = new TcpSender(credentials);
  tcpSockets.push(sender);
  sender.on('end', function() {
    var idx = tcpSockets.indexOf(sender);
    if(idx > -1) {
      tcpSockets.splice(idx, 1);
    }
  });
}


search.on('found', function(credentials) {
  createConnection(credentials);
});

var emitter = new EventEmitter();
emitter.on('message', function(data) {

  tcpSockets.forEach(function(item) {
    item.write(data.toString() + '\n'); 
  });  
});
udpServer(emitter, process.env.UDP_PORT || 3008);

