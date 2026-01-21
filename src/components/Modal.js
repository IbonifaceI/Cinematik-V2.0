import React from 'react';
import './Modal.module.css';

const Modal = ({ isOpen, closeModal, film }) => {
  if (!isOpen || !film) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>✕</button>
        <h2 className="modal-title">{film.nameRu || film.nameEn}</h2>
        <img src={film.posterUrl} alt={film.nameRu || film.nameEn} style={{ maxWidth: '100%', marginBottom: '1em' }} />
        <p><strong>Год:</strong> {film.year}</p>
        <p><strong>Страна:</strong> {film.countries.map(country => country.country).join(', ')}</p>
        <p><strong>Жанр:</strong> {film.genres.map(genre => genre.genre).join(', ')}</p>
      </div>
    </div>
  );
};

export default Modal;