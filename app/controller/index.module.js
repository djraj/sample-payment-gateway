const config = require("../config/config.js");
const mongoose = require("mongoose");

// Import payment gateway libraries
const paypal = require("./paypal.module.js");
const braintree = require("./braintree.module.js");

// Create and Save a new Card transaction
exports.initiateTransaction = async (req, res) => {
  // Validate request
  if (!req.body)
    return res.status(400).send({ message: "Object can not be empty!" });

  // This way, multiple payment gateways can be included, and which to use can be determined by a number
  // e.g Paypal = 1, Braintree = 2, iPay = 3
  if (!req.body.paymentGatewayID)
    return res
      .status(400)
      .send({ message: "Payment Gateway ID must not be empty!" });

  if (!req.body.amount)
    return res.status(400).send({ message: "Amount must not be empty!" });

  if (!req.body.currency)
    return res.status(400).send({ message: "Currency must not be empty!" });

  if (!req.body.customerName)
    return res
      .status(400)
      .send({ message: "Customer Name must not be empty!" });

  if (!req.body.ccHolderName)
    return res
      .status(400)
      .send({ message: "Credit Card Holder Name must not be empty!" });

  if (!req.body.ccNumber)
    return res
      .status(400)
      .send({ message: "Credit Card Number must not be empty!" });

  if (!req.body.ccExp)
    return res
      .status(400)
      .send({ message: "Credit Card Expiration must not be empty!" });

  if (!req.body.ccCCV)
    return res
      .status(400)
      .send({ message: "Credit Card CCV must not be empty!" });

  // Force currency check and credit card check - will override payment gateway chosen
  let amex = new RegExp("^3[47][0-9]{13}$");
  if (amex.test(req.body.ccNumber)) {
    if (req.body.currency == "USD") {
      req.body.paymentGatewayID = 1;
    } else {
      return res
        .status(400)
        .send({ message: "AMEX card can only be used for USD" });
    }
  } else {
    if (
      req.body.currency == "USD" ||
      req.body.currency == "EUR" ||
      req.body.currency == "AUD"
    ) {
      req.body.paymentGatewayID = 1;
    } else {
      req.body.paymentGatewayID = 2;
    }
  }

  
  const transactionDetails = {
    TRX_TYPE: req.body.paymentGatewayID,
    TRX_AMOUNT: req.body.amount,
    TRX_CURRENCY: req.body.currency,
    TRX_CUSTOMER_NAME: req.body.customerName,
  };

  const cardDetails = {
    ccHolderName: req.body.ccHolderName,
    ccNumber: req.body.ccNumber,
    ccExp: req.body.ccExp,
    ccCCV: req.body.ccCCV,
  };

  console.log("Received data: ", transactionDetails, cardDetails);

  if (req.body.paymentGatewayID == 1) {

  } else if (req.body.paymentGatewayID == 2) {

  }

  try {
    mongoose
      .connect(config.DATABASE_URL)
      .then(async () => {
        let cardDataDB = new card(cardData);
        const cardDataToMongo = await cardDataDB.save();
        // console.log(cardDataToMongo);
        mongoose.disconnect();
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        res.status(500).json({ message: err.message });
      });

    res.status(200).json(cardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  // Routes
  app.post("/create-payment", (req, res) => {
    const amount = req.body.amount;
    createPayment(amount, (error, payment) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json(payment);
      }
    });
  });

  app.post("/execute-payment", (req, res) => {
    const paymentId = req.body.paymentId;
    const payerId = req.body.payerId;
    executePayment(paymentId, payerId, (error, payment) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json(payment);
      }
    });
  });
};

// function to check type of credit card
function creditCardType(cc) {
  let amex = new RegExp("^3[47][0-9]{13}$");
  let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");

  let mastercard = new RegExp("^5[1-5][0-9]{14}$");
  let mastercard2 = new RegExp("^2[2-7][0-9]{14}$");

  let disco1 = new RegExp("^6011[0-9]{12}[0-9]*$");
  let disco2 = new RegExp("^62[24568][0-9]{13}[0-9]*$");
  let disco3 = new RegExp("^6[45][0-9]{14}[0-9]*$");

  let diners = new RegExp("^3[0689][0-9]{12}[0-9]*$");
  let jcb = new RegExp("^35[0-9]{14}[0-9]*$");

  if (visa.test(cc)) {
    return "VISA";
  }
  if (amex.test(cc)) {
    return "AMEX";
  }
  if (mastercard.test(cc) || mastercard2.test(cc)) {
    return "MASTERCARD";
  }
  if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
    return "DISCOVER";
  }
  if (diners.test(cc)) {
    return "DINERS";
  }
  if (jcb.test(cc)) {
    return "JCB";
  }
  return undefined;
}
