import React, { useState } from 'react';
import FilmsList from './components/FilmsList';
import SearchBar from './components/SearchBar';
import logo from './images/logo.png';
import Modal from './components/Modal';
import useFetchFilms from './hooks/useFetchFilms';
import './App.css';

// Основной компонент приложения
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [searchResults, setSearchResults] = useState([]); 

  const films = useFetchFilms(currentPage); 

  const openDetails = film => {
    setSelectedFilm(film);
  };

  const closeModal = () => {
    setSelectedFilm(null);
  };

  const handleSearch = async term => {
    if (term === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': '958cfa84-f2c9-4249-af44-b8eda2b8e45a', 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Ошибка сервера");

      const data = await response.json();
      if (data.films) {
        setSearchResults(data.films);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Ошибка при поиске:', err.message);
    }
  };

  return (
    <>
      <header className="app-header">
        <img src={logo} alt="Логотип" />
        <SearchBar onSearch={handleSearch} searchResults={searchResults} /> 
      </header>
      <main>
        <FilmsList 
          films={films} 
          openDetails={openDetails} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />
        <Modal isOpen={!!selectedFilm} closeModal={closeModal} film={selectedFilm} />
      </main>
    </>
  );
};

export default App;