# AI Prompt Design & Documentation

This document outlines the design decisions, assumptions, and reasoning behind the AI prompts used in the RFP Management System. The system uses OpenAI's GPT models to handle unstructured text parsing and complex decision-making tasks.

## 1. RFP Extraction (`parseRFPFromNaturalLanguage`)

### Purpose
To convert a user's free-text description of their procurement needs into a structured JSON format that the system can process and store.

### Prompt Strategy
```javascript
const prompt = `Extract structured RFP data from this procurement request:
"${userInput}"
Return ONLY valid JSON with this exact structure:
{ ...schema... }`;
```

### Design Reasoning
1.  **Strict Schema Enforcement**: The prompt explicitly defines the target JSON structure. This is critical because the output is directly consumed by the frontend and database. We avoid using "function calling" here to keep the implementation simple and universally compatible with different model versions, but reliance on "valid JSON" instructions acts as a lightweight schema enforcer.
2.  **Zero-Shot Learning**: We assume the model (GPT-3.5-Turbo) has sufficient world knowledge to understand standard procurement terms ("budget", "warranty") without needing few-shot examples.
3.  **Ambiguity Handling**: By asking for specific fields like `structuredData.items`, we implicitly ask the AI to infer missing details or group related items, shifting the cognitive load from the user to the AI.

### Assumptions
-   The user input contains enough information to infer at least a title and some line items.
-   The model will output valid JSON. (Risk: Halluncination or syntax errors are handled by a `try/catch` in the parsing logic, though a more robust solution would use OpenAI's JSON mode).

## 2. Proposal Parsing (`parseVendorProposal`)

### Purpose
To extract structured pricing and terms from unstructured vendor emails.

### Prompt Strategy
```javascript
const prompt = `Parse this vendor proposal email into structured data:
RFP Requirements: ${JSON.stringify(rfpData)}
Vendor Email: "${emailContent}"
Return ONLY valid JSON with this structure: ...`;
```

### Design Reasoning
1.  **Context Injection**: We verify that the prompt includes the *original RFP requirements*. This allows the AI to map the vendor's response (which might be vague like "Yes, we can do that") back to the specific line items requested.
2.  **Normalization**: The prompt forces unstructured text (e.g., "delivery in two weeks") into a standardized string or number format (`deliveryTime`, `totalAmount`), facilitating easier comparison later.

### Assumptions
-   The vendor's email implicitly references the RFP items in order or clearly enough for text matching.
-   The "Total Price" can be calculated or extracted if not explicitly stated.

## 3. Proposal Comparison (`compareProposals`)

### Purpose
To evaluate multiple proposals side-by-side and provide a recommendation.

### Prompt Strategy
```javascript
const prompt = `Analyze these vendor proposals for the RFP and provide recommendations:
RFP: ${JSON.stringify(rfpData)}
Proposals: ${JSON.stringify(proposalsData)}
Return ONLY valid JSON with this structure:
{
  "recommendation": "vendorId",
  "comparisonMatrix": [ ...scoring... ]
}`;
```

### Design Reasoning
1.  **Role-Playing / Expert System**: The prompt implicitly asks the AI to act as a procurement officer by requesting a "recommendation" and "reasoning".
2.  **Structured Scoring**: We invented a scoring system (0-100) for purely subjective metrics like "Completeness" or "Terms". This transforms qualitative data into quantitative data for the frontend matrix.
3.  **Data Minimization**: We map the proposal objects to a smaller subset (`vendorName`, `parsedData`) before sending to the AI to reduce token usage and noise.

### Assumptions
-   The "best" option is a balance of price, delivery, and terms. We assume a standard business heuristic (lower price + better warranty = good) unless the AI reasons otherwise.
-   The AI can detect "risk" (e.g., short warranty) even if not explicitly programmed to flag it.
