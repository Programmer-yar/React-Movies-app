import { useState, useEffect, use } from 'react'
import './App.css'
import Search from './components/search'

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

  const fetchMovies = async () => {
    setisLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.status_message || 'Failed to fetch movies');
      }
      console.log('Fetched Movies:', data);
      setMovies(data.results || []);

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    console.log('Search Term:', searchTerm);
    fetchMovies();
  }, [searchTerm]);

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

        <section className='all-movies'>
           <h2>All Movies</h2>
          { isLoading ? (
              <p className='text-white'>Loading movies...</p>
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <p key={movie.id} className='text-white'>{movie.title}</p>
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
