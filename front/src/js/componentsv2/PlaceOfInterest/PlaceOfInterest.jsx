import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Place from '../../../../../classes/place-class';

const PlaceOfInterest = ({ place, selected, onClick }) => (
  <div
    className={'place-of-interest' + (selected ? '-s' : '')}
    onClick={() => onClick(place)}
  >
    <Tooltip title={place.name} position="bottom" trigger="mouseenter">
      <i className={'fas fa-' + place.types[0].fontAwesomeIcon} />
    </Tooltip>
  </div>
);

PlaceOfInterest.propTypes = {
  place: PropTypes.instanceOf(Place).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default PlaceOfInterest;
