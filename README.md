# C-neBot: Your AI-Powered Movie Assistant 

C-neBot isn’t just another movie search app — it works as an assistant for you to choose what to watch quicker.  
Search, explore and chat.

![A GIF of the real-time C-nebot dashboard in action](https://github.com/daniel-c-silva/C-nebot/blob/main/Assets/Visualise.gif?raw=true)

It holds together **React on the frontend** and a **Flask backend**, then supercharges everything with:  

- **TMDB API** → movie data on demand  
- **OpenAI GPT-4o-mini** → AI chat about movies 

---

## What It Does
- **Movie Search** → Type a keyword, instantly pull results  
- **Movie Details** → Synopses, release dates, ratings, posters  
- **AI Chat** → Ask anything about a movie, get smart responses (recommendations, trivia, vibes)  


![A GIF of the real-time C-nebot dashboard in action](https://github.com/daniel-c-silva/C-nebot/blob/main/Assets/Intro.gif?raw=true)
---

## Tech Stack

### Frontend
- React + JSX  
- Custom CSS (gradients, glowing shadows, the works)  

### Backend
- Python + Flask  
- TMDB API (movie data)  
- OpenAI GPT API (brains behind the bot)  

---

## Run It Locally

### Prerequisites
- Python 3.8+  
- Node.js & npm  

---
### Backend Setup
```
cd backend
pip install -r requirements.txt

# Run the Flask server
python main.py      # Windows/Linux
python3 main.py     # macOS

*!Optional but good for safety*
# Create a .env file in the backend folder with your API keys
TMDB_API_KEY="your_tmdb_api_key"
OPENAI_API_KEY="your_openai_api_key"

```
### Frontend Setup
```
cd frontend
npm install
npm start
