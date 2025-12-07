const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const { parseVendorProposal } = require('../services/aiService');


router.get('/:id', async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id).populate('vendorId');
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


});


router.post('/parse', async (req, res) => {
    const { emailContent, rfpId } = req.body;
    res.json({ message: "Manual parsing endpoint" });
});

module.exports = router;
