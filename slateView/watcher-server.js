var fs = require('fs');
var url = require('url');
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var root = __dirname;
// tjs 131112
var port = process.argv[2];

app.use(function (req, res, next) {
  var file = url.parse(req.url).pathname;
  // tjs 131107
  //var mode = 'stylesheet';
  var mode = 'reload';
  if (file[file.length - 1] == '/') {
	  // tjs 131104
	    //file += 'index.html';
	  // tjs 131106
	    file += 'slate.html';
   //file += 'slates/slate.html';
    mode = 'reload';
  }
  createWatcher(file, mode);
  next();
});

app.use(express.static(root));

var watchers = {};

function createWatcher (file, event) {
  var absolute = path.join(root, file);

  if (watchers[absolute]) {
    return;
  }
  
/* tjs 131107
  fs.watchFile(absolute, function (curr, prev) {
    if (curr.mtime !== prev.mtime) {
      io.sockets.emit(event, file);
    }
  });
  */

  // returns event rename or change
  //fs.watch(absolute, '{ persistent: true }', function (event2, filename) {
/*  fs.watch(absolute, { persistent: true }, function (event2, filename) {
	  console.log("watcher-server event " + event2);
	  // e.g. replaced file and saw watcher-server event rename
	    //if (event == 'change') {
	    //if (event == 'rename') {
	    if (event2 == 'rename' || event2 == 'change') {
	    	// tjs 131107
	      //io.sockets.emit(event, file);
	    	setTimeout((function() {
	    		  var now = new Date();
	    		  fs.utimes(absolute, now, now, function (err) {
	        		  if (err) throw err;
	        		  //console.log('The "data to append" was appended to file!');
	        		  //console.log('The "data to append" was appended to ' + appendFile);
	        		  console.log('The timestamp changed to ' + now);
	        		  //io.sockets.emit(event, file);
	        		});
	    		}), 5000);
	    }
	  });*/
  
  fs.watchFile(absolute, function (curr, prev) {
	    if (curr.mtime !== prev.mtime) {
	    	console.log('The timestamp changed to ' + curr.mtime + " from " + prev.mtime + " for event " + event);
	      io.sockets.emit(event, file);
	    }
	  });

  watchers[absolute] = true;
}

//server.listen(8080);
server.listen(port);
