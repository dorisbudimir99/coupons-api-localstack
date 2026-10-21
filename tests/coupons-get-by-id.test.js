const { marshall } = require("@aws-sdk/util-dynamodb");
const dynamodb = require("../src/dynamodb-client");
const { handler } = require("../src/coupons-get-by-id");
const sampleEvent = require("../events/get-coupon-event.json");

jest.mock("../src/dynamodb-client", () => ({ send: jest.fn() }));

describe("coupons_get_by_id Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the coupon matching the path parameter id", async () => {
    const coupon = {
      id: "coupon-001",
      provider_id: "provider-001",
      campaign_id: "campaign-fall",
      code: "FALL20"
    };
    dynamodb.send.mockResolvedValue({ Item: marshall(coupon) });

    const result = await handler(sampleEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(coupon);
    expect(dynamodb.send).toHaveBeenCalledTimes(1);
    expect(dynamodb.send.mock.calls[0][0].input).toMatchObject({
      TableName: "coupons",
      Key: marshall({ id: "coupon-001" }),
      ConsistentRead: false
    });
  });

  test("returns 404 when the coupon does not exist", async () => {
    dynamodb.send.mockResolvedValue({});

    const result = await handler({ pathParameters: { id: "missing" } });

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: "Coupon not found" });
  });
});
