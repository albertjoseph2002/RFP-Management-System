const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function parseRFPFromNaturalLanguage(userInput) {
  const prompt = `Extract structured RFP data from this procurement request:
  
  "${userInput}"
  
  Return ONLY valid JSON with this exact structure:
  {
    "title": "Brief title for the RFP",
    "items": [{"name": "item name", "quantity": number, "specifications": "details"}],
    "budget": number,
    "deliveryDeadline": "YYYY-MM-DD",
    "paymentTerms": "terms",
    "warrantyRequirements": "warranty details",
    "additionalRequirements": "other requirements"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
}

async function parseVendorProposal(emailContent, rfpData) {
  const prompt = `Parse this vendor proposal email into structured data:
  
  RFP Requirements: ${JSON.stringify(rfpData)}
  
  Vendor Email: "${emailContent}"
  
  Return ONLY valid JSON with this structure:
  {
    "items": [{"name": "item", "unitPrice": number, "quantity": number, "totalPrice": number}],
    "totalAmount": number,
    "deliveryTime": "time frame",
    "paymentTerms": "terms",
    "warranty": "warranty details",
    "additionalNotes": "any extra info"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
}

async function compareProposals(rfpData, proposals) {
  const proposalsData = proposals.map(p => ({
    vendorId: p.vendorId,
    vendorName: p.vendorName,
    parsedData: p.parsedData
  }));

  const prompt = `Analyze these vendor proposals for the RFP and provide recommendations:
  
  RFP: ${JSON.stringify(rfpData)}
  
  Proposals: ${JSON.stringify(proposalsData)}
  
  Return ONLY valid JSON with this structure:
  {
    "recommendation": "vendorId of recommended vendor",
    "reasoning": "detailed explanation of recommendation",
    "comparisonMatrix": [{
      "vendorId": "id",
      "vendorName": "name",
      "score": number (0-100),
      "pros": ["pro1", "pro2"],
      "cons": ["con1", "con2"],
      "priceScore": number (0-100),
      "deliveryScore": number (0-100),
      "termsScore": number (0-100),
      "completenessScore": number (0-100)
    }]
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = {
  parseRFPFromNaturalLanguage,
  parseVendorProposal,
  compareProposals
};
