import FilmCard from './FilmCard';
import styles from './FilmsList.module.css';

const FilmsList = ({ films, openDetails, currentPage, setCurrentPage }) => {
  const itemsPerPage = 20; 
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage; 
  const indexOfLastItem = indexOfFirstItem + itemsPerPage; 
  const currentItems = films.slice(indexOfFirstItem, indexOfLastItem); 
  const totalPages = Math.ceil(films.length / itemsPerPage); 

  const changePage = (direction) => {
    let nextPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  return (
    <>
      <ul className={`${styles['films-grid']} films-grid`}>
        {currentItems.map((film) => (
          <li key={film.kinopoiskId}>
            <FilmCard film={film} openDetails={openDetails} />
          </li>
        ))}
      </ul>

      <nav aria-label="Pagination navigation">
        <button
          disabled={currentPage <= 1}
          onClick={() => changePage('prev')}
        >
          Предыдущая
        </button>

        { [...Array(totalPages).keys()].map(pageIndex => (
          <span
            key={pageIndex + 1}
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentPage(pageIndex + 1)}
            className={currentPage === pageIndex + 1 ? `${styles.activePage}` : ''}
          >
            {pageIndex + 1}
          </span>
        ))}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => changePage('next')}
        >
          Следующая
        </button>
      </nav>
    </>
  );
};

export default FilmsList;