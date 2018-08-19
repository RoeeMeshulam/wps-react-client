import React, { Component } from 'react';

import Map from './components/Map';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{width: '50%'}}>
          <Map/>
        </div>
      </div>
    );
  }
}

export default App;
