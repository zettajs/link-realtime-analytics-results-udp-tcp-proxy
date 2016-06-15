var udp = require('dgram');
var server = udp.createSocket('udp4');

module.exports = function(emitter, port) {
  server.on('error', function(err) {
    emitter.emit('error', err);
  });

  server.on('message', function(msg) {
    emitter.emit('message', msg);
  });

  server.on('listening', function() {
    emitter.emit('listening');
  });

  server.bind(port);
}


