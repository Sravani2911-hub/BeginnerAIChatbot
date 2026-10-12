A README explains what your project does, which technologies it uses, how to configure it, and how to run it. 

# Beginner AI Chatbot

A beginner-friendly AI chatbot built using Python, FastAPI, Google's Gemini API, HTML, CSS, and JavaScript.

## Features

* AI-powered conversations using Gemini
* Real-time communication between frontend and backend
* Multiple chat conversations with browser local storage
* Chat history with the ability to reopen saved conversations
* Markdown formatting for headings, bold text, and lists
* Formatted programming code blocks
* Copy Code button
* Message timestamps and typing indicator
* New Chat and Clear Chat options
* Responsive user interface

## Technologies Used

* Python
* FastAPI
* Google Gemini API
* HTML5
* CSS3
* JavaScript
* Marked.js
* DOMPurify
* Browser localStorage

## Project Structure

```text
BeginnerAIChatbot/
├── .venv/
├── .env
├── .gitignore
├── README.md
├── main.py
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Prerequisites

* Python installed
* A Gemini API key from Google AI Studio
* Internet connection
* VS Code or another code editor

## Setup Instructions

### 1. Open the project folder

Open the `BeginnerAIChatbot` folder in VS Code.

### 2. Activate the virtual environment

In Windows Command Prompt, navigate to the project folder:

```bat
cd /d E:\AIProjects\BeginnerAIChatbot
.venv\Scripts\activate
```

### 3. Install the required packages

```bat
python -m pip install fastapi python-dotenv google-genai
```

### 4. Configure the Gemini API key

Create a `.env` file in the project root:

```text
GEMINI_API_KEY=your_actual_gemini_api_key
```

Replace the example value with your own key. Never commit `.env` to GitHub or share your key publicly.

### 5. Start the application

With the virtual environment activated, run:

```bat
fastapi dev main.py
```

### 6. Open the chatbot

Visit:

http://127.0.0.1:8000

## How It Works

1. The user enters a message in the web interface.
2. JavaScript sends the message to the FastAPI `/chat` endpoint.
3. FastAPI sends the request to the Gemini API.
4. Gemini generates a response.
5. The frontend displays the response with Markdown formatting.
6. Chat conversations are saved in the browser's local storage.

## Notes

* Chat history is stored in the current browser's local storage, not in a server database.
* Keep your Gemini API key private.
* Marked.js and DOMPurify are loaded from CDN links, so an internet connection is required for those libraries.
* This is a beginner learning project and can be extended with database-backed history, authentication, and other features in the future.
