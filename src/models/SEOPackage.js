import mongoose from 'mongoose';

       const SEOPackageSchema = new mongoose.Schema({
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

       export default mongoose.models.SEOPackage || mongoose.model('SEOPackage', SEOPackageSchema);