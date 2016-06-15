var net = require('net');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Sender = module.exports = function (opts) {
  console.log(opts);
  EventEmitter.call(this);
  this.client = net.createConnection(opts, function() {
    console.log('Connected to API at: ' + opts.host + ':' + opts.port);
  });

  this.client.emit.bind(this);   
}
util.inherits(Sender, EventEmitter);

Sender.prototype.write = function(data) {
  this.client.write(data);
}


