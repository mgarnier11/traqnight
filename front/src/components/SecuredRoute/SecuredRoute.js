import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import apiHandler from '../../api/apiHandler';
import { isNull } from 'util';

class SecuredRoute extends Component {
    constructor(props) {
        super(props);


        this.state = {
            allowed: null
        };
    }

    async componentWillMount() {
        this.setState({ allowed: await apiHandler.isAuthenticated() });
    }

    render() {
        const { component: Component, path } = this.props;

        return (
            <Route path={path} render={() => {
                if (isNull(this.state.allowed)) {
                    return "Checking the user...";
                } else if (!this.state.allowed) {
                    return <Redirect to='/login' />
                } else {
                    return <Component />
                }
            }} />
        );
    }
}

export default SecuredRoute;