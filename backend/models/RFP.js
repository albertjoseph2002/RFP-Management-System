const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    structuredData: {
        items: [{
            name: String,
            quantity: Number,
            specifications: String
        }],
        budget: Number,
        deliveryDeadline: Date,
        paymentTerms: String,
        warrantyRequirements: String,
        additionalRequirements: String
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'receiving_proposals', 'completed'],
        default: 'draft'
    },
    sentTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    sentAt: Date
}, { timestamps: true });

module.exports = mongoose.model('RFP', rfpSchema);
