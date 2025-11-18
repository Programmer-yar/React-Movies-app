import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/search'
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to limit API calls
  // waits for 500ms of inactivity before updating the debounced value
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = '') => {
    setisLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.status_message || 'Failed to fetch movies');
      }
      console.log('Fetched Movies:', data);
      setMovies(data.results || []);
      
      // updateSearchCount();
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setisLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    // Fetch trending movies from appwrite
    // and set to state
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    } catch (error) {
      console.error('Error loading trending movies:', error);
    }
  };

  useEffect(() => {
    console.log('Search Term:', searchTerm);
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []); // no dependency array to run only once on mount

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span>You will enjoy without hassel
          </h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className='text-white'>{searchTerm}</h1>
        </header>

        <section className='trending'>
          <ul>
            {trendingMovies.map((item, index) => (
              <li key={item.$id}>
                <p>{index + 1}</p>
                <img
                  src={item.poster_url}
                  alt={item.title}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className='all-movies'>
           <h2>All Movies</h2>
          { isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                  // <p key={movie.id} className='text-white'>{movie.title}</p>
                  ))}
              </ul>
            )
          }
           {errorMessage && <p className="error-message">{errorMessage}</p>}
        </section>
      </div>
    </main>
  )
}

export default App
