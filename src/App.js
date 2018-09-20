import React, { Component } from 'react';

import Map from './containers/MapContainer';
import ToolsScreen from './components/ToolsScreen';
import Layers from './components/Layers';

import './App.css';

class App extends Component {
  constructor(){
    super();

    this.state = {
      addLayer: () => this.layers.addLayer,
    }
  }

  render() {
    return (
      <div className='root'>
        <div className='screen'>
          <Layers onRef = {ref => (this.layers = ref)}/>
          <Map/>
        </div>
        <div className='screen'>
          <ToolsScreen addLayer={this.state.addLayer}/>
        </div>
      </div>
    );
  }
}

export default App;
