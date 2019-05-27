import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import apiHandler from '../../../api/apiHandler';
import PlaceOfInterest from './PlaceOfInterest/PlaceOfInterest';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 47.359058,
        lng: -1.944071
      },
      locations: []
    }

  }

  componentDidMount() {
    apiHandler.events.on('googleFindResponse', (res) => {
      this.setState({ center: res.origin, locations: res.results });
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDRSLqNh7shuCn-bFK930HdFGTAMjI3Q7E" }}
          center={this.state.center}
          defaultZoom={13}
        >
          {this.state.locations.map((location) => {
            return (<PlaceOfInterest {...location.geometry.location} />)
          })}

        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;

