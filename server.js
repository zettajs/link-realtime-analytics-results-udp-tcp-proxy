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
    console.log('end event');
    spliceSender(sender);
  });

  sender.on('close', function() {
    console.log('close event');
    spliceSender(sender);  
  });

  sender.on('error', function(e) {
    console.log('error:', e);
    spliceSender(sender);
  });

  sender.on('connect', function() {
    console.log('connect event');
  });

  function spliceSender(sender) {
    var idx = tcpSockets.indexOf(sender);
    if(idx > -1) {
      tcpSockets.splice(idx, 1);
    }
  }
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

