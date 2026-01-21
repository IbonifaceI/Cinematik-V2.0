import React from 'react';
import './FilmCard.module.css';

const FilmCard = ({ film, openDetails }) => (
  <div className="film-card" onClick={() => openDetails(film)}>
    <img src={film.posterUrl} alt={`${film.nameRu}`} className="film-poster" />
    <h2 className="film-title">{film.nameRu}</h2>
    <p className="film-year">{film.year}</p>
    <button className="details-button" onClick={() => openDetails(film)}>Подробнее</button>
  </div>
);

export default FilmCard;