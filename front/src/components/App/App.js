import React, { Component } from 'react';
import Home from './Home/Home';
import Map from './Map/Map';
import Results from './Results/Results';


import styles from './App.module.css';
import Search from './Search/Search';



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
      <div className={styles.app}>
        <Home className={styles.home} refere={this.homeDivRef} handleHomeSearchClick={this.handleHomeSearchClick} />
        <Search className={styles.search} ref={this.searchRef} refere={this.searchDivRef} />
        <Map className={styles.map} />
        <Results className={styles.results} />
      </div>
    );
  }

}

export default App;

