import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/auth-actions';

import Home from '../Sections/Home/Home';
import Search from '../Sections/Search/Search';
import Results from '../Sections/Results/Results';
import Admin from '../Admin/Admin';
import Types from '../Admin/Types/Types';
import AdminRoute from '../AdminRoute';
import SecuredRoute from '../SecuredRoute';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import MyUser from '../MyUser/MyUser';

function mapDispatchToProps(dispatch) {
  return {
    login: () => dispatch(login())
  };
}

class App extends Component {
  constructor(props) {
    super(props);

    this.homeDivRef = React.createRef();
    this.resultsDivRef = React.createRef();
    this.searchDivRef = React.createRef();

    this.refs = {
      home: this.homeDivRef,
      results: this.resultsDivRef,
      search: this.searchDivRef
    };

    this.scrollTo = this.scrollTo.bind(this);
  }

  componentWillMount() {
    this.props.login();
  }

  scrollTo = refId => {
    window.scrollTo(0, this[refId + 'DivRef'].current.offsetTop);
  };

  render() {
    return (
      <div className="appRoot">
        <Menu />
        <Switch>
          <AdminRoute exact path="/admin" component={Admin} />
          <AdminRoute exact path="/admin/types" component={Types} />
          <SecuredRoute exact path="/my-user" component={MyUser} />
          <Route
            exact
            path="/"
            component={() => (
              <div className="app">
                <Home reference={this.homeDivRef} scrollTo={this.scrollTo} />
                <Search
                  reference={this.searchDivRef}
                  scrollTo={this.scrollTo}
                />
                <Results
                  reference={this.resultsDivRef}
                  scrollTo={this.scrollTo}
                />
              </div>
            )}
          />
          <Route component={() => <Redirect to="/" />} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(App);
