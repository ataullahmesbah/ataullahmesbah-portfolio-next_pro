import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
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
});

const WebDevelopmentSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
    services: {
        type: [ServiceSchema],
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: 'At least one service is required',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.WebDevelopment || mongoose.model('WebDevelopment', WebDevelopmentSchema);