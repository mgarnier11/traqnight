import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import apiHandler from '../../api/apiHandler';
import { isNull } from 'util';

class AdminRoute extends Component {
    constructor(props) {
        super(props);


        this.state = {
            allowed: null
        };
    }

    async componentWillMount() {
        let allowed = await apiHandler.isAuthenticated();

        if (allowed) allowed = (await apiHandler.feathers.get('user')).admin

        this.setState({ allowed: allowed });
    }

    render() {
        const { component: Component, path } = this.props;

        return (
            <Route path={path} render={() => {
                if (isNull(this.state.allowed)) {
                    return "Checking the user...";
                } else if (!this.state.allowed) {
                    return <Redirect to='/' />
                } else {
                    return <Component />
                }
            }} />
        );
    }
}

export default AdminRoute;