import React from 'react';

const FilmDetailsPopup = ({ film, isOpen, closePopup }) => {
  if (!isOpen || !film) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{film.title}</h2>
        <p><strong>Год:</strong> {film.year}</p>
        <p><strong>Рейтинг:</strong> {film.rating}/10</p>
        <p><strong>Описание:</strong> {film.description}</p>
        <button onClick={closePopup}>Закрыть</button>
      </div>
    </div>
  );
};

export default FilmDetailsPopup;