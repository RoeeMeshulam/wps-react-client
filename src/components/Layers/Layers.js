import React, { Component } from "react";

import "./Layers.css";
import { UploadFromUrl, GetLayerUrlFromId } from "./RemoteStorage";
import { LayersIcon, BoundingBoxIcon } from "../Icons/Icons";
import axios from "axios";
import UploadFile from "./UploadFile";
import LayerTypes from '../../common/LayerTypes'

import CheckableItem from "./CheckableItem";

export default class Layers extends Component {
  constructor(props) {
    super(props);

    this.toggleLayer = this.toggleLayer.bind(this);
    this.concatLayers = this.concatLayers.bind(this);
  }
  state = {
    highlighted: {},
    layersList: [],
    bboxList: []
  };

  componentDidMount() {
    this.props.onRef(this);
    this.fetchLayersList();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  fetchLayersList() {
    let layersList, bboxList;
    try {
      const data = JSON.parse(localStorage.getItem("LayersList"));
      bboxList = data.bboxList;
      layersList = data.layersList;

      layersList.forEach(layer => (layer.displayed = false));
      bboxList.forEach(bbox => (bbox.displayed = false));
    } catch (err) {
      layersList = [];
      bboxList = [];
    }

    this.setState({ layersList, bboxList });
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
    this.saveToLocalStorage(layersList, this.state.bboxList);
  }

  saveToLocalStorage(layersList, bboxList) {
    layersList.map(({ name, id }) => ({ name, id }));
    bboxList.map(({ id, name, box }) => ({ id, name, box }));
    localStorage.setItem(
      "LayersList",
      JSON.stringify({ layersList, bboxList })
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
        .then(geojson => this.props.addLayerToMap(layer.id,LayerTypes.GEO_JSON, geojson));
    } else {
      this.props.removeLayerFromMap(layer.id);
    }

    const layersList = this.state.layersList.map(layer =>
      layer.id === layerId ? newLayer : layer
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

  addBoundingBox = bbox => {
    const bboxList = this.state.bboxList.concat([
      {
        box: bbox,
        name: "Bounding Box",
        id: Math.random()
          .toString(36)
          .substring(7)
      }
    ]);
    this.setState({ bboxList });
    this.saveToLocalStorage(this.state.layersList, bboxList);
  };

  toggleBbox = bboxId => {
    let bbox = this.state.bboxList.filter(bbox => bbox.id === bboxId)[0];
    bbox = { ...bbox, displayed: !bbox.displayed };

    if (bbox.displayed) {
        this.props.addLayerToMap(bbox.id, LayerTypes.BOUNDING_BOX, bbox.box);
    } else {
      this.props.removeLayerFromMap(bbox.id);
    }

    const bboxList = this.state.bboxList.map(b =>
      b.id === bboxId ? bbox : b
    );
    this.setState({ bboxList });
  };
  render() {
    const { setDrawRectange, drawedRectange } = this.props;
    return (
      <div className="layers">
        <h3 className="title">
          <LayersIcon className="layers-icon" />
          <span>Layers</span>
        </h3>
        <UploadFile
          concatLayers={this.concatLayers}
          addBoundingBox={this.addBoundingBox}
          setDrawRectange={setDrawRectange}
          drawedRectange={drawedRectange}
        />
        {this.state.layersList.map(layer => (
          <CheckableItem
            highlight={!!this.state.highlighted[layer.id]}
            data={layer.id}
            onClick={this.toggleLayer}
            content={layer.name}
            value={layer.displayed}
            key={layer.id}
          />
        ))}
        <h3 className="title">
          <BoundingBoxIcon className="layers-icon" />
          <span>Bounding Boxes</span>
        </h3>
        {this.state.bboxList.map(bbox => (
          <CheckableItem
            data={bbox.id}
            onClick={this.toggleBbox}
            content={bbox.name}
            value={bbox.displayed}
            key={bbox.id}
          />
        ))}
      </div>
    );
  }
}
