import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

const AdminRoute = ({ component: Component, path, user }) => (
  <Route
    path={path}
    render={() => (user && user.admin ? <Component /> : <Redirect to="/" />)}
  />
);

AdminRoute.propTypes = {
  component: PropTypes.instanceOf(Component).isRequired,
  path: PropTypes.string.isRequired
};

AdminRoute.defaultProps = {
  path: '/',
  component: undefined
};

export default connect(mapStateToProps)(AdminRoute);
