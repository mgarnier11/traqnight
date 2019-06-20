import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPlaces } from '../../../redux/actions/place-actions';
import Place from '../../../../../../classes/place';
import PlaceCard from '../../PlaceCard/PlaceCard';

const mapStateToProps = state => {
  return {
    placesRequest: state.placesRequest,
    places: state.placesRequest.places
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getPlaces: params => dispatch(getPlaces(params))
  };
}

class Results extends Component {
  static propTypes = {
    places: PropTypes.arrayOf(PropTypes.instanceOf(Place)).isRequired
  };

  static defaultProps = {
    places: []
  };

  constructor(props) {
    super(props);

    this.state = {
      places: props.places,
      maxPrice: 4,
      minRating: 1
    };

    this.handleChange = this.handleChange.bind(this);
    this.isPlaceDisplayed = this.isPlaceDisplayed.bind(this);

    this.setMaxPrice = this.setMaxPrice.bind(this);
    this.setMinRating = this.setMinRating.bind(this);

    this.loadMoreResults = this.loadMoreResults.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.places) this.setState({ places: newProps.places });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  setMaxPrice(i) {
    this.setState({ maxPrice: i });
  }

  setMinRating(i) {
    this.setState({ minRating: i });
  }

  isPlaceDisplayed(place) {
    if (place.priceLevel > this.state.maxPrice) return false;
    if (place.rating < this.state.minRating) return false;
    return true;
  }

  loadMoreResults() {
    this.props.getPlaces({
      nextPlacesToken: this.props.placesRequest.nextPlacesToken
    });
  }

  render() {
    const { places, maxPrice, minRating } = this.state;

    return (
      <div className="results container">
        <div className="filters row">
          <div className="price m-1 px-3">
            <span>Prix Maximum : </span>
            {[...Array(5)].map((x, i) => {
              return (
                <i
                  className={
                    'fas fa-euro-sign' + (maxPrice + 1 > i ? '' : ' out')
                  }
                  onClick={e => this.setMaxPrice(i)}
                />
              );
            })}
          </div>
          <div className="rating m-1 px-3">
            <span>Note Minimale : </span>
            {[...Array(5)].map((x, i) => {
              return (
                <i
                  className={'fas fa-star' + (minRating > i ? '' : ' out')}
                  onClick={e => this.setMinRating(i + 1)}
                />
              );
            })}
          </div>
          <button
            className="btn btn-secondary m-1"
            onClick={this.loadMoreResults}
          >
            Plus de résultats
          </button>
        </div>
        <div className="card-columns">
          {places.map(place => {
            return (
              <PlaceCard
                isDisplayed={this.isPlaceDisplayed(place)}
                place={place}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
