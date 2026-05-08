# 🌧️ RainQuote

RainQuote is a modern, full-stack application designed to provide categorized inspiration and AI-powered interactions. Whether you need a motivational boost, a quick laugh, or a moment of reflection, RainQuote delivers beautifully curated quotes and a smart AI assistant to chat with.

## 🎥 Video Demo

<video src="Frontend/public/DemoRainQuote.mp4" width="100%" controls>
  Your browser does not support the video tag.
</video>

> [!TIP]
> If the video doesn't play above, you can watch it here: [Google Drive Video Demo](https://drive.google.com/file/d/1U-YjCV7WKRy3yqtiUv7nCSwN5hxwEt4M/view?usp=sharing)

## ✨ Features

- **🔐 User Authentication**: Secure login and registration system using JWT and HTTP-only cookies.
- **📚 Categorized Quotes**: Explore quotes across multiple categories:
  - Motivational
  - Funny
  - Romantic
  - Faith
- **🤖 AI Chat Assistant**: Integrated AI chatbot to help you find specific quotes, discuss your mood, or just have a conversation.
- **💻 Responsive Dashboard**: A clean and intuitive UI for managing your quotes and interacting with the AI.
- **🐳 Docker Ready**: Simplified deployment using Docker containers for both Frontend and Backend.

## 🛠️ Tech Stack

### Frontend
- **React (v19)**: Modern UI components and hooks.
- **Material UI (MUI)**: Sleek design and icons.
- **Lucide React**: Beautiful iconography.
- **Axios**: API communication.

### Backend
- **Node.js & Express**: Robust server-side logic.
- **MongoDB**: NoSQL database for users and session storage.
- **Groq SDK & OpenAI**: Powering the AI chat functionality.
- **Cheerio**: For quote scraping/utility.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB (Running locally or via Atlas)
- Groq/OpenAI API Keys

### Local Setup

#### 1. Backend
```bash
cd Backend
npm install
# Create a .env file based on .env.example
npm run dev
```

#### 2. Frontend
```bash
cd Frontend
npm install
npm start
```

## 🐳 Docker Deployment

You can run the entire stack using the provided `Dockerfile`.

```bash
docker build -t rainquote .
docker run -p 8081:8081 rainquote
```

---
*Created with ❤️ by the RainQuote Team.*
