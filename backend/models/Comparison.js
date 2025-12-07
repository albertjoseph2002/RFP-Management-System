const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
    aiAnalysis: {
        recommendation: String,
        reasoning: String,
        comparisonMatrix: [{
            vendorId: mongoose.Schema.Types.ObjectId,
            vendorName: String,
            score: Number,
            pros: [String],
            cons: [String],
            priceScore: Number,
            deliveryScore: Number,
            termsScore: Number,
            completenessScore: Number
        }]
    },
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Comparison', comparisonSchema);
