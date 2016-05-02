var url = 'http://printhing.xyz'

var SockJS = require('sockjs-client'),
    Stomp  = require('stompjs'),
    socket = new SockJS(url + '/elidom/stomp'),

    client = Stomp.over(socket)
    connected = false

function connect(){
  client.connect({}, function(frame){
    console.log('Connected!!')
    client.subscribe('/elidom/stomp/topic/hatiolab-hq/smart', function(greeting){
      console.log(greeting.body)
    })
    connected = true
  })
}

function disconnect(){
  if(client)
    client.disconnect()
}

function send(data){
  if(!connected)
    return
  
  client.send('/elidom/stomp/topic/hatiolab-hq/smart',
    {},
    JSON.stringify(data)
  );
}

module.exports = {
  connect: connect,
  disconnect: disconnect,
  send: send
}