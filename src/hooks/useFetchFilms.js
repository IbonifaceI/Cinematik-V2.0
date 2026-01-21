import { useCallback, useState, useEffect } from 'react';

const LIMIT_PAGE_COUNT = 5; 

const useFetchFilms = () => {
  const [films, setFilms] = useState([]);

  const fetchData = useCallback(async () => {
    let allFilms = [];

    for (let i = 1; i <= LIMIT_PAGE_COUNT; i++) {
      try {
        const response = await fetch(
          `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=${i}`,
          {
            method: 'GET',
            headers: {
              'X-API-KEY': '958cfa84-f2c9-4249-af44-b8eda2b8e45a',
              'Content-Type': 'application/json'
            },
          }
        );

        if (!response.ok) throw new Error("Ошибка сервера");

        const data = await response.json();
        if (data.items) {
          allFilms.push(...data.items); 
        }
      } catch (err) {
        console.error(`Ошибка при загрузке страницы ${i}:`, err.message);
      }
    }

    setFilms(allFilms.slice(0, 100));
  }, []);

  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

  return films;
};

export default useFetchFilms;