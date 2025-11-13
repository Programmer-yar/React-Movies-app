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
  
  useEffect(() => {
    console.log('Search Term:', searchTerm);
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
      </div>
    </main>
  )
}

export default App
