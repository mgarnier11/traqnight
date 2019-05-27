import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import styles from './PlaceOfInterest.module.css';



class PlaceOfInterest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: props.type,
            title: props.title
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
                    {this.renderType(this.state.type)}
                </Tooltip>
            </div>
        );
    }

    renderType(type) {
        switch (type) {
            case 'bar':
                return <i class="fas fa-beer"></i>;
            case 'home':
                return <i class="fas fa-home"></i>;
            default:
                return <i class="fas fa-question"></i>;
        }
    }
}

export default PlaceOfInterest;