import React, { useState } from 'react';
import useDebounce from '../hooks/useDebounce';

const SearchBar = ({ onSearch, searchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(onSearch, 500); 

  const handleInputChange = (event) => {
    const newValue = event.target.value.trim(); 
    setSearchQuery(newValue);
    
    console.log('New search query:', newValue); 

    if (newValue !== '') {
      debouncedSearch(newValue); 
    } else {
      debouncedSearch(''); 
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Искать фильм..."
        value={searchQuery}
        onChange={handleInputChange}
        className="search-input"
      />
      <i className="fas fa-search search-icon"></i>

      {
        Array.isArray(searchResults) && searchResults.length > 0 && (
          <ul className="search-suggestions">
            {searchResults.map(result => (
              <li key={result.filmId} className="suggestion-item">
                <img 
                  src={`https://st.kp.yandex.net/images/film_big/${result.filmId}.jpg`} 
                  alt={result.nameRu} 
                  className="poster-thumbnail" 
                  style={{ width: '38px', height: 'auto' }} 
                />
                <div className="film-details">
                  <strong>{result.nameRu}</strong> <small>({result.year})</small>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
};

export default SearchBar;