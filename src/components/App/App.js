import React, { Component } from 'react';
import Home from './Home/Home';
import Map from './Map/Map';

import styles from './App.module.css';
import Search from './Search/Search';

class App extends Component {

  render() {
    return (
      <div className={styles.app}>
        <Home className={styles.home} />
        <Search className={styles.search} />
        <Map className={styles.map} />
      </div>
    );
  }
}

export default App;

