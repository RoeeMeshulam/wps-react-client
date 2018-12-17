import React, { Component } from "react";
import { withAlert } from "react-alert";
import WpsController from "wps-controller";

import Map from "./containers/MapContainer";
import Layers from "./containers/LayersContainer";

import "./App.css";
import {
  setQueryHistory,
  getQueryHistory
} from "./common/utils/queryHistoryStorage";

class App extends Component {
  constructor() {
    super();

    this.addLayer = this.addLayer.bind(this);
    this.zoomToLayer = this.zoomToLayer.bind(this);
    this.getLayers = this.getLayers.bind(this);
  }
  state = {
    isDrawing: false
  };

  getLayers(layer) {
    return this.layers.getLayers(layer);
  }
  addLayer(layer) {
    return this.layers.addLayerFromWpsResponse(layer);
  }
  zoomToLayer(layer) {
    this.layers.zoomToLayer(layer);
  }

  setDrawRectange = isDrawingRectange => {
    this.setState({ isDrawingRectange });
    if (!isDrawingRectange) {
      this.setState({ drawedRectange: null });
    }
  };
  onDrawingDone = box => {
    this.setState({ drawedRectange: box });
    // this.layers.doneDrawingRectange(box);
  };

  render() {
    const { drawedRectange } = this.state;
    return (
      <div className="root">
        <div className="screen-left">
          <Layers
            onRef={ref => (this.layers = ref)}
            setDrawRectange={this.setDrawRectange}
            drawedRectange={drawedRectange}
          />
          <Map
            isDrawingRectange={this.state.isDrawingRectange}
            onDrawingDone={this.onDrawingDone}
          />
        </div>
        <div className="screen-right">
          <WpsController
            showAlert={this.props.alert.error}
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

export default withAlert(App);
