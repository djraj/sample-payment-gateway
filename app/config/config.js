const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../../.env");
const envFile = fs.readFileSync(envPath, "utf-8");

const envRegex = /(.*)=(.*)/gm;
const env = {};

let match;
while ((match = envRegex.exec(envFile)) !== null) {
  env[match[1]] = match[2];
}

// Paypal require the client ID and secret to be encoded in base64
function encodeBase64(input) {
  return Buffer.from(input).toString("base64");
}

const MONGO_URL=`mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@${env.MONGODB_HOST}/?retryWrites=true&w=majority`

module.exports = {
  paypalClientID: encodeBase64(env.PAYPAL_CLIENT_ID),
  paypalClientSecret: encodeBase64(env.PAYPAL_CLIENT_SECRET),
  braintreeMerchantID: env.BRAINTREE_MERCHANT_ID,
  braintreePublicKey: env.BRAINTREE_PUBLIC_KEY,
  braintreePrivateKey: env.BRAINTREE_PRIVATE_KEY,
  url: env.API_URL,
  port: env.SERVER_PORT || 3000,
  dbURL: MONGO_URL
};
