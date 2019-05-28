import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import Home from './Home/Home';
import Results from './Results/Results';
import Search from './Search/Search';
import Login from './Auth/Login';
import Register from './Auth/Register';
import AdminRoute from '../SecuredRoute/AdminRoute';
import SecuredRoute from '../SecuredRoute/SecuredRoute';

import Admin from './Admin/Admin';

import styles from './App.module.css';




class App extends Component {
  constructor(props) {
    super(props);

    this.homeDivRef = React.createRef();
    this.searchDivRef = React.createRef();
    this.searchRef = React.createRef();

    this.isScrolling = -1;
    this.prgmScrolling = true;
    this.lastScroll = 0;

    this.handleHomeSearchClick = this.handleHomeSearchClick.bind(this);
  }

  componentDidMount() {

    window.onscroll = () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(this.isScrolling);

      // Set a timeout to run after scrolling ends
      this.isScrolling = setTimeout(() => {
        if (this.lastScroll < window.scrollY) this.scrollTo('searchDivRef');
        else if (this.lastScroll > window.scrollY) this.scrollTo('homeDivRef');

        this.lastScroll = window.scrollY;
      }, 66);
    };
  }

  scrollTo = (ref) => window.scrollTo(0, this[ref].current.offsetTop);


  handleHomeSearchClick(datas) {
    this.searchRef.current.updateFromHome(datas);
    this.scrollTo('searchDivRef');
  }

  render() {
    return (
      <Switch>
        <Redirect from='/logout' to='/login' />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <AdminRoute exact path='/admin' component={Admin} />
        <Route exact path='/' component={() => {
          return (
            <div className={styles.app}>
              <Home className={styles.home} refere={this.homeDivRef} handleHomeSearchClick={this.handleHomeSearchClick} />
              <Search className={styles.search} ref={this.searchRef} refere={this.searchDivRef} />
              <Results className={styles.results} />
            </div>
          );
        }} />
      </Switch>

    );
  }

}

export default withRouter(App);

