import React, { Component } from "react";

import Map from "./containers/MapContainer";
import ToolsScreen from "./components/ToolsScreen";
import Layers from "./components/Layers";

import "./App.css";
import { setQueryHistory, getQueryHistory } from "./utils/queryHistoryStorage";

class App extends Component {
  constructor() {
    super();

    this.state = {
      addLayer: () => this.layers.addLayer
    };
  }

  render() {
    return (
      <div className="root">
        <div className="screen">
          <Layers onRef={ref => (this.layers = ref)} />
          <Map />
        </div>
        <div className="screen">
          <ToolsScreen
            addLayer={this.state.addLayer}
            setQueryHistory={setQueryHistory}
            getQueryHistory={getQueryHistory}
          />
        </div>
      </div>
    );
  }
}

export default App;
