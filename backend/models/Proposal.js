const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    rawEmailContent: String,
    parsedData: {
        items: [{
            name: String,
            unitPrice: Number,
            quantity: Number,
            totalPrice: Number
        }],
        totalAmount: Number,
        deliveryTime: String,
        paymentTerms: String,
        warranty: String,
        additionalNotes: String
    },
    receivedAt: Date,
    status: {
        type: String,
        enum: ['received', 'parsed', 'evaluated'],
        default: 'received'
    },
    aiScore: Number,
    aiSummary: String
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
