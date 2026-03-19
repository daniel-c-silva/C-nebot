# C-neBot

**Search and Chat**

![A GIF of the real-time C-nebot dashboard in action](https://github.com/daniel-c-silva/C-nebot/blob/main/assets/Visualise.gif?raw=true)

## **DISCLAIMER** There's a Demo Version, How ever my API token's have ran out.

## Overview

**C-nebot** lets you search for a movie and get all details and info, it comes with a AI chat assistant that can give you extra information and recommendations.


## Features
- **Movie Search** Type a keyword, instantly pull results  
- **Movie Details** Synopses, release dates, ratings, posters  
- **AI Chat** Ask anything about a movie, get smart responses (recommendations, trivia, etc.)  


![A GIF of the real-time C-nebot dashboard in action](https://github.com/daniel-c-silva/C-nebot/blob/main/assets/Intro.gif?raw=true)

## Tech Stack

### Frontend

- React + JSX  
- Custom CSS (gradients, glowing shadows...)  

### Backend
- Python + Flask  
- TMDB API (movie data)  
- OpenAI GPT API
  

## How to Run Locally

### Prerequisites
- Python 3.8+  
- Node.js & npm  

---
## Backend Setup
```
cd backend
pip install -r requirements.txt

# Create a .env file with your API keys
TMDB_API_KEY="your_tmdb_api_key"
OPENAI_API_KEY="your_openai_api_key"

# Run the Flask server
python main.py      # Windows/Linux
python3 main.py     # macOS
```


### Frontend Setup
```
cd frontend
npm install
npm start
```

## Conclusion

This project, C-nebot is similar to a previous one I have done (chord-crafter) as it also helps process data and runs it to other API's basically working as an inside tool but this time also a chatbot, I learned TMDB api but most importantly this was my first interaction with react, and although it was hard, mostly due to syntax and the addition of things such as useStates, React has since become my go to framework for frontend.
