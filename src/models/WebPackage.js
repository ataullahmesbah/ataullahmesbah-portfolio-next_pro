import mongoose from 'mongoose';

const WebPackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    features: {
        type: [String],
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: 'At least one feature is required',
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.WebPackage || mongoose.model('WebPackage', WebPackageSchema);