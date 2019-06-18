import React, { Component } from 'react';

import apiHandler from '../../../api/apiHandler';
import Error from '../Error/Error.jsx';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.types.length > 0 ? props.types[0]._id : '',
      types: props.types,
      town: ''
    };

    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSearchClick() {
    if (this.state.town.length === 0) {
      Error.showError(
        "Vous devez renseigner une ville pour utiliser l'application"
      );
    } else {
      let datas = {
        type: this.state.type,
        location: this.state.town,
        radius: 1000
      };

      apiHandler.findInGoogle(datas);
      this.props.handleHomeSearchClick(datas);
    }
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') this.handleSearchClick();
  };

  render() {
    return (
      <div className="home container-fluid" ref={this.props.refere}>
        <div className="title text-center">
          <h1>Explorez votre ville</h1>
          <h2>Ne cherchez plus où sortir! Trouvez!</h2>
        </div>

        <div className="form">
          <div className="form-group mx-md-5 px-md-5">
            <label htmlFor="type">
              <h3>Quoi ?</h3>
            </label>
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
          <div className="form-group mx-md-5 px-md-5">
            <label htmlFor="town">
              <h3>Ou ?</h3>
            </label>
            <input
              type="text"
              className="form-control"
              id="town"
              placeholder="Votre ville"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <div className="form-group text-center">
            <button
              className="btn btn-lg btn-light"
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

export default Home;
