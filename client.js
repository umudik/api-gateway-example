const webSocket = require('ws');
const ws = new webSocket("wss://92nkivbqo8.execute-api.eu-central-1.amazonaws.com/dev");

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

