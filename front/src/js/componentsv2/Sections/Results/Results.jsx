import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Place from '../../../../../../classes/place';
import PlaceCard from '../../PlaceCard/PlaceCard';
import { setPriceFilter, setRatingFilter } from '../../../redux/actions';

const mapStateToProps = state => {
  return { maxPrice: state.maxPrice, minRate: state.minRate };
};

function mapDispatchToProps(dispatch) {
  return {
    setPrice: maxPrice => dispatch(setPriceFilter(maxPrice)),
    setRate: minRate => dispatch(setRatingFilter(minRate))
  };
}

class Results extends Component {
  static propTypes = {
    places: PropTypes.arrayOf(PropTypes.instanceOf(Place)).isRequired,
    maxPrice: PropTypes.number.isRequired,
    minRate: PropTypes.number.isRequired
  };

  static defaultProps = {
    places: [],
    maxPrice: 0,
    minRate: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      places: props.places,
      maxPrice: props.maxPrice,
      minRate: props.minRate
    };

    this.handleChange = this.handleChange.bind(this);
    this.isPlaceDisplayed = this.isPlaceDisplayed.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.places) this.setState({ places: newProps.places });
    if (newProps.maxPrice !== undefined)
      this.setState({ maxPrice: newProps.maxPrice });
    if (newProps.minRate !== undefined)
      this.setState({ minRate: newProps.minRate });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  isPlaceDisplayed(place) {
    if (place.priceLevel > this.state.maxPrice) return false;
    if (place.rating < this.state.minRate) return false;
    return true;
  }

  render() {
    const { places, maxPrice } = this.state;

    return (
      <div className="results container">
        <div className="card-deck">
          {places.map(place => {
            return (
              <PlaceCard
                isDisplayed={this.isPlaceDisplayed(place)}
                place={place}
              />
            );
          })}
        </div>
        <div className="filters row">
          <div className="price m-1 px-3">
            <span>Prix Maximum : </span>
            {[...Array(5)].map((x, i) => {
              return (
                <i
                  className={
                    'fas fa-euro-sign' + (maxPrice + 1 > i ? '' : ' out')
                  }
                  onClick={e => this.props.setPrice(i)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
