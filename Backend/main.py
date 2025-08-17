import os # Import necessary modules
from flask import Flask, request, jsonify  # Import Flask core and helper functions  
from movie_service import search_movie, get_movie_details  # Import movie logic from separate file
from gpt_service import chat_about_movie # Import GPT chat logic from separate file
import openai  # Add OpenAI import for new API

# ! Step 1: Define the Flask application instance
app = Flask(__name__)

# ! Step 2: Define the root endpoint for the base URL
@app.route("/")  # When someone visits the base URL, this function will run

# ! Step 3: Define the root function
def root(): 
    # ! Step 4: Return a JSON message confirming the backend is running
    return jsonify({"message": "Backend is running!"})

                # * MOVIE DETAILS ENDPOINT search movie endpoint
@app.route("/search_movie") 
def search_movie_route():  
    # ! Step 3: Get the "query" parameter from the URL (search term)
    query = request.args.get("query", "").strip()  

    # ! Step 4: If query is empty, return an error response with status 400 (Bad Request)
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Call the movie_service function to get search results
    results = search_movie(query)  

    # ! Step 5: If TMDB API call failed, return an error with status 500
    if results is None: 
        return jsonify({"error": "Failed to fetch data from TMDB"}), 500

    # ! Step 6: Return the filtered movie data as a JSON response to the frontend
    return jsonify({"results": results}) 

                # * MOVIE DETAILS ENDPOINT movie details endpoint
@app.route("/movie/<int:movie_id>")  
def movie_details_route(movie_id): 
    details = get_movie_details(movie_id)  

    # ! Step 2: If TMDB API call failed, return an error with status 500
    if details is None:
        return jsonify({"error": "Failed to fetch movie details from TMDB"}), 500

    # ! Step 3: Return the movie details as json
    return jsonify(details) 

               # * GPT CHAT ENDPOINT chat about movie endpoint
@app.route("/chat", methods=["POST"]) 
def chat_route():  
    # ! Step 1: Get JSON data sent by frontend
    data = request.get_json()  

    # ! Step 2: Extract what we need from that data.
    movie_id = data.get("movie_id")  
    user_message = data.get("user_message") 

    # ! Step 3: Validate that both movie_id and user_message are present
    if not movie_id or not user_message:
        return jsonify({"error": "movie_id and user_message are required"}), 400

    # ! Step 4: Use gpt_service.py to get a GPT response about the movie
    try:
        result = chat_about_movie(movie_id, user_message)  # Call the helper function
        return jsonify(result)  # Return the GPT response as JSON
    except Exception as e:
        # ! Step 5: Handle any errors 
        return jsonify({"error": str(e)}), 500

# ! Step FINALE: Run the Flask app in debug mode if this script is executed directly
if __name__ == "__main__":
   app.run(debug=True)  
