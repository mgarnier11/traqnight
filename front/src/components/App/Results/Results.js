import React, { Component } from 'react';
import apiHandler from '../../../api/apiHandler';

class Results extends Component {

  constructor(props) {
    super(props);

    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    apiHandler.events.on('googleFindResponse', this.setResults);
  }

  componentWillUnmount() {
    apiHandler.events.off('googleFindResponse', this.setResults);
  }

  setResults(res) {
    this.setState({
      locations: res.locations
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        WIP
      </div>
    );
  }
}

export default Results;

