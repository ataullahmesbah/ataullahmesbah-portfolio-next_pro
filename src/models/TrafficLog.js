import mongoose from 'mongoose';

const trafficLogSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    path: { type: String, required: true },
    country: { type: String, default: 'Unknown' },
    timestamp: { type: Date, default: Date.now },
});

// Check if the model already exists, otherwise create it
let TrafficLog;
if (mongoose.models && mongoose.models.TrafficLog) {
    TrafficLog = mongoose.models.TrafficLog;
} else {
    TrafficLog = mongoose.model('TrafficLog', trafficLogSchema);
}

export default TrafficLog;