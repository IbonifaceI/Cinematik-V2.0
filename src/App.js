import React, { useState, useEffect } from 'react';
import FilmsList from './components/FilmsList';
import SearchBar from './components/SearchBar';
import logo from './images/logo.png';
import Modal from './components/Modal';
import useFetchFilms from './hooks/useFetchFilms';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [genresIds, setGenresIds] = useState([]);
  const [countriesIds, setCountriesIds] = useState([]);
  const [yearRange, setYearRange] = useState(['', '']);
  const [ratingRange, setRatingRange] = useState(['', '']);
  const [validationError, setValidationError] = useState('');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filtersData, setFiltersData] = useState({});
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Получаем фильмы и фильтры с учётом новых параметров
  const { films, filters } = useFetchFilms({
    countriesId: countriesIds.join(','),
    genresId: genresIds.join(','),
    yearFrom: yearRange[0],
    yearTo: yearRange[1],
    ratingFrom: ratingRange[0],
    ratingTo: ratingRange[1],
  });

  useEffect(() => {
    setFiltersData(filters);
    setLoading(false);
  }, [filters]);

  const openDetails = film => {
    setSelectedFilm(film);
  };

  const closeModal = () => {
    setSelectedFilm(null);
  };

  const handleSearch = async term => {
    if (term === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/search-by-keyword?keyword=${encodeURIComponent(term)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.REACT_APP_KINO_API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error(`Ошибка сервера (${response.status}). Возможно проблема с доступом к API.`);

      const data = await response.json();
      if (data.films) {
        setSearchResults(data.films);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Ошибка при поиске:', err.message);
      setValidationError(err.message);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === 'genres') {
      if (checked) {
        setGenresIds([...genresIds, Number(value)]);
      } else {
        setGenresIds(genresIds.filter(id => id !== Number(value)));
      }
    } else if (name === 'countries') {
      if (checked) {
        setCountriesIds([...countriesIds, Number(value)]);
      } else {
        setCountriesIds(countriesIds.filter(id => id !== Number(value)));
      }
    }
  };

  const handleYearChange = (index, event) => {
    const values = [...yearRange];
    values[index] = event.target.value.trim(); // Удаляем пробелы
    setYearRange(values);
  };

  const handleRatingChange = (index, event) => {
    const values = [...ratingRange];
    values[index] = event.target.value.trim(); // Удаляем пробелы
    setRatingRange(values);
  };

  const validateForm = () => {
    let errors = [];
    if (yearRange.some(val => val !== '' && !(/^\d+$/.test(val)))) {
      errors.push('Годы должны быть целыми числами.');
    }
    if (ratingRange.some(val => val !== '' && !(val >= 1 && val <= 10))) {
      errors.push('Значения рейтинга должны находиться в пределах от 1 до 10.');
    }
    return errors.join('\n');
  };

  const applyFilters = async () => {
    const validationErrors = validateForm();
    if (validationErrors) {
      setValidationError(validationErrors);
      return;
    }

    try {
      let baseUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films';
      let params = [
        'order=RATING',
        'type=ALL',
        `ratingFrom=${ratingRange[0] || 0}`,
        `ratingTo=${ratingRange[1] || 10}`,
        `yearFrom=${yearRange[0] || 1000}`,
        `yearTo=${yearRange[1] || 3000}`,
        'page=1'
      ];

      if (genresIds.length > 0) {
        params.push(`genres=${genresIds.join(',')}`);
      }
      if (countriesIds.length > 0) {
        params.push(`countries=${countriesIds.join(',')}`);
      }

      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      const fullUrl = `${baseUrl}${queryString}`;

      setLoading(true); // Начинаем загрузку
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.REACT_APP_KINO_API_KEY,
        },
      });

      if (!response.ok) throw new Error(`Ошибка сервера (${response.status}). Возможно проблема с доступом к API.`);

      const data = await response.json();
      if (data.films) {
        setFilteredFilms(data.films); // Обновляем итоговый список фильмов
      } else {
        setFilteredFilms([]);
      }
      setLoading(false); // Загрузка завершилась
    } catch (err) {
      console.error('Ошибка при применении фильтров:', err.message);
      setValidationError(err.message);
      setLoading(false); // Ошибка произошла, завершили ожидание
    }
  };

  const handleReset = () => {
    setGenresIds([]);
    setCountriesIds([]);
    setYearRange(['', '']);
    setRatingRange(['', '']);
    setValidationError('');
    setFilteredFilms([]);
    setCurrentPage(1);
  };

  return (
    <>
      <header className="app-header">
        <img src={logo} alt="Logo" />
        <SearchBar onSearch={handleSearch} searchResults={searchResults} />
      </header>
      <main>
        <div className="filter-container">
          {/* Блок выбора жанра */}
          <div className="filter-section">
            <label htmlFor="genres" onClick={() => setShowGenreDropdown(!showGenreDropdown)}>
              Жанры:{" "}
              {showGenreDropdown ? '(Скрыть)' : '(Показать)'}
            </label>
            {showGenreDropdown && (
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filtersData.genres?.map((genre) => (
                  <label key={genre.id}>
                    <input
                      type="checkbox"
                      name="genres"
                      value={genre.id.toString()}
                      checked={genresIds.includes(genre.id)}
                      onChange={handleFilterChange}
                      style={{
                        backgroundColor: genresIds.includes(genre.id) ? '#fcf8e3' : 'transparent', // Цвет фона для отметок
                        border: genresIds.includes(genre.id) ? '1px solid #ffc107' : 'none' // Рамка вокруг активной опции
                      }}
                    />
                    {genre.genre}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Блок выбора страны */}
          <div className="filter-section">
            <label htmlFor="countries" onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
              Страны:{" "}
              {showCountryDropdown ? '(Скрыть)' : '(Показать)'}
            </label>
            {showCountryDropdown && (
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {filtersData.countries?.map((country) => (
                  <label key={country.id}>
                    <input
                      type="checkbox"
                      name="countries"
                      value={country.id.toString()}
                      checked={countriesIds.includes(country.id)}
                      onChange={handleFilterChange}
                      style={{
                        backgroundColor: countriesIds.includes(country.id) ? '#fcf8e3' : 'transparent', // Цвет фона для отметок
                        border: countriesIds.includes(country.id) ? '1px solid #ffc107' : 'none' // Рамка вокруг активной опции
                      }}
                    />
                    {country.country}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Выбор диапазона годов */}
          <div className="filter-section">
            <label htmlFor="year-from">От года:</label>
            <input
              type="number"
              min="1000"
              max="3000"
              step="1"
              id="year-from"
              name="year-from"
              value={yearRange[0]}
              onChange={(e) => handleYearChange(0, e)}
              className={`${yearRange[0].trim() !== '' ? 'active-filter' : ''}`}
            />
            <label htmlFor="year-to">До года:</label>
            <input
              type="number"
              min="1000"
              max="3000"
              step="1"
              id="year-to"
              name="year-to"
              value={yearRange[1]}
              onChange={(e) => handleYearChange(1, e)}
              className={`${yearRange[1].trim() !== '' ? 'active-filter' : ''}`}
            />
          </div>

          {/* Выбор диапазона рейтингов */}
          <div className="filter-section">
            <label htmlFor="rating-from">От рейтинга:</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              id="rating-from"
              name="rating-from"
              value={ratingRange[0]}
              onChange={(e) => handleRatingChange(0, e)}
              className={`${ratingRange[0].trim() !== '' ? 'active-filter' : ''}`}
            />
            <label htmlFor="rating-to">До рейтинга:</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              id="rating-to"
              name="rating-to"
              value={ratingRange[1]}
              onChange={(e) => handleRatingChange(1, e)}
              className={`${ratingRange[1].trim() !== '' ? 'active-filter' : ''}`}
            />
          </div>

          <div className="filter-buttons">
            <button onClick={applyFilters}>Применить фильтры</button>
            <button onClick={handleReset}>Сбросить фильтры</button>
          </div>

          {validationError && <p className="validation-error">{validationError}</p>}
        </div>

        {!loading && ( // Отображаем список фильмов только после окончания загрузки
          <FilmsList
            films={
              filteredFilms.length > 0
                ? filteredFilms
                : films
            }
            openDetails={openDetails}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        {loading && <h3>Загрузка...</h3>}

        <Modal isOpen={!!selectedFilm} closeModal={closeModal} film={selectedFilm} />
      </main>
    </>
  );
};

export default App;