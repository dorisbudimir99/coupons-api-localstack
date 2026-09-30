const SUCCESS_MESSAGE = "Coupons API is working successfully";

exports.handler = async (event = {}) => {
  console.log("Received API Gateway event", JSON.stringify(event));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: SUCCESS_MESSAGE
    })
  };
};

exports.SUCCESS_MESSAGE = SUCCESS_MESSAGE;
