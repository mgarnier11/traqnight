import React, { Component, Ref } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPlaces } from '../../../redux/actions/place-actions';
import Place from '../../../../../../classes/place-class';
import PlaceCard from '../../PlaceCard/PlaceCard';

const mapStateToProps = state => {
  return {
    places: state.placesRequest.places,
    placesRequest: state.placesRequest,
    placesLoading: state.placesRequest.loading
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

    this.navBar = React.createRef();

    this.state = {
      places: props.places,
      maxPrice: 4,
      minRating: 1,
      paddingTop: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.isPlaceDisplayed = this.isPlaceDisplayed.bind(this);

    this.setMaxPrice = this.setMaxPrice.bind(this);
    this.setMinRating = this.setMinRating.bind(this);

    this.loadMoreResults = this.loadMoreResults.bind(this);

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    if (window.scrollY >= this.top) {
      this.setState({ paddingTop: this.navBar.current.offsetHeight });
      this.navBar.current.classList.add('nav-fixed');
    } else {
      this.setState({ paddingTop: 0 });
      this.navBar.current.classList.remove('nav-fixed');
    }
  }

  componentDidMount() {
    this.top = this.navBar.current.offsetTop;
    window.addEventListener('scroll', this.handleScroll);
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
    if (place.priceLevel !== null)
      if (place.priceLevel > this.state.maxPrice) return false;
    if (place.rating !== null)
      if (place.rating < this.state.minRating) return false;
    return true;
  }

  loadMoreResults() {
    if (!this.props.placesLoading && this.props.placesRequest.nextPlacesToken) {
      this.props.getPlaces({
        nextPlacesToken: this.props.placesRequest.nextPlacesToken
      });
    }
  }

  render() {
    const { places, maxPrice, minRating } = this.state;

    return (
      <div
        className="results"
        ref={this.props.reference}
        style={{ paddingTop: this.state.paddingTop }}
      >
        <nav
          className="navbar navbar-expand-lg navbar-light justify-content-between filters"
          ref={this.navBar}
        >
          <button
            className="btn btn-secondary m-1"
            onClick={this.loadMoreResults}
            disabled={
              this.props.placesLoading |
              !this.props.placesRequest.nextPlacesToken
            }
          >
            Plus de résultats
          </button>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#resultsNavbarToggler"
            aria-controls="resultsNavbarToggler"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse inline"
            id="resultsNavbarToggler"
          >
            <div className="price m-1">
              <span>Prix Max. : </span>
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
            <div className="rating m-1">
              <span>Note Min. : </span>
              {[...Array(5)].map((x, i) => {
                return (
                  <i
                    className={'fas fa-star' + (minRating > i ? '' : ' out')}
                    onClick={e => this.setMinRating(i + 1)}
                  />
                );
              })}
            </div>
          </div>
        </nav>
        <div className="container">
          <div className=" results-cards card-deck">
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
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
