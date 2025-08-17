
import os
import requests  # To make HTTP requests to external APIs (TMDB)

# this is the movie_service.py file that contains the logic for interacting with the TMDB API

# ! Step 1: Store your TMDB API key here (replace with your actual key)
TMDB_API_KEY = os.getenv("TMDB_API_KEY") # Replace with your actual TMDB API key
TMDB_BASE_URL = "https://api.themoviedb.org/3" # Base URL for TMDB API


# ! Step 1.1: Define a function to search for movies by title
def search_movie(query):
    # ! Step 2: Build the URL to call the TMDB API with your API key and the search query
    url = f"{TMDB_BASE_URL}/search/movie" # * this is telling the TMDB API that we want to search for movies when we call this endpoint(meaning the URL)

    params = { # * this is telling the TMDB API what parameters we want to send with the request, parameters are basically the data we want to send to the API for example, the API key and the search query
        "api_key": TMDB_API_KEY,  # TMDB API key so the API knows who is making the request
        "query": query # The search query for the movie title
    }

    # ! Step 2.1: Make an HTTP GET request to the TMDB API
    response = requests.get(url, params=params) # * this is making the actual request to the TMDB API with the URL and parameters we defined above and is activated when the function is called and the function is called when the user searches for a movie title

    # ! Step 2.3: If the response from TMDB is not OK (status code 200), return None (handled later)
    if response.status_code != 200: # * this checks if the response status code is not 200, which means the request was not successful
        return None # If the request was not successful, return None

    # ! Step 2.4: Parse the TMDB JSON response into a Python dictionary
    data = response.json() # * this converts the JSON response from the TMDB API into a Python dictionary so we can work with it easily

    # ! Step 2.5: Extract only the necessary movie details from TMDB data
    results = [ # * this is creating a list of dictionaries with only the necessary movie details we want to return
        {
            "id": movie["id"],  # Movie unique ID
            "title": movie["title"],  # Movie title
             # * we start using .get because these details may not be guarenteed to exist in the TMDB response, so we use .get to avoid KeyError if they are missing
            "overview": movie.get("overview", ""),  # Movie description or empty string if missing
            "poster_path": movie.get("poster_path", ""),  # Poster image path or empty string
            "release_date": movie.get("release_date", ""),  # Release date or empty string
            "vote_average": movie.get("vote_average", 0)  # Average vote or 0 if missing
        }
        for movie in data.get("results", [])  # Loop over the list of movies from TMDB response safely. the list depends on the search query and may be empty
    ]

    return results # * Return the list of movie details


# ! Step 2: Define a function to get movie details by ID
def get_movie_details(movie_id):
    # ! Step 3: Build the URL to call the TMDB API for movie details using the provided movie ID
    url = f"{TMDB_BASE_URL}/movie/{movie_id}" # * this is telling the TMDB API that we want to get details of a specific movie when we call this endpoint using the movie ID

    params = { # * this is telling the TMDB API what parameters we want to send with the request, parameters are basically the data we want to send to the API for example, the API key
        "api_key": TMDB_API_KEY # TMDB API key so the API knows who is making the request
    }

    # ! Step 3.1: Make an HTTP GET request to the TMDB API for movie details
    response = requests.get(url, params=params) # * this is making the actual request to the TMDB API with the URL and parameters we defined above and is activated when the function is called and the function is called when the user requests movie details by ID

    # ! Step 3.2: If the response from TMDB is not OK (status code 200), return None
    if response.status_code != 200: # * this checks if the response status code is not 200, which means the request was not successful
        return None # If the request was not successful, return None

    # ! Step 3.3: Parse the TMDB JSON response into a Python dictionary and return the movie details
    return response.json() # * this converts the JSON response from the TMDB API into a Python dictionary so we can work with it easily and returns the movie details
