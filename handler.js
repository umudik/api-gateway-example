const TABLE_NAME = "ws_connection"
const AWS = require('aws-sdk');
require("dotenv").config()

module.exports.connection = async (event, context) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        region: "eu-central-1"
    });
    const connectionId = event.requestContext.connectionId
    const routeKey = event.requestContext.routeKey
    const callbackUrlForAWS = "wss://92nkivbqo8.execute-api.eu-central-1.amazonaws.com/dev"
    if (routeKey === "$connect") {
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: {
                connectionId,
                ts: Date.now(),
                ttl: parseInt((Date.now() / 1000) + 7200)
            }
        }).promise();
    }

    if (routeKey === "$disconnect") {
        await dynamodb.delete({
            TableName: TABLE_NAME,
            Key: { connectionId }
        }).promise();
    }

    if (routeKey === "$default") {
        const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: callbackUrlForAWS,
        });

        const res = await apigatewaymanagementapi.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify("hello"),
        }.promise()
        );
        console.log(res);
        return {
            statusCode: 200,
        }
    }
    return { statusCode: 200 };
};