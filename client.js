const webSocket = require('ws');
const ws = new webSocket("wss://92nkivbqo8.execute-api.eu-central-1.amazonaws.com/dev");

ws.on('connection', (ws) => {
  console.log('New client connected!');
  ws.on('close', () => console.log('Client has disconnected!'));
});
