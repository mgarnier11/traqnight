import React, { Component } from "react";
import { Link } from 'react-router-dom';

import ListTypes from '../Type/List';

import apiHandler from '../../../api/apiHandler';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lstTypes: []
        };
    }

    async componentDidMount() {
        this.setState({
            lstTypes: await apiHandler.typeService.find({
                query: {
                    $sort: {
                        name: -1
                    }
                }
            })
        });

    }

    render() {

        return (
            <div className="container">
                <ListTypes className="col-12"
                    lst={this.state.lstTypes} />
                <div className="col-12 text-center"><Link to="/admin/type/new" className="btn btn-primary">Create New Type</Link></div>
            </div>
        );
    }
}

export default Admin;