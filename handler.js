const TABLE_NAME = "ws_connection"
const AWS = require('aws-sdk');
require("dotenv").config()
const apig = new AWS.ApiGatewayManagementApi({
    endpoint:"https://92nkivbqo8.execute-api.eu-central-1.amazonaws.com/dev",
    region: "eu-central-1"
  });

module.exports.connection = async (event, context) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        region: "eu-central-1"
    });
    const connectionId = event.requestContext.connectionId
    const routeKey = event.requestContext.routeKey

    if (routeKey === "$connect") {
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: {
                connectionId,
                ts: Date.now(),
                ttl: parseInt((Date.now() / 1000) + 3600)
            }
        }).promise();
        await apig.postToConnection({
            ConnectionId: connectionId,
            Data: `Received`
          }).promise();
        return { statusCode: 200 , body: "Connected." };
    }

    if (routeKey === "$disconnect") {
        console.log("disconnect");
        await dynamodb.delete({
            TableName: TABLE_NAME,
            Key: { connectionId }
        }).promise();
    }

    if (routeKey === "$default") {
        console.log(JSON.stringify(event));
        console.log("default");
    }

    return { statusCode: 200 };
};