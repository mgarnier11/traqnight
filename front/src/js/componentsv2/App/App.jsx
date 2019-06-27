import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/auth-actions';

import Home from '../Sections/Home/Home';
import Search from '../Sections/Search/Search';
import Results from '../Sections/Results/Results';
import ScuredRoute from '../SecuredRoute';
import AdminRoute from '../AdminRoute';
import Menu from '../Menu/Menu';

function mapDispatchToProps(dispatch) {
  return {
    login: () => dispatch(login())
  };
}

class App extends Component {
  constructor(props) {
    super(props);

    this.homeRef = React.createRef();
    this.resultsRef = React.createRef();
    this.searchRef = React.createRef();

    this.refs = {
      home: this.homeRef,
      results: this.resultsRef,
      search: this.searchRef
    };
    this.scrollTo = this.scrollTo.bind(this);
  }

  componentWillMount() {
    this.props.login();
  }

  scrollTo = refId => {
    window.scrollTo(0, this[refId + 'Ref'].current.offsetTop);
  };

  render() {
    return (
      <div className="appRoot">
        <Menu />
        <Switch>
          <AdminRoute
            exact
            path="/admin"
            component={() => <div className="admin" />}
          />
          <Route
            exact
            path="/"
            component={() => (
              <div className="app">
                <Home reference={this.homeRef} scrollTo={this.scrollTo} />
                <Search reference={this.searchRef} scrollTo={this.scrollTo} />
                <Results reference={this.resultsRef} scrollTo={this.scrollTo} />
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(App);
