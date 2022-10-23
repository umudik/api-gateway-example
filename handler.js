require("dotenv").config()
const TABLE_NAME = "ws_connection"
const AWS = require('aws-sdk');
const fookie = require("fookie")
const init = fookie.init()

module.exports.connection = async (event, context) => {
    await init
    const apig = new AWS.ApiGatewayManagementApi({
        endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`,
        region: "eu-central-1",
    });
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
    }

    if (routeKey === "$disconnect") {
        await dynamodb.delete({
            TableName: TABLE_NAME,
            Key: { connectionId }
        }).promise();
    }

    if (routeKey === "$default") {
        let payload = JSON.parse(event.body)
        const res = await fookie.run(payload)

        await apig.postToConnection({
            ConnectionId: connectionId,
            Data: Buffer.from(JSON.stringify(res), 'utf8')
        }).promise();
    }

    return { statusCode: 200 };
};

module.exports.auth = async (event, context) => {
    await init
    const { headers, methodArn } = event;
    //VALIDATE TOKEN HERE
    if (!headers["token"] || process.env.SYSTEM_TOKEN != headers["token"]) {
        throw new Error('Unauthorized');
    }
    return {
        principalId: headers["token"],
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: methodArn
            }]
        }
    }
};