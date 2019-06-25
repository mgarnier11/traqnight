import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import LoadingOverlay from 'react-loading-overlay';

import PlaceOfInterest from '../PlaceOfInterest/PlaceOfInterest';
import Place from '../../../../../classes/place-class';

const Map = ({ loading, center, places }) => (
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
      defaultZoom={13}
    >
      {places.map(place => {
        return (
          <PlaceOfInterest {...place.location} place={place} key={place._id} />
        );
      })}
    </GoogleMapReact>
  </LoadingOverlay>
);

Map.propTypes = {
  loading: PropTypes.bool.isRequired,
  center: PropTypes.objectOf(PropTypes.number).isRequired,
  //handleButtonClick: PropTypes.func.isRequired,
  places: PropTypes.arrayOf(PropTypes.instanceOf(Place)).isRequired
};

export default Map;
