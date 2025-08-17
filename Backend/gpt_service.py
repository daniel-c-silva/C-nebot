import os # Import necessary modules
from openai import OpenAI # Import OpenAI library for GPT-3.5 interaction
from movie_service import get_movie_details, search_movie # Import movie service functions

# API key to access OpenAI 
API_KEY = os.getenv("OPENAI_API_KEY") # put your own api key

# Creates the OpenAI client using the key
client = OpenAI(api_key=API_KEY)# * set API key for OpenAI library


def chat_about_movie(movie_id, user_message):
    """ DOCSTRING
    Given a movie ID and user message, fetch TMDB details and 
    use GPT to respond naturally.
    """ 

    # Fetch movie details from TMDB using the provided movie ID
    details = get_movie_details(movie_id)  # * using the get movie details function to fetch the movie details from TMDB using the provided movie ID and if the details are not found, return an error message
    if not details:
        return {"error": "Movie details not found"} # Handle case where movie details are not found
    
    # ! Step 1: Create a prompt for GPT using the movie details
    prompt = f"""
    The user is asking about the movie '{details.get('title')}'. 
    Movie details:
    Title: {details.get('title')}
    Overview: {details.get('overview')}
    Release Date: {details.get('release_date')}
    Rating: {details.get('vote_average')}
    Genres: {[genre['name'] for genre in details.get('genres', [])]}
    Runtime: {details.get('runtime')} minutes

    Please answer the user's question based on these details, 
    and if they ask for recommendations, use your movie knowledge.
    """

    # ! Step 2: Send the prompt to GPT and get a response using the new API
    response = client.chat.completions.create(
        model="gpt-4o-mini", # * Use the GPT-4o-mini model for generating responses
        messages=[
            {"role": "system", "content": "You are a helpful movie assistant."}, 
            {"role": "user", "content": prompt},  # Provide movie context
            {"role": "user", "content": user_message}  # User's question about the movie
        ],
        temperature=0.5,  # Set temperature for response creativity
    )

    return {"response": response.choices[0].message.content} # Extract the content of the response
    # * Return the response content from GPT, which contains the answer to the user's question about the movie
