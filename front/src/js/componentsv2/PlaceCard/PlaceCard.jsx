import React from 'react';
import PropTypes from 'prop-types';
import Place from '../../../../../classes/place';

const PlaceCard = ({ isDisplayed, handleButtonClick, place }) => (
  <div className={'card' + !isDisplayed ? ' d-none' : ''}>
    <div className="card-header">
      <h3>{place.name}</h3>
    </div>
    <div className="card-body">
      <p>{place.priceLevel}</p>
      <p>{place.rating}</p>
      <p>{place.address}</p>
    </div>
    <div className="card-footer">
      <button className="btn btn-secondary" onClick={handleButtonClick}>
        Y aller
      </button>
    </div>
  </div>
);

PlaceCard.propTypes = {
  isDisplayed: PropTypes.bool.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
  place: PropTypes.instanceOf(Place).isRequired
};

export default PlaceCard;
