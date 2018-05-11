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


