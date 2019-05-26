import React, { Component } from 'react';
import { toast } from 'react-toastify';
import styles from './Search.module.css';

import apiHandler from '../../../api/apiHandler';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '0',
      town: '',
      radius: '1000',
      coordinates: null,
      error: null
    }
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleGetLocationClick = this.handleGetLocationClick.bind(this);
    this.handleTownInputClick = this.handleTownInputClick.bind(this);

    this.updateFromHome = this.updateFromHome.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSearchClick() {
    if (this.state.town.length === 0 & !this.state.coordinates) {
      this.setState({ error: { msg: 'Vous devez activer la localisation ou renseigner une ville pour utiliser l\'application' } });
    }

    let datas = {
      type: parseInt(this.state.type),
      location: (this.state.coordinates || this.state.town),
    };

    apiHandler.findInGoogle(datas);
  }

  handleTownInputClick() {
    this.setState({ coordinates: null });
  }

  handleGetLocationClick() {
    if (this.state.coordinates) {

    }

    navigator.geolocation.getCurrentPosition((res) => {
      this.setState({ coordinates: { lat: res.coords.latitude, lng: res.coords.longitude } });
    }, (err) => {
      console.log(err);
      if (err.code === 1) this.setState({ error: { msg: 'Vous devez accepter d\'activer la localisation pour etre géolocalisé' } });
      else {
        this.setState({ error: { msg: 'Erreur lors de la géolocalisation' } });

        console.log(err);
      }
    });
  }

  updateFromHome(datas) {
    this.setState({ town: datas.town, type: datas.type });
  }

  componentDidUpdate() {
    if (this.state.error) {
      toast.error(this.state.error.msg, {
        onClose: () => {
          this.setState({ error: null });
        },
        autoClose: 4000,
        pauseOnHover: false,
        pauseOnFocusLoss: false
      });
    }
  }

  render() {
    return (
      <div className={this.props.className + " " + styles.search} id="searchSection" ref={this.props.refere}>
        <div className={styles.type + " form-group " + styles.gridCell}>
          <select className="form-control" id="type" value={this.state.type} onChange={this.handleChange}>
            <option value="0">Bars</option>
            <option value="1">Boites de nuit</option>
          </select>
        </div>

        <div className={styles.town + " form-group " + styles.gridCell}>
          <input type="text" onClick={this.handleTownInputClick} className={styles.townInput + " form-control"} id="town" placeholder="Votre ville" value={this.state.town} onChange={this.handleChange} disabled={this.state.coordinates} />
          <i onClick={this.handleGetLocationClick} className={styles.locate + " fas fa-crosshairs"}></i>

        </div>

        <div className={styles.radius + " form-group " + styles.gridCell}>
          <select className="form-control" id="radius" value={this.state.radius} onChange={this.handleChange}>
            <option value={1000}>1000m</option>
            <option value={2500}>2500m</option>
            <option value={5000}>5000m</option>
            <option value={10000}>10000m</option>
          </select>
        </div>

        <div className={styles.research + " form-group " + styles.gridCell}>
          <button className="btn btn-primary" onClick={this.handleSearchClick}>Trouvez !</button>
        </div>
      </div>
    );
  }
}

export default Search;

