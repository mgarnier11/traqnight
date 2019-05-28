import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import styles from './PlaceOfInterest.module.css';



class PlaceOfInterest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: props.location
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.location) {
            this.setState({ location: newProps.location });
        }
    }


    render() {
        return (
            <div className={styles.placeOfInterest}>
                <Tooltip
                    title={this.state.location.name}
                    position="bottom"
                    trigger="mouseenter"
                >
                    <i className={"fas fa-" + this.state.location.type.icon}></i>
                </Tooltip>
            </div>
        );
    }
}

export default PlaceOfInterest;