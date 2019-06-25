import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Place from '../../../../../classes/place-class';

const PlaceOfInterest = ({ place }) => (
  <div className="place-of-interest">
    <Tooltip title={place.name} position="bottom" trigger="mouseenter">
      <i className={'fas fa-' + place.types[0].fontAwesomeIcon} />
    </Tooltip>
  </div>
);

PlaceOfInterest.propTypes = {
  place: PropTypes.instanceOf(Place).isRequired
};

export default PlaceOfInterest;
