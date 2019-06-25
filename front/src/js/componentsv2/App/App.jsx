import React, { Component } from 'react';

import Home from '../Sections/Home/Home';
import Search from '../Sections/Search/Search';
import Results from '../Sections/Results/Results';

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

  scrollTo = refId => {
    window.scrollTo(0, this[refId + 'Ref'].current.offsetTop);
  };

  render() {
    return (
      <div className="app">
        <Home reference={this.homeRef} scrollTo={this.scrollTo} />
        <Search reference={this.searchRef} scrollTo={this.scrollTo} />
        <Results reference={this.resultsRef} scrollTo={this.scrollTo} />
      </div>
    );
  }
}

export default App;
