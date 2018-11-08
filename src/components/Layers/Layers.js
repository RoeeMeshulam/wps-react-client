import React, { Component } from "react";

import "./Layers.css";
import { UploadFromUrl, GetLayerUrlFromId } from "./RemoteStorage";
import { LayersIcon } from "../Icons/Icons";
import Checkbox from "./checkbox";
import axios from "axios";
import UploadFile from "./UploadFile";

export default class Layers extends Component {
  constructor(props) {
    super(props);

    this.toggleLayer = this.toggleLayer.bind(this);
    this.concatLayers = this.concatLayers.bind(this);
  }
  state = {
    highlighted: {},
    layersList: []
  };

  componentDidMount() {
    this.props.onRef(this);
    this.fetchLayersList();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  fetchLayersList() {
    let layersList;
    try {
      layersList = JSON.parse(localStorage.getItem("LayersList"));
      if (!Array.isArray(layersList)) layersList = [];
    } catch (err) {
      this.props.alert.error("Failed to load layers");
      layersList = [];
    }
    layersList.forEach(layer => (layer.displayed = false));
    this.setState({ layersList: layersList });
  }

  setHighlightedLayer(layerId, isHighlighted) {
    this.setState({
      highlighted: {
        ...this.state.highlighted,
        [layerId]: isHighlighted
      }
    });
  }

  highlight(layerId) {
    if (!this.state.highlighted[layerId]) {
      this.setHighlightedLayer(layerId, true);
      setTimeout(() => {
        this.setHighlightedLayer(layerId, false);
      }, 1700);
    }
  }

  zoomToLayer(layerId) {
    if (this.state.layersList) {
      const zoomedLayer = this.state.layersList.filter(
        layer => layer.id === layerId
      )[0];

      if (zoomedLayer) this.highlight(zoomedLayer.id);
    }
  }

  concatLayers(layersToAdd) {
    const nonExistingLayers = layersToAdd.filter(
      ({ id }) => !this.layerExist(id)
    );

    const layersList = this.state.layersList.concat(nonExistingLayers);

    this.setState({ layersList });

    layersToAdd.map(({ id }) => this.highlight(id));

    localStorage.setItem(
      "LayersList",
      JSON.stringify(layersList.map(({ name, id }) => ({ name, id })))
    );
  }

  getLayers() {
    return this.state.layersList.map(({ id, name }) => ({
      id,
      displayName: name,
      url: GetLayerUrlFromId(id)
    }));
  }

  toggleLayer(layerId) {
    const layer = this.state.layersList.filter(
      layer => layer.id === layerId
    )[0];
    const newLayer = { ...layer, displayed: !layer.displayed };
    if (newLayer.displayed) {
      axios
        .get(GetLayerUrlFromId(layer.id))
        .then(({ data }) => data)
        .then(geojson => this.props.addLayerToMap(layer.id, geojson));
    } else {
      this.props.removeLayerFromMap(layer.id);
    }

    const layersList = this.state.layersList.map(
      layer => (layer.id === layerId ? newLayer : layer)
    );
    this.setState({ layersList });
  }

  layerExist(id) {
    return this.state.layersList.filter(l => l.id === id).length > 0;
  }

  addLayerFromWpsResponse(layer) {
    const url = layer.reference.href;
    return UploadFromUrl(url).then(id => {
      this.concatLayers([{ id, name: layer.title }]);
      return id;
    });
  }

  render() {
    return (
      <div className="layers">
        <h3 className="title">
          <LayersIcon className="layers-icon" />
          <span>Layers</span>
        </h3>
        <UploadFile concatLayers={this.concatLayers} />
        {this.state.layersList.map(layer => (
          <div
            className={`layer ${
              this.state.highlighted[layer.id] ? "highlighted" : ""
            }`}
            key={layer.id}
          >
            <Checkbox
              isDisplayed={layer.displayed}
              onClick={this.toggleLayer}
              identifier={layer.id}
            />
            <span>{layer.name}</span>
          </div>
        ))}
      </div>
    );
  }
}
