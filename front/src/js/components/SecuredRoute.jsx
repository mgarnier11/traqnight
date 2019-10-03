import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

const SecuredRoute = ({ component: Component, path, user }) => (
  <Route
    path={path}
    render={() => (user ? <Component /> : <Redirect to="/" />)}
  />
);

SecuredRoute.propTypes = {
  component: PropTypes.instanceOf(Component).isRequired,
  path: PropTypes.string.isRequired
};

SecuredRoute.defaultProps = {
  path: '/',
  component: undefined
};

export default connect(mapStateToProps)(SecuredRoute);
