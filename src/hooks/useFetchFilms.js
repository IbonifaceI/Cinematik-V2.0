import { useCallback, useState, useEffect } from 'react';

const useFetchFilms = ({
  countriesId,
  genresId,
  yearFrom,
  yearTo,
  ratingFrom,
  ratingTo,
}) => {
  const [films, setFilms] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        order: 'RATING',
        type: 'ALL',
        ratingFrom: ratingFrom || 0,
        ratingTo: ratingTo || 10,
        yearFrom: yearFrom || 1000,
        yearTo: yearTo || 3000,
        page: 1,
      });

      if (countriesId) params.set('countries', countriesId);
      if (genresId) params.set('genres', genresId);

      const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': 'ba8069b6-e380-47d4-8ff0-c4808fe2ae29',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("Ошибка сервера");

      const data = await response.json();
      if (data.items) {
        setFilms(data.items);
      }
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err.message);
    }
  }, [countriesId, genresId, yearFrom, yearTo, ratingFrom, ratingTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(
          'https://kinopoiskapiunofficial.tech/api/v2.2/films/filters',
          {
            method: 'GET',
            headers: {
              'X-API-KEY': 'ba8069b6-e380-47d4-8ff0-c4808fe2ae29',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error("Ошибка сервера");

        const data = await response.json();
        setFilters(data);
      } catch (err) {
        console.error('Ошибка при получении фильтров:', err.message);
      }
    };

    fetchFilters();
  }, []);

  return { films, filters };
};

export default useFetchFilms;