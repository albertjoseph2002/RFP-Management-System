const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const Proposal = require('../models/Proposal');
const Comparison = require('../models/Comparison');
const { parseRFPFromNaturalLanguage, compareProposals } = require('../services/aiService');
const { sendRFPToVendors } = require('../services/emailService');


router.post('/', async (req, res) => {
    try {
        console.log('RFP POST Request Received');
        const { description } = req.body;
        const structuredData = await parseRFPFromNaturalLanguage(description);

        const rfp = new RFP({
            title: structuredData.title,
            description,
            structuredData,
            status: 'draft'
        });

        await rfp.save();
        res.json(rfp);
    } catch (error) {
        console.error('Create RFP Error:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const rfps = await RFP.find().sort({ createdAt: -1 });
        res.json(rfps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const rfp = await RFP.findById(req.params.id);
        res.json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/:id/send', async (req, res) => {
    try {
        const { vendorIds } = req.body;
        const rfp = await RFP.findById(req.params.id);
        const vendors = await Vendor.find({ _id: { $in: vendorIds } });

        await sendRFPToVendors(rfp, vendors);

        rfp.sentTo = vendorIds;
        rfp.sentAt = new Date();
        rfp.status = 'sent';
        await rfp.save();

        res.json({ message: 'RFP sent successfully', rfp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id/proposals', async (req, res) => {
    try {
        const proposals = await Proposal.find({ rfpId: req.params.id })
            .populate('vendorId');
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id/comparison', async (req, res) => {
    try {
        const rfp = await RFP.findById(req.params.id);
        const proposals = await Proposal.find({ rfpId: req.params.id })
            .populate('vendorId');

        let comparison = await Comparison.findOne({ rfpId: req.params.id });

        if (!comparison) {
            const proposalsWithVendorNames = proposals.map(p => ({
                ...p.toObject(),
                vendorName: p.vendorId.name
            }));

            const aiAnalysis = await compareProposals(rfp.structuredData, proposalsWithVendorNames);

            comparison = new Comparison({
                rfpId: req.params.id,
                proposals: proposals.map(p => p._id),
                aiAnalysis
            });

            await comparison.save();
        }

        res.json(comparison);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
