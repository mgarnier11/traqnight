import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import apiHandler from '../../api/apiHandler';
import { isNull } from 'util';

class SecuredRoute extends Component {
  static propTypes = {
    component: PropTypes.instanceOf(Component).isRequired,
    path: PropTypes.string.isRequired
  };

  static defaultProps = {
    path: '/',
    component: undefined
  };

  async componentWillMount() {
    this.setState({ allowed: await apiHandler.isAuthenticated() });
  }

  render() {
    const { component: Component, path } = this.props;

    return (
      <Route
        path={path}
        render={() => {
          if (isNull(this.state.allowed)) {
            return 'Checking the user...';
          } else if (!this.state.allowed) {
            return <Redirect to="/login" />;
          } else {
            return <Component />;
          }
        }}
      />
    );
  }
}

export default SecuredRoute;
