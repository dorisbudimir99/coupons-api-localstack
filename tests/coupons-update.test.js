const { marshall } = require("@aws-sdk/util-dynamodb");
const dynamodb = require("../src/dynamodb-client");
const { handler } = require("../src/coupons-update");
const sampleEvent = require("../events/update-coupon-event.json");

jest.mock("../src/dynamodb-client", () => ({ send: jest.fn() }));

describe("coupons_update Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates the coupon matching the path parameter id", async () => {
    const updatedCoupon = {
      id: "coupon-001",
      provider_id: "provider-001",
      campaign_id: "campaign-fall",
      description: "Updated fall coupon",
      discount_percent: 25
    };
    dynamodb.send.mockResolvedValue({ Attributes: marshall(updatedCoupon) });

    const result = await handler(sampleEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(updatedCoupon);
    expect(dynamodb.send).toHaveBeenCalledTimes(1);
    expect(dynamodb.send.mock.calls[0][0].input).toMatchObject({
      TableName: "coupons",
      Key: marshall({ id: "coupon-001" }),
      ReturnValues: "ALL_NEW"
    });
  });

  test("rejects an invalid JSON request body", async () => {
    const result = await handler({
      pathParameters: { id: "coupon-001" },
      body: "not-json"
    });

    expect(result.statusCode).toBe(400);
    expect(dynamodb.send).not.toHaveBeenCalled();
  });
});
