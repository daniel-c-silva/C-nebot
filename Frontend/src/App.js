// ! Step 1: Import React's useState hook from the React library
// ? Why: useState is a special React function (called a Hook) that lets us create variables that the UI will automatically update when their values change.
//      Without useState, we couldn't have dynamic input fields, search results, or chat messages that refresh instantly.
import { useState } from 'react'; 
import logo from './assets/logo.png';

// * the dfifference between a state variable and a regular variable is the fact that a state variable can change realtime in frontend, whilst a regular variable could only change console logs.

// ! Step 2: Define our main React component named App
// Why: This is the "root" component for our movie search interface. It contains both the data logic (functions, API calls) and the UI layout (JSX).
function App() { 

  // * ================================
  // *                     SECTION: STATE VARIABLES
  // * ================================

  //  * The layout of these functions is:
  // const [variableName, setVariableName] = useState(initialValue); 
  // explained:
  // - variableName: the current value of this state variable
  // - setVariableName: a function to update the variableName when the user interacts with the UI this will be defined in the JSX part
  // - useState(initialValue): initializes the variableName with initialValue (an empty string))

  // ! Step 1: Create a state variable to store the user's search input
  // query = the current value typed by the user in the search box (starts as empty string "")
  // setQuery = a function that updates the query variable when the user types
  // Why: We store the search text in state so React can automatically re-render the page whenever the user changes the search term.
  const [query, setQuery] = useState(""); // "" means nothing typed yet

  // ! Step 2: Create a state variable to hold the list of movies returned by the backend search API
  // results = array of movies from backend (starts empty)
  // setResults = function to update results after a search
  // Why: We keep search results in state so that when new results arrive from the server, React updates the UI automatically.
  const [results, setResults] = useState([]); // [] means no results yet
  
  // ! Step 3: Create a state variable for the selected movie's detailed information
  // selectedMovie = object containing details about one movie, or null if no movie is selected
  // setSelectedMovie = function to update selectedMovie
  // Why: We use this to show the "movie details" view when a user clicks a movie in the search results.
  const [selectedMovie, setSelectedMovie] = useState(null); // null = nothing selected yet

  // ! Step 4: Create state variables for GPT chat
  // chatMessage = what the user types into the GPT chat box
  // chatResponse = what GPT sends back in reply
  // Why: Storing these in state ensures that the chat area updates live without a page reload.
  const [chatMessage, setChatMessage] = useState(""); 
  const [chatResponse, setChatResponse] = useState(""); 

  // ! BASE URL for backend requests
  // ? In development, this can be localhost, but in Vercel production, it should be the deployed API endpoint
  const BASE_URL = 'https://c-nebot.onrender.com'; // If empty, will call relative paths

  // * ================================
  // *                    SECTION: FUNCTIONS (LOGIC)
  // * ================================

  // ! Step 1: Function to search for movies using the backend's /search_movie endpoint
  // ? This is an asynchronous function, meaning it runs in the background without freezing the UI.
  // Why: We call this when the user clicks "Search" so we can get movie results from the backend.
  // * FETCH API CALL WORKS AS URL COMMUNICATION INSTEAD OF SAME RUNTIME IMPORTS
  const searchMovies = async () => {
    try {
      // * Build and send a GET request to the backend, including the search query in the URL
      const response = await fetch(`${BASE_URL}/search_movie?query=${encodeURIComponent(query)}`);

      // Convert the JSON response body into a JavaScript object
      const data = await response.json();

      // Update our results state with the movies from the backend
      setResults(data.results || []); // safe fallback to empty array

      // Clear any previously selected movie because we’re showing fresh search results now
      setSelectedMovie(null);
    } catch (error) {
      // If anything goes wrong (network error, JSON error), log it for debugging
      console.error("Error fetching movies:", error);
      setResults([]); // clear old results
    }
  };

  // ! Step 2: Function to fetch details for a single movie by ID
  // Why: We call this when the user clicks a movie in the results list so we can display more info.
  const fetchMovieDetails = async (movieId) => {
    if (!movieId) {
      console.error("movieId is undefined!");
      return;
    }

    try {
      // * Request movie details from the backend
      const response = await fetch(`${BASE_URL}/movie/${movieId}`);

      const data = await response.json();  // Convert JSON to JS object

      // Save this movie’s details into state so we can display them
      setSelectedMovie(data || null);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setSelectedMovie(null);
    }
  };

  // ! Step 3: Function to send a chat message to GPT for the selected movie
  // Why: This sends the movie ID and user’s question to the backend /chat endpoint and displays GPT's reply.
  const sendChatMessage = async () => {
    try {
      // 1. Stop if chat box is empty
      if (!chatMessage.trim()) {
        console.error("Chat message is empty. Please type something.");
        return;
      }

      // 2. Stop if no movie is selected
      if (!selectedMovie?.id) {
        console.error("No movie selected. Please select a movie before chatting.");
        return;
      }

      // * 3. Send POST request to backend with movie ID and user message
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: selectedMovie.id,
          user_message: chatMessage
        }),
      });

      // 4. If backend returns error status (not 200 OK)
      if (!response.ok) {
        const text = await response.text(); // Raw text in case it’s not JSON
        console.error(`Backend returned an error: ${response.status}`, text);
        setChatResponse(`Error: Backend returned status ${response.status}\n${text}`);
        return;
      }

      // 5. Try to parse JSON safely
      let data;
      try {
        data = await response.json();
      } catch {
        // If not JSON, fallback to raw text
        const text = await response.text();
        setChatResponse(text || "No response from backend");
        return;
      }

      // ! CHANGE MADE HERE: More flexible handling of backend response formats
      // ? Why: Sometimes backend might return { reply: "..."} or { response: "..."} or even a plain string.
      //        This ensures we always show a clean, readable message instead of raw JSON or keys.
      // * Logic:
      // - If reply exists, show it.
      // - Else if response exists, show that.
      // - Else if it's a string, show it.
      // - Else fallback to stringified JSON.
      setChatResponse(
        data.reply || data.response || (typeof data === "string" ? data : JSON.stringify(data))
      );

    } catch (error) {
      // If there’s a network error or unexpected problem, log and show message
      console.error("Network or other error sending chat message:", error);
      setChatResponse(`Network or other error: ${error.message}`);
    }
  };

  // * ================================
  // *                        SECTION: UI (JSX)
  // * ================================

// ! Step 1: Return the JSX (HTML-like syntax) describing how the UI should look
// Why: JSX lets us mix HTML and JavaScript so the UI updates automatically based on our state variables.
return (
  <div
    style={{
         fontFamily: "'Roboto Mono', monospace",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    /* background removed so body gradient shows through */
    color: "#e0e0e0",
    minHeight: "100vh",
    }}
  >
    {/* Page Title */}
    <h1
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "35px",
        textShadow: "0 0 6px #7f5af0, 0 0 10px #9d7eff",
      }}
    >
      <img
        src={logo}
        alt="C-neBot Logo"
        style={{
          width: "220px",
          height: "220px",
          filter: "drop-shadow(0 0 6px #7f5af0) drop-shadow(0 0 12px #9d7eff)",
        }}
      />
    </h1>

    {/* Search Section */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginBottom: "40px",
      }}
    >
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "16px 22px",
          borderRadius: "40px",
          border: "2px solid #7f5af0",
          fontSize: "16px",
          width: "70%",
          background: "rgba(11,11,23,0.85)",
          color: "#fff",
          boxShadow: "0 0 8px #7f5af0 inset",
          outline: "none",
          transition: "all 0.3s",
        }}
      />
      <button
        onClick={searchMovies}
        style={{
          padding: "16px 26px",
          background: "linear-gradient(90deg, #7f5af0, #9d7eff, #c3a0ff)",
          color: "#fff",
          border: "none",
          borderRadius: "40px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 0 8px #7f5af0",
          transition: "transform 0.3s, opacity 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Search
      </button>
    </div>

    {/* Search Results */}
    {!selectedMovie ? (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((movie) => (
          <li
            key={movie.id}
            onClick={() => fetchMovieDetails(movie.id)}
            style={{
              cursor: "pointer",
              marginBottom: "20px",
              padding: "20px",
              background: "linear-gradient(145deg, #121125, #1b1b36)",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(127,90,240,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 0 14px #7f5af0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(127,90,240,0.2)";
            }}
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={`${movie.title} poster`}
                style={{ borderRadius: "12px", border: "2px solid #7f5af0" }}
              />
            )}
            <div>
              <strong style={{ fontSize: "16px", color: "#9d7eff" }}>
                {movie.title}
              </strong>
              <div style={{ fontSize: "14px", color: "#aaa" }}>
                ({movie.release_date})
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <>
        {/* Movie Details */}
        <div
          style={{
            marginTop: "30px",
            background: "linear-gradient(145deg, #1b1b36, #121125)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 0 16px rgba(127,90,240,0.2)",
            textAlign: "center",
          }}
        >
          {selectedMovie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
              alt={`${selectedMovie.title} poster`}
              style={{
                borderRadius: "20px",
                marginBottom: "20px",
                border: "2px solid #7f5af0",
                boxShadow: "0 0 12px #7f5af0",
              }}
            />
          )}
          <h2 style={{ color: "#9d7eff" }}>{selectedMovie.title}</h2>
          <p><strong>Overview:</strong> {selectedMovie.overview}</p>
          <p><strong>Release Date:</strong> {selectedMovie.release_date}</p>
          <p><strong>Rating:</strong> {selectedMovie.vote_average}</p>

          {/* Chat Section */}
          <div style={{ marginTop: "25px", textAlign: "left" }}>
            <h3 style={{ color: "#7f5af0" }}>Ask about this movie:</h3>
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "2px solid #7f5af0",
                fontSize: "14px",
                marginBottom: "14px",
                background: "rgba(11,11,23,0.9)",
                color: "#fff",
                boxShadow: "inset 0 0 6px #7f5af0",
                resize: "none",
              }}
              placeholder="Ask something about this movie..."
            />
            <button
              onClick={sendChatMessage}
              style={{
                padding: "12px 20px",
                background: "linear-gradient(90deg, #6ab7ff, #82cfff, #b3e5fc)",
                color: "#121125",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 0 8px #6ab7ff",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Send
            </button>
            {chatResponse && (
              <div
                style={{
                  marginTop: "14px",
                  background: "rgba(11,11,23,0.9)",
                  padding: "14px",
                  borderRadius: "14px",
                  boxShadow: "0 0 8px #7f5af0",
                }}
              >
                <strong>C-neBot:</strong>
                <p>{chatResponse}</p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={() => setSelectedMovie(null)}
            style={{
              marginTop: "22px",
              padding: "12px 20px",
              background: "linear-gradient(90deg, #7f5af0, #9d7eff, #c3a0ff)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              boxShadow: "0 0 8px #7f5af0",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Back to results
          </button>
        </div>
      </>
    )}
  </div>
);

}
// ! Step FINALE: Export this component so it can be imported in index.js and rendered on the page
export default App;
