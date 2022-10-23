require("dotenv").config()
const webSocket = require("ws");
const ws = new webSocket(process.env.WSS_ENDPOINT, {
  headers: {
    token: "invalid_token"
  }
});

ws.on('open', function open() {
  console.log("openned");
  const payload = {
    token: "umudik",
    model: "lifecycle",
    method: "read"
  }
  ws.send(JSON.stringify(payload));
});

ws.on('message', function message(data) {
  const res = JSON.parse(data.toString())
  console.log(res);

});

