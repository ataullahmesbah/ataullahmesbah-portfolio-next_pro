const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        minCartTotal: {
            type: Number,
            required: true,
            min: 0,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

ConfigSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.Config || mongoose.model('Config', ConfigSchema);