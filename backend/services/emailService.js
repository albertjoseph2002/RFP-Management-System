const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendRFPToVendors(rfp, vendors) {
    const emailPromises = vendors.map(vendor => {
        const emailBody = `
      Dear ${vendor.contactPerson},
      
      We are issuing an RFP: ${rfp.title}
      
      Requirements:
      ${JSON.stringify(rfp.structuredData, null, 2)}
      
      Please reply to this email with your proposal including:
      - Itemized pricing
      - Delivery timeline
      - Payment terms
      - Warranty information
      
      RFP ID: ${rfp._id}
      
      Best regards
    `;

        return transporter.sendMail({
            from: process.env.SMTP_USER,
            to: vendor.email,
            subject: `RFP: ${rfp.title}`,
            text: emailBody
        });
    });

    return Promise.all(emailPromises);
}

module.exports = { sendRFPToVendors };
