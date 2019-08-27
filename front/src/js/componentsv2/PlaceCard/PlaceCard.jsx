import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Place from '../../../../../classes/place-class';

const PlaceCard = ({ handleZoomClick, place }) => {
  const address = place.address.split('<br/>');

  return (
    <div className="card">
      <div className="card-header">{place.name}</div>
      <div className="card-body">
        <div className="address">{address[0]}</div>
        <div className="town">{address[1]}</div>
        <hr />
        {place.priceLevel !== undefined && place.priceLevel !== null ? (
          <Tooltip
            title={`Prix : ${place.priceLevel}`}
            position="bottom"
            trigger="mouseenter"
            arrow="true"
          >
            <div className="price-level">
              <div className="price-level-head">Prix :</div>

              <div className="back-euro">
                {[...Array(4)].map((x, i) => {
                  return <i className="fas fa-euro-sign" key={i} />;
                })}
                <div
                  className="front-euro"
                  style={{ width: `${(place.priceLevel * 100) / 4}%` }}
                >
                  {[...Array(4)].map((x, i) => {
                    return <i className="fas fa-euro-sign" key={i} />;
                  })}
                </div>
              </div>
            </div>
          </Tooltip>
        ) : (
          ''
        )}
        {place.rating !== undefined && place.rating !== null ? (
          <Tooltip
            title={`Note Moyenne : ${place.rating}`}
            position="bottom"
            trigger="mouseenter"
            arrow="true"
          >
            <div className="rating">
              <div className="rating-head">Note :</div>

              <div className="back-stars">
                {[...Array(5)].map((x, i) => {
                  return <i className="fas fa-star" key={i} />;
                })}
                <div
                  className="front-stars"
                  style={{ width: `${(place.rating * 100) / 5}%` }}
                >
                  {[...Array(5)].map((x, i) => {
                    return <i className="fas fa-star" key={i} />;
                  })}
                </div>
              </div>
            </div>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
      <div className="card-footer">
        <a
          className="btn btn-secondary col-5"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://maps.google.com/?q=${address[0]} ${address[1]} ${
            address[2]
          }`}
        >
          Y aller
        </a>

        <button
          className="btn btn-secondary col-5 offset-2"
          onClick={() => handleZoomClick(place)}
        >
          Zoom
        </button>
      </div>
    </div>
  );
};

PlaceCard.propTypes = {
  handleZoomClick: PropTypes.func.isRequired,
  place: PropTypes.instanceOf(Place).isRequired
};

export default PlaceCard;
