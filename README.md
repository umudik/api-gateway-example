## AWS API Gateway WebSocket Example.

### Deploy API 
```bash
npx serverless deploy
```
Dont forget to set AWS credentials.

Run Client
```bash
node client.js
```


#### Env
```
WSS_ENDPOINT = "wss://[API-NAME].execute-api.[REGION].amazonaws.com/[STAGE]"
AWS_ACCESS_KEY_ID =  "..."
AWS_SECRET_ACCESS_KEY = "..."
SYSTEM_TOKEN = "example_token"


```
