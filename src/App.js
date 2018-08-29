import React, { Component } from 'react';

import Map from './containers/MapContainer';
import ToolsScreen from './components/ToolsScreen';

import './App.css';

const styles = {
  screen: {
    width: '50%',
    flexGrow: '1'
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between'
  }
};

class App extends Component {
  render () {
    return (
      <div style={styles.root}>
        <div style={styles.screen}>
          <Map/>
        </div>
        <div style={styles.screen}>
          <ToolsScreen/>
        </div>
      </div>
    );
  }
}

export default App;
