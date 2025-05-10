import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            title: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, default: 'Dhaka' },
        postcode: { type: String, default: '1000' },
        country: { type: String, default: 'Bangladesh' },
    },
    paymentMethod: { type: String, required: true, enum: ['cod', 'pay_first'] },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'pending_payment', 'paid', 'accepted', 'rejected', 'failed'],
        default: 'pending',
    },
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);