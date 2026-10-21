const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const dynamodb = require("./dynamodb-client");

const TABLE_NAME = process.env.TABLE_NAME || "coupons";
const UPDATABLE_FIELDS = [
  "provider_id",
  "campaign_id",
  "code",
  "description",
  "discount_percent",
  "discount_amount",
  "is_active"
];

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

  let requestBody;
  try {
    requestBody = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return response(400, { message: "Request body must be valid JSON" });
  }

  if (!requestBody || typeof requestBody !== "object" || Array.isArray(requestBody)) {
    return response(400, { message: "Request body is required" });
  }

  const updates = Object.entries(requestBody).filter(
    ([field, value]) => UPDATABLE_FIELDS.includes(field) && value !== undefined
  );

  if (updates.length === 0) {
    return response(400, { message: "No supported coupon fields were provided" });
  }

  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  const setExpressions = updates.map(([field, value], index) => {
    const nameToken = `#field${index}`;
    const valueToken = `:value${index}`;
    expressionAttributeNames[nameToken] = field;
    expressionAttributeValues[valueToken] = marshall({ value }).value;
    return `${nameToken} = ${valueToken}`;
  });

  try {
    const result = await dynamodb.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ id }),
        UpdateExpression: `SET ${setExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_NEW"
      })
    );

    return response(200, unmarshall(result.Attributes));
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return response(404, { message: "Coupon not found" });
    }

    console.error("Unable to update coupon", error);
    return response(500, { message: "Unable to update coupon" });
  }
};
