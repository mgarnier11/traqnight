import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ErrorHandler from '../../ErrorHandler';

const mapStateToProps = state => {
  return { types: state.types };
};

class Search extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    types: []
  };

  constructor(props) {
    super(props);

    this.state = {
      types: props.types,
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
    if (this.state.town.length === 0 && !this.state.coordinates) {
      ErrorHandler.showError(
        "Vous devez activer la localisation ou renseigner une ville pour utiliser l'application"
      );
    } else {
      //const { type, location, coordinates, radius } = this.state;
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
      <div className="search container">
        <form className="row" onSubmit={this.handleSubmit}>
          <div className="col-md-2 col-5 px-1">
            <select
              className="form-control"
              id="type"
              value={type}
              onChange={this.handleChange}
            >
              {this.state.types.map(t => {
                return (
                  <option value={t.id} key={t.id}>
                    {t.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-md-6 col-7 px-1 town">
            <input
              type="text"
              onClick={this.handleTownInputClick}
              className="form-control"
              id="location"
              placeholder="Votre ville"
              value={location}
              onChange={this.handleChange}
              disabled={coordinates}
            />
            <span className={coordinates ? 'unlocate' : 'locate'}>
              <i
                onClick={this.handleGetLocationClick}
                className="fas fa-crosshairs"
              />
            </span>
          </div>
          <div className="col-md-2 col-5 px-1">
            <select
              className="form-control"
              id="radius"
              value={radius}
              onChange={this.handleChange}
            >
              <option value={1000}>1000m</option>
              <option value={2500}>2500m</option>
              <option value={5000}>5000m</option>
            </select>
          </div>
          <div className="col-md-2 col-7 px-1">
            <button type="submit" className="btn btn-secondary col-12">
              Trouvez !
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Search);
