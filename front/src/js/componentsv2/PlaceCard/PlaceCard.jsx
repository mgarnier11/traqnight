import React from 'react';
import PropTypes from 'prop-types';
import Place from '../../../../../classes/place-class';

const PlaceCard = ({ handleGoClick, handleZoomClick, place }) => (
  <div className="card">
    <div className="card-header">
      <h3>{place.name}</h3>
    </div>
    <div className="card-body">
      <p>{place.priceLevel}</p>
      <p>{place.rating}</p>
      <p>{place.address}</p>
    </div>
    <div className="card-footer">
      <button className="btn btn-secondary col-5 " onClick={handleGoClick}>
        Y aller
      </button>
      <button
        className="btn btn-secondary col-5 offset-2"
        onClick={handleZoomClick}
      >
        Zoom
      </button>
    </div>
  </div>
);

PlaceCard.propTypes = {
  //handleButtonClick: PropTypes.func.isRequired,
  place: PropTypes.instanceOf(Place).isRequired
};

export default PlaceCard;
