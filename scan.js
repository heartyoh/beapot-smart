var querystring = require('querystring')
var publisher = require('./printhing-publisher')

function scan(req, res) {
  var body = querystring.parse(req.body);

  var i = 1;
  while(body['iam' + i]) {

    publisher.send({
      iam: body['iam' + i],
      time: body['time' + i],
      bdaddr: body['bdaddr' + i],
      rssi: body['rssi' + i],
      data: body['data' + i]
    })
    i++;
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('I have got you.');
}

module.exports = scan
