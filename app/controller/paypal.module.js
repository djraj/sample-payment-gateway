const env = require("../config/config");

// exports.generateAccessToken = () => {
async function generateAccessToken() {
  const response = await axios.post(
    "https://api.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${env.paypalClientID}:${env.paypalClientSecret}`
        ).toString("base64")}`,
      },
    }
  );

  return response.data.access_token;
}

// Payment functions
async function createPayment(data) {
  const accessToken = await generateAccessToken();

  const response = await axios.post(
    "https://api.paypal.com/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: data.currency,
            value: data.amount,
          },
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}
