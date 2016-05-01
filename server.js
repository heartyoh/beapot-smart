var http = require('http');
var dispatcher = require('httpdispatcher');

var scan = require('./scan')
var publisher = require('./printhing-publisher')

const PORT=8080; 

function handleRequest(request, response){
  try {
    console.log(request.url);
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }
}

dispatcher.setStatic('resources');

dispatcher.onGet("/show", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Here you go.');
});    

dispatcher.onPost("/beapot-smart", function(req, res) {
  scan(req, res)
});

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});

publisher.connect();

