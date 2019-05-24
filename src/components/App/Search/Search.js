import React, { Component } from 'react';
import styles from './Search.module.css';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '0',
      town: '',
      radius: '500',
      prices: [
        { range: 1, active: true },
        { range: 2, active: true },
        { range: 3, active: true },
        { range: 4, active: true }
      ],
      opened: true
    }

    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);

    this.updateFromHome = this.updateFromHome.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleOpenedClick = event => {
    this.setState({ opened: !this.state.opened });
  }

  handlePriceChange(range) {
    let prices = [...this.state.prices];

    prices[range - 1].active = !prices[range - 1].active;

    this.setState({ prices: prices });
  }

  handleSearchClick() {
    console.log({
      type: parseInt(this.state.type),
      town: this.state.town,
      radius: parseInt(this.state.radius),
      prices: this.state.prices,
      opened: this.state.opened
    });
  }

  updateFromHome(datas) {
    this.setState({ town: datas.town, type: datas.type });
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
          <input type="text" className="form-control" id="town" placeholder="Votre ville" value={this.state.town} onChange={this.handleChange} />
        </div>

        <div className={styles.radius + " form-group " + styles.gridCell}>
          <select className="form-control" id="radius" value={this.state.radius} onChange={this.handleChange}>
            <option value={500}>500m</option>
            <option value={1000}>1000m</option>
            <option value={5000}>5000m</option>
          </select>
        </div>

        <div className={styles.price + " btn-group " + styles.gridCell}>
          {this.state.prices.map((price) => {
            return (
              <button className={'btn ' + (price.active ? 'btn-primary' : 'btn-outline-secondary')} onClick={() => this.handlePriceChange(price.range)} key={price.range}>
                {"€".repeat(price.range)}
              </button>)
          })}
        </div>

        <div className={styles.opened + " form-group " + styles.gridCell}>
          <button className={'btn ' + (this.state.opened ? 'btn-primary' : 'btn-outline-secondary')} onClick={this.handleOpenedClick}>Ouvert Actuellement</button>
        </div>

        <div className={styles.research + " form-group " + styles.gridCell}>
          <button className="btn btn-primary" onClick={this.handleSearchClick}>Trouvez !</button>
        </div>
      </div>
    );
  }
}

export default Search;

