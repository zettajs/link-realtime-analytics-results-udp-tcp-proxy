var EventEmitter = require('events').EventEmitter;
var util = require('util');
var ResultsNodeClient = require('./results_node_client');
var url = require('url');

var TcpSearch = module.exports = function() {
  EventEmitter.call(this);
  var self = this;
  var opts = {
    host: process.env.COREOS_PRIVATE_IPV4 
  };

  if(process.env.ETCD_PEER_HOSTS) {
    opts.host = process.env.ETCD_PEER_HOSTS.split(',');
  }

  this._nodeClient = new ResultsNodeClient(opts);
  self._nodeClient.findAll(function(err, results) {
    console.log(arguments);
    if(err) {
      return console.error(err);
    }

    if(results.length) {
      var endpoint = results[0].url;
      console.log('Found results endpoint: ', endpoint);
      var endpointUrl = url.parse(endpoint);
      var credentials = {
        host:endpointUrl.hostname,
        port:endpointUrl.port
      };
      self.emit('found', credentials);
    }

    self._nodeClient.on('change', function(results) {
      if(results.length) {
        var endpoint = results[0].url;
        console.log('Found results endpoint: ', endpoint);
        var endpointUrl = url.parse(endpoint);
        var credentials = {
          host:endpointUrl.hostname,
          port:endpointUrl.port
        };
        self.emit('found', credentials);
      }
    });
  });
}
util.inherits(TcpSearch, EventEmitter);
