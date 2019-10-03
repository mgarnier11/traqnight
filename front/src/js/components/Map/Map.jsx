import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import LoadingOverlay from 'react-loading-overlay';

import PlaceOfInterest from '../PlaceOfInterest/PlaceOfInterest';
import Place from '../../../../../classes/place-class';

const Map = ({ loading, center, places, zoom, zoomedPlace, onPointClick }) => (
  <LoadingOverlay
    active={loading}
    spinner
    text="Chargement..."
    className="loading-overlay"
  >
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_GOOGLE_MAP_API_KEY
      }}
      center={center}
      zoom={zoom}
    >
      {places.map(place => {
        return (
          <PlaceOfInterest
            {...place.location}
            selected={place === zoomedPlace}
            place={place}
            key={place._id}
            onClick={onPointClick}
          />
        );
      })}
    </GoogleMapReact>
  </LoadingOverlay>
);

Map.propTypes = {
  loading: PropTypes.bool.isRequired,
  center: PropTypes.objectOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  //handleButtonClick: PropTypes.func.isRequired,
  places: PropTypes.arrayOf(PropTypes.instanceOf(Place)).isRequired,
  zoomedPlace: PropTypes.instanceOf(Place),
  onPointClick: PropTypes.func.isRequired
};

export default Map;
