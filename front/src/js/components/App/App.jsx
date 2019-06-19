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

  async componentDidMount() {}

  handleHomeSearchClick(datas) {
    //this.searchRef.current.updateFromHome(datas);
    //this.scrollTo('searchDivRef');
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
                    handleHomeSearchClick={this.handleHomeSearchClick}
                    types={this.state.types}
                  />
                  <Search types={this.state.types} />
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
