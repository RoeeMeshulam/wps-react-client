import React, { Component } from "react";

import Map from "./containers/MapContainer";
import ToolsScreen from "./components/ToolsScreen";
import Layers from "./containers/LayersContainer";

import "./App.css";
import { setQueryHistory, getQueryHistory } from "./common/utils/queryHistoryStorage";

class App extends Component {
  constructor() {
    super();

    this.addLayer = this.addLayer.bind(this);
    this.zoomToLayer = this.zoomToLayer.bind(this);
    this.getLayers = this.getLayers.bind(this);
  }

  getLayers(layer) {
    return this.layers.getLayers(layer);
  }
  addLayer(layer) {
    return this.layers.addLayerFromWpsResponse(layer);
  }
  zoomToLayer(layer) {
    this.layers.zoomToLayer(layer);
  }

  render() {
    return (
      <div className="root">
        <div className="screen-left">
          <Layers onRef={ref => (this.layers = ref)} />
          <Map />
        </div>
        <div className="screen-right">
          <ToolsScreen
            addLayer={this.addLayer}
            setQueryHistory={setQueryHistory}
            getQueryHistory={getQueryHistory}
            zoomToLayer={this.zoomToLayer}
            getLayers={this.getLayers}
            complexAsReference
          />
        </div>
      </div>
    );
  }
}

export default App;
