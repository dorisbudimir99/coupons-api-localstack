const sampleEvent = require("../events/api-gateway-event.json");
const { handler, SUCCESS_MESSAGE } = require("../src/index");

describe("coupons_list Lambda", () => {
  test("returns the expected API Gateway response", async () => {
    const response = await handler(sampleEvent);

    expect(response.statusCode).toBe(200);
    expect(response.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(response.body)).toEqual({
      message: SUCCESS_MESSAGE
    });
  });
});
