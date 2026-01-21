import React from 'react';

const SearchResults = ({ results, isVisible }) => {
  if (!isVisible || !results || results.length === 0) {
    return null;
  }

  return (
    <ul className="search-results-list">
      {results.map((result) => (
        <li key={result.filmId}>{result.nameRu}</li>
      ))}
    </ul>
  );
};

export default SearchResults;