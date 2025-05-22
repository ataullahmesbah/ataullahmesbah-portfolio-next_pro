const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
}, { _id: true }); // Ensure each service has an _id

const seoServiceSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    services: [serviceSchema],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

module.exports = mongoose.models.SEOService || mongoose.model('SEOService', seoServiceSchema);