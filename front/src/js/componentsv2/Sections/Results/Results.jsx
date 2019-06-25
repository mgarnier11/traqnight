import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPlaces } from '../../../redux/actions/place-actions';
import Place from '../../../../../../classes/place-class';
import PlaceCard from '../../PlaceCard/PlaceCard';
import Loading from '../../Loading/Loading';
import Map from '../../Map/Map';

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
    places: PropTypes.arrayOf(PropTypes.instanceOf(Place)).isRequired,
    scrollTo: PropTypes.func.isRequired
  };

  static defaultProps = {
    places: [],
    scrollTo: p => console.log(p)
  };

  constructor(props) {
    super(props);

    this.navBar = React.createRef();
    this.map = React.createRef();

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
      this.setState({
        top: this.navBar.current.offsetHeight,
        paddingTop:
          this.navBar.current.offsetHeight + this.map.current.offsetHeight
      });
      this.navBar.current.classList.add('nav-fixed');
      this.map.current.classList.add('map-fixed');
    } else {
      this.setState({ top: 0, paddingTop: 0 });
      this.navBar.current.classList.remove('nav-fixed');
      this.map.current.classList.remove('map-fixed');
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
    const { maxPrice, minRating } = this.state;
    const loading = this.props.placesLoading;
    const places = this.state.places.filter(place =>
      this.isPlaceDisplayed(place)
    );

    return (
      <div
        className="results"
        ref={this.props.reference}
        style={{ paddingTop: this.state.paddingTop }}
      >
        <i
          onClick={e => this.props.scrollTo('search')}
          className="to-top fas fa-arrow-alt-circle-up"
        />
        <nav
          className="navbar navbar-expand-lg navbar-light justify-content-between filters"
          ref={this.navBar}
        >
          <button
            className="btn btn-secondary"
            onClick={this.loadMoreResults}
            disabled={
              this.props.placesLoading |
              !this.props.placesRequest.nextPlacesToken
            }
          >
            Plus de résultats
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#resultsNavbarToggler"
            aria-controls="resultsNavbarToggler"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse inline"
            id="resultsNavbarToggler"
          >
            <div className="price mr-1">
              <span>Prix Max. : </span>
              {[...Array(5)].map((x, i) => {
                return (
                  <i
                    className={
                      'fas fa-euro-sign' + (maxPrice + 1 > i ? '' : ' out')
                    }
                    onClick={e => this.setMaxPrice(i)}
                    key={i}
                  />
                );
              })}
            </div>
            <div className="rating ml-1">
              <span>Note Min. : </span>
              {[...Array(5)].map((x, i) => {
                return (
                  <i
                    className={'fas fa-star' + (minRating > i ? '' : ' out')}
                    onClick={e => this.setMinRating(i + 1)}
                    key={i}
                  />
                );
              })}
            </div>
          </div>
        </nav>
        <div className="map" ref={this.map} style={{ top: this.state.top }}>
          <Map
            loading={loading}
            center={this.props.placesRequest.originLocation}
            places={places}
          />
        </div>
        <div className="container">
          <div className="results-cards card-deck">
            {places.length === 0 ? (
              <div className="col-12 text-center">
                <h1>Pas de résultats</h1>
              </div>
            ) : (
              places.map(place => {
                return <PlaceCard place={place} key={place._id} />;
              })
            )}
            {loading ? <Loading /> : ''}
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
