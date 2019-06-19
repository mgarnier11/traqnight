import React, { Component } from 'react';

import apiHandler from '../../../api/apiHandler';
import Error from '../Error/Error.jsx';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.types.length > 0 ? props.types[0]._id : '',
      types: props.types,
      town: '',
      radius: '1000',
      coordinates: null
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleGetLocationClick = this.handleGetLocationClick.bind(this);
    this.handleTownInputClick = this.handleTownInputClick.bind(this);

    this.updateFromHome = this.updateFromHome.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSearchClick() {
    if (this.state.town.length === 0 && !this.state.coordinates) {
      Error.showError(
        "Vous devez activer la localisation ou renseigner une ville pour utiliser l'application"
      );
    } else {
      let datas = {
        type: this.state.type,
        location: this.state.coordinates || this.state.town,
        radius: parseInt(this.state.radius)
      };

      apiHandler.findInGoogle(datas);
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
            town: '',
            coordinates: { lat: res.coords.latitude, lng: res.coords.longitude }
          });
        },
        err => {
          console.log(err);
          if (err.code === 1)
            Error.showError(
              "Vous devez accepter d'activer la localisation pour etre géolocalisé"
            );
          else {
            Error.showError('Erreur lors de la géolocalisation');
          }
        }
      );
    }
  }

  updateFromHome(datas) {
    this.setState({ town: datas.location, type: datas.type });
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') this.handleSearchClick();
  };

  render() {
    return (
      <div className="search container" id="searchSection">
        <div className="row">
          <div className="col-md-2 col-5 px-1">
            <select
              className="form-control"
              id="type"
              value={this.state.type}
              onChange={this.handleChange}
            >
              {this.state.types.map(type => {
                return (
                  <option value={type._id} key={type._id}>
                    {type.name}
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
              id="town"
              placeholder="Votre ville"
              value={this.state.town}
              onChange={this.handleChange}
              disabled={this.state.coordinates}
              onKeyPress={this.handleKeyPress}
            />
            <span className={this.state.coordinates ? 'unlocate' : 'locate'}>
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
              value={this.state.radius}
              onChange={this.handleChange}
            >
              <option value={1000}>1000m</option>
              <option value={2500}>2500m</option>
              <option value={5000}>5000m</option>
            </select>
          </div>
          <div className="col-md-2 col-7 px-1">
            <button
              className="btn btn-secondary col-12"
              onClick={this.handleSearchClick}
            >
              Trouvez !
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;