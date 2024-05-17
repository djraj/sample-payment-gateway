const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema({
    TRX_TYPE: { // Set which payment gateway used
        required: true,
        type: Number,
        default: 1
    },
    TRX_AMOUNT: { // Amount
        required: true,
        type: Number,
        default: 0
    },
    TRX_CURRENCY: { // Currency
        required: true,
        type: String,
        default: "USD"
    },
    TRX_CUSTOMER_NAME: { // Customer Name
        required: true,
        type: String,
        default: ""
    },
    TRX_PAYMENT_DETAILS: { // Insert payment gateway data
        required: false,
        type: Object
    },
    TRX_PAYMENT_STATUS: { // Status of payment. 1 = Pending | 2 = Approved | 3 = Failed
        required: true,
        type: Number,
        default: 1
    }
})

orderSchema.plugin(mongoosePaginate);
exports.orderSchema = orderSchema;
module.exports = mongoose.model('Order', orderSchema)