import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Home from './Home/Home';
import Map from './Map/Map';
import Results from './Results/Results';

import styles from './App.module.css';
import Search from './Search/Search';

class App extends Component {
  constructor(props) {
    super(props);

    this.homeRef = React.createRef();
    this.searchRef = React.createRef();

    this.isScrolling = -1;
    this.prgmScrolling = true;
    this.lastScroll = 0;
  }

  componentDidMount() {

    window.onscroll = () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(this.isScrolling);

      // Set a timeout to run after scrolling ends
      this.isScrolling = setTimeout(() => {
        if (this.lastScroll < window.scrollY) window.scrollTo(0, this.searchRef.current.offsetTop);
        else if (this.lastScroll > window.scrollY) window.scrollTo(0, this.homeRef.current.offsetTop);

        this.lastScroll = window.scrollY;
      }, 66);
    };
  }


  componentWillUnmount() {
  }



  render() {
    return (
      <div className={styles.app}>
        <Home className={styles.home} refere={this.homeRef} />
        <Search className={styles.search} refere={this.searchRef} />
        <Map className={styles.map} />
        <Results className={styles.results} />
      </div>
    );
  }

}

export default App;

