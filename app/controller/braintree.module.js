const braintree = require("braintree");
const env = require("../config/config");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: env.braintreeMerchantID,
  publicKey: env.braintreePublicKey,
  privateKey: env.braintreePrivateKey,
});

// exports.generateClientToken = async (customerId) => {
//   return new Promise((resolve, reject) => {
//     gateway.clientToken.generate({ customerId }, (err, response) => {
//       if (err) reject(err);
//       else resolve(response.clientToken);
//     });
//   });
// };

// exports.createTransaction = async (amount, nonce, deviceData) => {
//   return new Promise((resolve, reject) => {
//     gateway.transaction.sale(
//       {
//         amount,
//         paymentMethodNonce: nonce,
//         deviceData,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       }
//     );
//   });
// };

gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      console.error('Error generating client token:', err);
      return;
    }
  
    const clientToken = response.clientToken;
    createPaymentMethod(clientToken);
  });
  
  function createPaymentMethod(clientToken) {
    const braintree = require('braintree-web');
  
    braintree.client.create({
      authorization: clientToken
    }, (err, clientInstance) => {
      if (err) {
        console.error('Error creating client instance:', err);
        return;
      }
  
      const creditCard = {
        number: '4111111111111111',
        expirationDate: '12/2025',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          streetAddress: '123 Main St',
          extendedAddress: '',
          locality: 'Chicago',
          region: 'IL',
          postalCode: '60601',
          countryName: 'USA'
        }
      };
  
      clientInstance.request({
        endpoint: 'payment_methods/credit_cards',
        method: 'post',
        data: {
          creditCard: creditCard
        }
      }, (err, response) => {
        if (err) {
          console.error('Error creating payment method:', err);
          return;
        }
  
        const paymentMethodToken = response.creditCards[0].token;
        createTransaction(paymentMethodToken);
      });
    });
  }
  
  function createTransaction(paymentMethodToken) {
    gateway.transaction.sale({
      amount: '10.00',
      paymentMethodToken: paymentMethodToken,
      options: {
        submitForSettlement: true
      }
    }, (err, result) => {
      if (err) {
        console.error('Error creating transaction:', err);
        return;
      }
  
      if (result.success) {
        console.log('Transaction created successfully:', result.transaction);
      } else {
        console.error('Transaction creation failed:', result.message);
      }
    });
  }