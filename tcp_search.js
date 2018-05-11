// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
