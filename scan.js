var querystring = require('querystring')
var publisher = require('./printhing-publisher')

function toInt(data, index, length) {
  return parseInt(data.substr(index, length), 16)
}

function toSignedInt(data, index, length) {
  var intVal = toInt(data, index, length)
  if ((intVal & 0x8000) > 0) {
    intVal = intVal - 0x10000;
  }
  return intVal;
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

  var accelX = toSignedInt(data, 28, 4)
  var accelY = toSignedInt(data, 32, 4)
  var accelZ = toSignedInt(data, 36, 4)

  var gyroX = toSignedInt(data, 40, 4)
  var gyroY = toSignedInt(data, 44, 4)
  var gyroZ = toSignedInt(data, 48, 4)

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
  var _data = parseMSD(data.substr((header.len + 1) * 2))

  if(data.length == 62 && header.type == 1 && header.data == 6
    && _data.len == 0x1B && _data.terminator == 0xFF) {
    return {
      header: header,
      data: _data
    }
  } else {
    return null
  }
}

function scan(req, res) {
  var body = querystring.parse(req.body);

  var i = 1;

  while(body['iam' + i]) {

    var data = body['data' + i]
    var _data = parseData(data)

    if(!_data) {
      i++
      continue
    }

    publisher.send({
      iam: body['iam' + i],
      time: body['time' + i],
      bdaddr: body['bdaddr' + i],
      rssi: body['rssi' + i],
      data: data,
      _data: _data
    })

    i++;
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('I have got you.');
}

module.exports = scan
