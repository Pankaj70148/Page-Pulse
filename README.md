# 🔍 Page Pulse

> A polished full-stack web app for auditing a website URL and generating a clear, user-friendly report.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green) ![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-646CFF)

---

## Overview

Page Pulse lets users submit a public URL and receive a quick audit report with key SEO and accessibility signals. The app is split into a Node.js/Express backend and a React/Vite frontend.

### What the app does
- Fetches a webpage and analyzes its HTML content
- Extracts useful metrics such as title, description, heading count, and word count
- Displays results in a modern and readable interface
- Handles invalid input and failed requests gracefully

---

## Features

### Backend
- REST API for URL auditing
- Request validation and error handling
- HTML parsing with Cheerio
- Security middleware with Helmet and CORS
- Rate limiting for API protection

### Frontend
- Clean, responsive form-based UI
- Loading and error states
- Report cards for audit results
- Easy-to-read output for users

---

## Tech Stack

### Backend
- Node.js
- Express
- Axios
- Cheerio
- Helmet
- CORS
- Dotenv

### Frontend
- React
- Vite
- Axios
- CSS

---

## Project Structure

```text
page-pulse/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd page-pulse
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

Open the local frontend URL shown by Vite in your browser.

---

## API Usage

### Endpoint

```http
POST /api/audit
Content-Type: application/json
```

### Request body

```json
{
  "url": "https://example.com"
}
```

### Example response

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "status": 200,
    "pageTitle": "Example Domain",
    "h1Count": 1,
    "wordCount": 17,
    "timestamp": "2026-07-25T05:59:32.657Z"
  }
}
```

---

## Contributing

Contributions are welcome. If you would like to improve the app, feel free to open a pull request or suggest enhancements.

---

## License

This project is intended for learning, demonstration, and local development purposes.
500	Server error	{"error": "Internal server error"}
Error Response Example
json
{
  "success": false,
  "error": "Invalid URL format. Please enter a valid URL including http:// or https://"
}
Health Check
http
GET /health
Response:

json
{
  "status": "ok",
  "timestamp": "2026-07-25T05:59:32.657Z"
}
🛡️ Error Handling
Backend Error Types
Error Type	Handling
Invalid URL	Validates protocol and format
Domain Not Found	Catches ENOTFOUND error
Timeout	Catches ETIMEDOUT error
Non-HTML Response	Checks content-type header
Server Errors	Global error handler
Frontend Error Display
Scenario	User Experience
Empty URL	"Please enter a URL"
Invalid URL	"Please enter a valid URL"
Network Error	"Could not reach the server"
API Error	Friendly error message from backend
🧪 Testing
Manual Testing Scenarios
✅ Happy Path
bash
# Test a valid URL
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
❌ Error Scenarios
bash
# Test invalid URL
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-url"}'

# Test non-existent domain
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://this-does-not-exist.com"}'

# Test non-HTML content
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/image.jpg"}'
Test URLs for Reference
URL	Expected Result
https://example.com	✅ Full report with all metrics
https://google.com	✅ Full report
https://github.com	✅ Full report
https://stackoverflow.com	✅ Full report
not-a-url	❌ "Invalid URL format"
https://domain-not-exist.com	❌ "Domain not found"
https://example.com/image.jpg	❌ "Non-HTML response"
🚢 Deployment
Deploy Backend (Heroku)
bash
cd backend
heroku create page-pulse-api
git push heroku main
heroku config:set TIMEOUT=10000
heroku config:set MAX_RESPONSE_SIZE=5242880
Deploy Frontend (Vercel)
bash
cd client
npm run build
vercel --prod
Deploy Frontend (Netlify)
bash
cd client
npm run build
# Drag and drop the 'dist' folder to Netlify
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow ESLint rules

Write clear commit messages

Add comments for complex logic

Update documentation accordingly

Test error handling scenarios

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Digital Heroes for the training and opportunity

OpenAI for assistance with documentation

React and Node.js communities for amazing tools

📞 Contact
Project Link: https://github.com/yourusername/page-pulse

Digital Heroes: https://digitalheroesco.com

⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!

Built with ❤️ for Digital Heroes Training Task

text

---

## 📊 Additional Resources

🎯 Checklist for Submission

□ README.md is complete and well-structured
□ All features are working
□ Error handling is robust
□ Code is clean and commented
□ Project runs without errors
□ CORS is properly configured
□ Footer credit is visible
□ Response time is showing correctly
□ All 7 metrics are displayed


🧠 Design Decisions & Architecture

Decision 1: Using Cheerio vs. DOM Parsing
Decision: Used Cheerio for HTML parsing instead of browser-based DOM parsing.

Reasoning:

Performance: Cheerio runs on the server-side with minimal overhead, making it 10-100x faster than headless browsers

Resource Efficiency: No need to spawn browser instances, reducing memory usage significantly

API Familiarity: Cheerio provides a jQuery-like API that's intuitive for developers

Scraping Focus: Designed specifically for web scraping and data extraction, making it perfect for this use case

Trade-off: Cannot execute JavaScript, but this is acceptable since we're analyzing static HTML for SEO metrics

Decision 2: Server-Side vs. Client-Side Fetching
Decision: Fetched and parsed the URL on the backend server rather than directly from the browser.

Reasoning:

CORS Bypass: Many websites block CORS requests from browsers; server-side fetching avoids this issue entirely

Security: Prevents exposing API keys or having to handle authentication client-side

Reliability: Server has better network connectivity and timeout handling

Performance: Backend can handle larger payloads and complex parsing efficiently

Trade-off: Adds latency (one extra hop) and server load, but the benefits outweigh the costs

Decision 3: Monorepo vs. Separate Repositories
Decision: Kept frontend and backend in a single repository with separate folders.

Reasoning:

Development Speed: Easier to test integration and make cross-cutting changes

Versioning: Single version number for the entire application

CI/CD Simpler: One pipeline for building and deploying both parts

Onboarding: New developers can clone one repo and get everything
