import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import PlaceOfInterest from './PlaceOfInterest/PlaceOfInterest';
import LoadingOverlay from 'react-loading-overlay';

import styles from './Results.module.css';

import apiHandler from '../../../api/apiHandler';

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      origin: { lat: 47.35885200000001, lng: -1.944482 },
      locations: []
    };

    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    apiHandler.events.on('googleFindStarted', res => {
      this.setState({ loading: true });
    });

    apiHandler.events.on('googleFindFinished', res => {
      this.setState({ loading: false });
    });

    apiHandler.events.on('googleFindResponse', this.setResults);
  }

  componentWillUnmount() {
    apiHandler.events.off('googleFindResponse', this.setResults);
  }

  setResults(res) {
    console.log(res);
    this.setState({ origin: res.origin, locations: res.results });
  }

  render() {
    return (
      <div className={this.props.className + ' ' + styles.results}>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text='Chargement...'
          className={styles.loading}
        >
          <div className={styles.map}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: 'AIzaSyCkiT6O5Me25yx4JV9ZT3iGYYCdsgzqv9w'
              }}
              center={this.state.origin}
              defaultZoom={13}
            >
              {this.state.locations.map(location => {
                return (
                  <PlaceOfInterest
                    {...location.geometry.location}
                    title={location.name}
                    icon={location.type.icon}
                    key={location.id}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
          <div className={styles.list}>WIP</div>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Results;
