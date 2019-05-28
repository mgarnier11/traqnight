import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import PlaceOfInterest from './PlaceOfInterest/PlaceOfInterest';

import styles from './Results.module.css';

import apiHandler from '../../../api/apiHandler';

class Results extends Component {

  constructor(props) {
    super(props);

    this.state = {
      origin: { lat: 47.35885200000001, lng: -1.944482 },
      locations: []
    };
  }

  componentDidMount() {
    apiHandler.events.on('googleFindResponse', (res) => {
      this.setState({ origin: res.origin, locations: res.results });
    })
  }

  componentWillUnmount() {
    apiHandler.events.off('googleFindResponse', this.setResults);
  }

  render() {
    return (
      <div className={this.props.className + " " + styles.results}>
        <div className={styles.map}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyDRSLqNh7shuCn-bFK930HdFGTAMjI3Q7E" }}
            center={this.state.origin}
            defaultZoom={13}
          >
            {this.state.locations.map((location) => {
              return (<PlaceOfInterest {...location.geometry.location} location={location} key={location.id} />)
            })}

          </GoogleMapReact>

        </div>
        <div className={styles.list}>
          WIP
        </div>
      </div>
    );
  }
}

export default Results;

