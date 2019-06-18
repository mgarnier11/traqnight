import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Results from './Results/Results.jsx';
import Search from './Search/Search.jsx';
import Loading from './Loading/Loading.jsx';

import apiHandler from '../../api/apiHandler';

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
        //else if (this.lastScroll > window.scrollY) this.scrollTo('homeDivRef');

        this.lastScroll = window.scrollY;
      }, 66);
    };
  }

  scrollTo = ref => window.scrollTo(0, this[ref].current.offsetTop);

  handleHomeSearchClick(datas) {
    this.searchRef.current.updateFromHome(datas);
    this.scrollTo('searchDivRef');
  }

  render() {
    if (this.state.types === undefined) {
      return <Loading />;
    } else {
      return (
        <Switch>
          <Route
            exact
            path="/"
            component={() => {
              return (
                <div className="app">
                  <Home
                    refere={this.homeDivRef}
                    handleHomeSearchClick={this.handleHomeSearchClick}
                    types={this.state.types}
                  />
                  <Search refere={this.searchDivRef} types={this.state.types} />
                </div>
              );
            }}
          />
        </Switch>
      );
    }
  }
}

export default withRouter(App);
