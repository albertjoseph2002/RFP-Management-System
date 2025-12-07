const Imap = require('imap');
const { simpleParser } = require('mailparser');
const Proposal = require('../models/Proposal');
const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const { parseVendorProposal } = require('./aiService');

let pollingInterval;

function startPolling() {
    pollingInterval = setInterval(checkForNewEmails, 120000);
    console.log('Email polling started');
}

async function checkForNewEmails() {
    const imap = new Imap({
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: true
    });

    imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
            if (err) throw err;

            imap.search(['UNSEEN'], (err, results) => {
                if (err) throw err;

                if (results.length === 0) {
                    imap.end();
                    return;
                }

                const fetch = imap.fetch(results, { bodies: '' });

                fetch.on('message', (msg) => {
                    msg.on('body', (stream) => {
                        simpleParser(stream, async (err, parsed) => {
                            if (err) throw err;

                            await processVendorEmail(parsed);
                        });
                    });
                });

                fetch.once('end', () => {
                    imap.end();
                });
            });
        });
    });

    imap.once('error', (err) => {
        console.error('IMAP error:', err);
    });

    imap.connect();
}

async function processVendorEmail(email) {
    try {
        const rfpIdMatch = email.text.match(/RFP ID: ([a-f0-9]{24})/);
        if (!rfpIdMatch) return;

        const rfpId = rfpIdMatch[1];
        const rfp = await RFP.findById(rfpId);
        if (!rfp) return;

        const vendor = await Vendor.findOne({ email: email.from.value[0].address });
        if (!vendor) return;

        const existingProposal = await Proposal.findOne({ rfpId, vendorId: vendor._id });
        if (existingProposal) return;

        const parsedData = await parseVendorProposal(email.text, rfp.structuredData);

        const proposal = new Proposal({
            rfpId,
            vendorId: vendor._id,
            rawEmailContent: email.text,
            parsedData,
            receivedAt: new Date(),
            status: 'parsed'
        });

        await proposal.save();
        console.log(`New proposal saved from ${vendor.name} for RFP ${rfpId}`);
    } catch (error) {
        console.error('Error processing vendor email:', error);
    }
}

module.exports = { startPolling };
