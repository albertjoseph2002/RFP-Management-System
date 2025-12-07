# RFP Management System

An AI-powered Request for Proposal (RFP) management system that helps businesses automate the creation, distribution, and analysis of RFPs.

## Features
- **Create RFPs**: Generate structured RFPs from natural language descriptions using AI.
- **Vendor Management**: Send RFPs to selected vendors via email.
- **Proposal Parsing**: Automatically parse incoming vendor proposals from emails (simulated).
- **AI Comparison**: Compare multiple proposals side-by-side with AI-generated recommendations and scoring.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [OpenAI API Key](https://platform.openai.com/)

## Installation

### 1. clone the repository
```bash
git clone <repository_url>
cd rfp-management-system
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rfp-system
OPENAI_API_KEY=your_openai_api_key_here
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_HOST=imap.example.com
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

You need to run the backend and frontend in separate terminal windows.

### Terminal 1: Backend
```bash
cd backend
node server.js
```
The server will start on `http://localhost:5000`.

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
The application will open at `http://localhost:5173`.

## Usage
1.  **Dashboard**: View all existing RFPs.
2.  **Create RFP**: Enter a description (e.g., "I need 50 laptops for developers") and let AI structure it.
3.  **Send to Vendors**: Select vendors from the list and send the RFP.
4.  **View Proposals**: Once proposals are received (or manually entered for testing), view them in the RFP detail view.
5.  **Compare**: Click the "Comparison" tab to see an AI-generated analysis of the best vendor.
