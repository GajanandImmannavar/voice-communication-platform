# Voice Communication Platform

A full-stack real-time voice communication application designed to enable users to connect and communicate through a modern web interface, with secure authentication and AI-powered call feedback.

## Overview

Voice Communication Platform combines real-time communication technologies with AI capabilities to provide an interactive communication experience. The application includes a React-based frontend, a Node.js backend, real-time communication support, and MongoDB for data persistence.

## Key Features

- **Real-Time Communication:** Voice communication powered by WebRTC and Socket.IO.
- **User Authentication:** Secure authentication using JSON Web Tokens (JWT).
- **AI-Powered Feedback:** Integration with OpenAI to generate feedback based on call interactions.
- **Language Selection:** Language selection functionality for communication sessions.
- **Call Management:** Start, manage, and end communication sessions.
- **Feedback Management:** Store and retrieve call feedback.
- **Admin Dashboard:** Administrative reporting and call-related information.
- **Responsive Interface:** Modern frontend built with React and Tailwind CSS.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-Time Communication | WebRTC, Socket.IO |
| Authentication | JWT |
| AI Integration | OpenAI API |
| Development Tools | Git, GitHub, VS Code, Postman |

## Project Architecture

```text
voice-communication-platform/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

*The directory structure above is illustrative; adjust it to match the actual project.*

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MongoDB database
- Git
- OpenAI API key (for AI-powered feedback functionality)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/voice-communication-platform.git

cd voice-communication-platform
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory and configure the environment variables required by your backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

Use the exact variable names expected by your server configuration.

### 3. Start the Backend

```bash
npm run dev
```

### 4. Configure the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Environment Variables

Keep all credentials and sensitive configuration in environment files. Never commit actual API keys, database credentials, or JWT secrets to GitHub.

## Security

- Environment-based configuration for sensitive credentials.
- Token-based authentication.
- Backend validation and protected application functionality.

## Future Improvements

- Enhanced call quality and connection handling.
- Improved real-time communication monitoring.
- Expanded AI-powered feedback and analytics.
- Additional administrative insights.
- Automated testing and deployment workflows.

## Author

**Gajanand L Immannavar**

B.E. Artificial Intelligence and Machine Learning

- GitHub: [GajanandImmannavar](https://github.com/GajanandImmannavar)
- LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/gajanand-immannavar-a04520339/)

---

*Built to explore full-stack development, real-time communication, and AI integration.*
