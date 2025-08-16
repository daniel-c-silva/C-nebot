C-neBot: Your AI-Powered Movie Buddy

C-neBot isn’t just another movie search app — it’s your movie sidekick.
Search. Explore. Chat. Repeat.

It smashes together React on the frontend and a Flask backend, then supercharges everything with:

TMDB API (movie data on demand)

OpenAI GPT-4o-mini (AI chat about movies like you’re texting a geeky friend)

What It Does

Movie Search → Type a keyword, instantly pull results

Movie Details → Synopses, release dates, ratings, posters

AI Chat → Ask anything about a movie, get smart responses (recommendations, trivia, vibes)

Tech Stack

Frontend

React + JSX

Custom CSS (gradients, glowing shadows, the works)

Backend

Python + Flask

TMDB API (movie data)

OpenAI GPT API (brains behind the bot)

Run It Locally
Prerequisites

Python 3.8+

Node.js & npm

Backend Setup
cd backend
pip install -r requirements.txt


Create a .env file in the backend folder with your API keys:

TMDB_API_KEY="your_tmdb_api_key"
OPENAI_API_KEY="your_openai_api_key"


Run the Flask server:

python main.py  // python3 main.py      "if in mac"

Frontend Setup
cd frontend
npm install
npm start


Now open http://localhost:3000 and let C-neBot do its thing.
