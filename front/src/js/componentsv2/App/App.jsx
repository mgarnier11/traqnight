import React from 'react';

import Home from '../Sections/Home/Home';
import Search from '../Sections/Search/Search';
import Results from '../Sections/Results/Results';

/*
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: []
    };
  }

  render() {
    return (
      <div className="app">
        <Home types={this.state.types} />
        <Search types={this.state.types} />
        <Results places={this.st} />
      </div>
    );
  }
}*/

const App = () => (
  <div className="app">
    <Home />
    <Search />
    <Results />
  </div>
);

export default App;
