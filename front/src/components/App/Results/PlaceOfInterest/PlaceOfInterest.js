import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import styles from './PlaceOfInterest.module.css';

class PlaceOfInterest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      icon: props.icon
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.title) {
      this.setState({ location: newProps.location });
    }
    if (newProps.icon) {
      this.setState({ icon: newProps.icon });
    }
  }

  render() {
    return (
      <div className={styles.placeOfInterest}>
        <Tooltip
          title={this.state.title}
          position="bottom"
          trigger="mouseenter"
        >
          <i className={'fas fa-' + this.state.icon} />
        </Tooltip>
      </div>
    );
  }
}

export default PlaceOfInterest;
