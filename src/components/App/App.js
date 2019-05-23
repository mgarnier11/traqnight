import React, { Component } from 'react';
import Home from './Home/Home';
import Map from './Map/Map';
import Results from './Results/Results';

import styles from './App.module.css';
import Search from './Search/Search';

class App extends Component {
  constructor(props) {
    super(props);

    this.isScrolling = -1;
  }

  componentDidMount() {
    // Listen for scroll events
    window.addEventListener('scroll', function (event) {

      // Clear our timeout throughout the scroll
      window.clearTimeout(this.isScrolling);

      // Set a timeout to run after scrolling ends
      this.isScrolling = setTimeout(function () {

        // Run the callback
        console.log('Scrolling has stopped.');
      }, 66);

    });
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className={styles.app}>
        <Home className={styles.home} />
        <Search className={styles.search} />
        <Map className={styles.map} />
        <Results className={styles.results} />
      </div>
    );
  }
}

export default App;

