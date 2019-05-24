import React, { Component } from 'react';
import styles from './Home.module.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      town: '',
      type: '0'
    }

    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSearchClick() {
    console.log({
      type: parseInt(this.state.type),
      town: this.state.town
    });
  }

  render() {
    return (
      <div className={this.props.className + " " + styles.home} ref={this.props.refere}>
        <div className={styles.hero + " text-center"}>
          <h1>
            Explorez votre ville
          </h1>
          <h2>
            Ne cherchez plus où sortir! Trouvez!
          </h2>
        </div>

        <div className={styles.search + " container"}>
          <div className="form-group mx-md-5 px-md-5">
            <label htmlFor="type"><h3>Quoi ?</h3></label>
            <select className="form-control" id="type" value={this.state.type} onChange={this.handleChange}>
              <option value="0">Bars</option>
              <option value="1">Boites de nuit</option>
            </select>
          </div>
          <div className="form-group mx-md-5 px-md-5">
            <label htmlFor="town"><h3>Ou ?</h3></label>
            <input type="text" className="form-control" id="town" placeholder="Votre ville" onChange={this.handleChange} />
          </div>
          <div className="form-group text-center">
            <a className="btn btn-primary" onClick={this.handleSearchClick} href="#searchSection">Trouvez !</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

