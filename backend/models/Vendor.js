const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactPerson: String,
    phone: String,
    address: String,
    specializations: [String]
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
