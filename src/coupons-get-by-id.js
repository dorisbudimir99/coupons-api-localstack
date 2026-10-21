const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const dynamodb = require("./dynamodb-client");

const TABLE_NAME = process.env.TABLE_NAME || "coupons";

const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

exports.handler = async (event = {}) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return response(400, { message: "Coupon id is required" });
  }

  try {
    const result = await dynamodb.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ id }),
        ConsistentRead: false
      })
    );

    if (!result.Item) {
      return response(404, { message: "Coupon not found" });
    }

    return response(200, unmarshall(result.Item));
  } catch (error) {
    console.error("Unable to retrieve coupon", error);
    return response(500, { message: "Unable to retrieve coupon" });
  }
};
