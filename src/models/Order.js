const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    products: [{
        productId: String,
        title: String,
        quantity: Number,
        price: Number,
        mainImage: String, // Added for product images
        size: { type: String, required: false }
    }],
    customerInfo: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postcode: String,
        country: String,
        district: String,
        thana: String,
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'pay_first'],
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    total: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    shippingCharge: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);