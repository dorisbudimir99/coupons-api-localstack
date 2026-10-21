const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const config = {
  region: process.env.AWS_REGION || "us-east-1"
};

if (process.env.DYNAMODB_ENDPOINT) {
  config.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const client = new DynamoDBClient(config);

exports.send = (command) => client.send(command);
