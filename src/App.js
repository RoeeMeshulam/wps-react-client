import React, { Component } from 'react';

import Map from './containers/MapContainer';
import ToolsScreen from './components/ToolsScreen';
import Layers from './components/Layers';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className='root'>
        <div className='screen'>
          <Layers/>
          <Map/>
        </div>
        <div className='screen'>
          <ToolsScreen />
        </div>
      </div>
    );
  }
}

export default App;
