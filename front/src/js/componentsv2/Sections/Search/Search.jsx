import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ErrorHandler } from '../../ErrorHandler';
import { getPlaces } from '../../../redux/actions/place-actions';

const mapStateToProps = state => {
  return { typesRequest: state.typesRequest, types: state.typesRequest.types };
};

function mapDispatchToProps(dispatch) {
  return {
    getPlaces: params => dispatch(getPlaces(params))
  };
}

class Search extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.object).isRequired,
    scrollTo: PropTypes.func.isRequired
  };

  static defaultProps = {
    types: [],
    scrollTo: p => console.log(p)
  };

  constructor(props) {
    super(props);

    this.state = {
      type: '',
      location: '',
      radius: '1000',
      coordinates: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTownInputClick = this.handleTownInputClick.bind(this);
    this.handleGetLocationClick = this.handleGetLocationClick.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.location.length === 0 && !this.state.coordinates) {
      ErrorHandler.showError(
        "Vous devez activer la localisation ou renseigner une ville pour utiliser l'application"
      );
    } else {
      const { type, location, coordinates, radius } = this.state;

      this.props.getPlaces({
        typeId: type === '' ? this.props.types[0]._id : type,
        location,
        radius: radius
      });
      this.props.scrollTo('results');
    }
  }

  handleTownInputClick() {
    this.setState({ coordinates: null });
  }

  handleGetLocationClick() {
    if (this.state.coordinates) {
      this.setState({ coordinates: null });
    } else {
      navigator.geolocation.getCurrentPosition(
        res => {
          this.setState({
            location: '',
            coordinates: { lat: res.coords.latitude, lng: res.coords.longitude }
          });
        },
        err => {
          console.log(err);
          if (err.code === 1)
            ErrorHandler.showError(
              "Vous devez accepter d'activer la localisation pour etre géolocalisé"
            );
          else {
            ErrorHandler.showError('Erreur lors de la géolocalisation');
          }
        }
      );
    }
  }

  render() {
    const { type, location, coordinates, radius } = this.state;

    return (
      <div className="search" ref={this.props.reference}>
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <div className="col-7 col-md-6 col-xl-2">
            <select
              className="form-control w-100"
              id="type"
              value={type}
              onChange={this.handleChange}
            >
              {this.props.types.map(t => {
                return (
                  <option value={t._id} key={t._id}>
                    {t.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-5 col-md-6 col-xl-2 ">
            <select
              className="form-control w-100"
              id="radius"
              value={radius}
              onChange={this.handleChange}
            >
              <option value={1000}>1000m</option>
              <option value={2500}>2500m</option>
              <option value={5000}>5000m</option>
            </select>
          </div>

          <div className="col-md-8 col-xl-6">
            <input
              className="form-control w-100"
              type="text"
              onClick={this.handleTownInputClick}
              id="location"
              placeholder="Votre ville"
              value={location}
              onChange={this.handleChange}
              disabled={coordinates}
            />
          </div>
          {/*
          <div className="form-check text-center col-md-4 col-xl-2">
            <span
              className={'mx-2' + (coordinates ? ' unlocate' : ' locate')}
              id="locate"
            >
              <i
                onClick={this.handleGetLocationClick}
                className="fas fa-crosshairs"
              />
            </span>
            <label htmlFor="locate">Position Actuelle</label>
          </div>
*/}
          <div className="col-xl-2 col-12">
            <button type="submit" className="btn btn-secondary col-12">
              Trouvez !
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
