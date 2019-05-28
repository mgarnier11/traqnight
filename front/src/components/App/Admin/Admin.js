import React, { Component } from "react";
import { Link } from 'react-router-dom';

import ListTypes from '../Type/Lists/List';

import apiHandler from '../../../api/apiHandler';

class Admin extends Component {
    constructor(props) {
        super(props);


        this.nbTypesPerPage = 5;

        this.state = {
            lstTypes: []
        };

        this.typesPageChanged = this.typesPageChanged.bind(this);

        this.setTypes = this.setTypes.bind(this);
    }

    componentDidMount() {
        this.setTypes(1);
    }

    async setTypes(page) {
        let types = await apiHandler.typeService.find({
            query: {
                $sort: {
                    name: -1
                }
            }
        });

        this.setState({ lstTypes: types });
    }

    typesPageChanged(page) {
        this.setTypes(page);
    }

    render() {

        return (
            <div>
                <ListTypes className="col-12"
                    nbPerPage={this.nbTypesPerPage}
                    lst={this.state.lstTypes}
                    pageChanged={this.typesPageChanged} />
                <div className="col-12 text-center"><Link to="/admin/type/new" className="btn btn-primary">Create New Type</Link></div>
            </div>
        );
    }
}

export default Admin;