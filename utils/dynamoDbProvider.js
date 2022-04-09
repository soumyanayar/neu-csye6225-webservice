const AWS = require("aws-sdk");
const uuid = require("uuid");

class DynamoDbProvider {
  constructor(
    dynamoDbEndpoint,
    dynamoDbPort,
    dynamoDbRegion,
    dynamoDbTableName
  ) {
    this.dynamoDbEndpoint = dynamoDbEndpoint;
    this.dynamoDbPort = dynamoDbPort;
    this.dynamoDbRegion = dynamoDbRegion;
    this.dynamoDbTableName = dynamoDbTableName;
    this.dynamoDb = new AWS.DynamoDB({
      endpoint: this.dynamoDbEndpoint,
      port: this.dynamoDbPort,
      region: this.dynamoDbRegion,
    });

    // dynamo db create table if not exists
  }

  // TODO: Set the TTL for this token to be 5 minutes
  async addUserToken(username) {
    // create user token
    let userToken = uuid.v4();
    // add user token to dynamo db
    let params = {
      TableName: this.dynamoDbTableName,
      Item: {
        username: {
          S: username,
        },
        userToken: {
          S: userToken,
        },
      },
    };
    await this.dynamoDb.putItem(params).promise();
    return userToken;
  }

  async verifyUserToken(username, userToken) {
    // get user token from dynamo db
    let params = {
      TableName: this.dynamoDbTableName,
      Key: {
        username: {
          S: username,
        },
      },
    };
    let data = await this.dynamoDb.getItem(params).promise();
    if (
      data.Item &&
      data.Item.userToken &&
      data.Item.userToken.S === userToken
    ) {
      return true;
    }
    return false;
  }
}

module.exports = DynamoDbProvider;
