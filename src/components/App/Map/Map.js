import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

class Map extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDRSLqNh7shuCn-bFK930HdFGTAMjI3Q7E" }}
          defaultCenter={{
            lat: 47.359058,
            lng: -1.944071
          }}
          defaultZoom={13}
        >
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;

