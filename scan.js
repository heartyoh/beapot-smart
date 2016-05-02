var querystring = require('querystring')
var publisher = require('./printhing-publisher')

function toInt(data, index, length) {
  return parseInt(data.substr(index, length), 16)
}

function parseHeader(data) {
  var len = toInt(data, 0, 2)
  var type = toInt(data, 2, 2)
  var _data = toInt(data, 4, 2)

  return {
    len: len,
    type: type,
    data: _data
  }
}

function parseMSD(data) {
  var len = toInt(data, 0, 2)
  var type = toInt(data, 2, 2)
  var kind = toInt(data, 4, 2)

  var year = toInt(data, 6, 4)
  var mon = toInt(data, 10, 2)
  var day = toInt(data, 12, 2)
  var hour = toInt(data, 14, 2)
  var min = toInt(data, 16, 2)
  var sec = toInt(data, 18, 2)

  var scanner = toInt(data, 20, 4)
  var beacon = toInt(data, 24, 4)

  var accelX = toInt(data, 28, 4)
  var accelY = toInt(data, 32, 4)
  var accelZ = toInt(data, 36, 4)

  var gyroX = toInt(data, 40, 4)
  var gyroY = toInt(data, 44, 4)
  var gyroZ = toInt(data, 48, 4)

  var battery = toInt(data, 52, 2)
  var terminator = toInt(data, 54, 2)

  return {
    len: len,
    type: type,
    kind: kind,
    year: year,
    mon: mon,
    day: day,
    hour: hour,
    min: min,
    sec: sec,
    scanner: scanner,
    beacon: beacon,
    accelX: accelX,
    accelY: accelY,
    accelZ: accelZ,
    gyroX: gyroX,
    gyroY: gyroY,
    gyroZ: gyroZ,
    battery: battery,
    terminator: terminator
  }
}

function parseData(data) {
  var header = parseHeader(data)
  var _data = parseMSD(data.substr(header.len))

  if(header.type == 1 && header.data == 6) {
    return {
      header: header,
      data: _data
    }    
  } else {
    return data
  }
}

function scan(req, res) {
  var body = querystring.parse(req.body);

  var i = 1;

  while(body['iam' + i]) {

    var data = body['data' + i]

    if(data.length !== 62) {
      i++
      continue
    }

    publisher.send({
      iam: body['iam' + i],
      time: body['time' + i],
      bdaddr: body['bdaddr' + i],
      rssi: body['rssi' + i],
      data: data,
      _data: parseData(data)
    })

    i++;
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('I have got you.');
}

module.exports = scan
