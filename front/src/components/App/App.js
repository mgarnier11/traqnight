import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import Home from './Home/Home';
import Results from './Results/Results';
import Search from './Search/Search';
import Login from './Auth/Login';
import Register from './Auth/Register';
import AdminRoute from '../SecuredRoute/AdminRoute';
import SecuredRoute from '../SecuredRoute/SecuredRoute';

import CreateType from './Type/Create';
import EditType from './Type/Edit';

import Admin from './Admin/Admin';

import apiHandler from '../../api/apiHandler';

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

    this.state = {
      types: undefined
    };

    this.handleHomeSearchClick = this.handleHomeSearchClick.bind(this);
  }

  async componentWillMount() {

    this.setState({
      types: await apiHandler.typeService.find({
        query: {
          $sort: {
            name: -1
          }
        }
      })
    });

  }

  async componentDidMount() {

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
    if (this.state.types === undefined) {
      return (
        <div className="loading">Loading</div>
      )

    } else {
      return (
        <Switch>
          <Redirect from='/logout' to='/login' />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <AdminRoute exact path='/admin' component={Admin} />
          <AdminRoute exact path='/admin/type/new' component={CreateType} />
          <AdminRoute exact path='/admin/type/edit/:id' component={EditType} />
          <Route exact path='/' component={() => {
            return (
              <div className={styles.app}>
                <Home className={styles.home} refere={this.homeDivRef} handleHomeSearchClick={this.handleHomeSearchClick} types={this.state.types} />
                <Search className={styles.search} ref={this.searchRef} refere={this.searchDivRef} types={this.state.types} />
                <Results className={styles.results} />
              </div>
            );
          }} />
        </Switch>
      );
    }
  }

}

export default withRouter(App);

