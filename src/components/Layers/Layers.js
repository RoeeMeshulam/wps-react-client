import React, { Component } from "react";

import "./Layers.css";
import {
  UploadFromFiles,
  UploadFromUrl,
  GetLayerUrlFromId
} from "./RemoteStorage";
import { ConfirmIcon, UploadIcon } from "../Icons/Icons";
import LoadingIndicator from "../LoadingIndicator";
import Checkbox from "./checkbox";
import axios from "axios";
import Promise from "bluebird"

export default class Layers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layersList: []
    };

    this.toggleLayer = this.toggleLayer.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.chooseFiles = this.chooseFiles.bind(this);
  }

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
      layersList = [];
    }
    layersList.forEach(layer => (layer.displayed = false));
    this.setState({ layersList: layersList });
  }

  updateLayersList(layersList) {
    this.setState({ layersList });
    localStorage.setItem(
      "LayersList",
      JSON.stringify(
        layersList.map(({ name, id, url }) => ({
          name,
          id,
          url
        }))
      )
    );
  }

  toggleLayer(layerId) {
    const layer = this.state.layersList.filter(
      layer => layer.id === layerId
    )[0];
    const newLayer = { ...layer, displayed: !layer.displayed };
    if (newLayer.displayed) {
      axios
        .get(layer.url) //, { transformResponse: [], responseType: "arraybuffer" }
        // .then(({ data }) => {
        //   return new TextDecoder("utf-8").decode(data)
        // })
        .then(({data})=> data)
        .then(geojson => this.props.addLayer(layer.name, geojson));
    }

    const layersList = this.state.layersList.map(
      layer => (layer.id === layerId ? newLayer : layer)
    );
    this.setState({ layersList });
  }

  addLayerFromUrl(url, name) {
    UploadFromUrl(url).then(id => {
      this.updateLayersList(
        this.state.layersList.concat({ id, name, url: GetLayerUrlFromId(id) })
      );
    });
  }

  chooseFiles() {
    this.setState({ isChoosingFiles: true });
  }

  uploadFiles() {
    this.setState({ isChoosingFiles: false, isUploading: true });

    const fileInputElement = document.getElementById("layersUpload");

    UploadFromFiles(fileInputElement)
      .then(layers =>
        layers.map(({ id, name }) => ({ id, name, url: GetLayerUrlFromId(id) }))
      )
      .then(layers => {
        this.updateLayersList(this.state.layersList.concat(layers));
        this.setState({ isUploading: false });
      })
      .catch(() => this.setState({ isUploading: false }));
  }

  render() {
    const { isChoosingFiles, isUploading } = this.state;

    let UploadComponent;
    if (isUploading) {
      UploadComponent = <LoadingIndicator />;
    } else if (isChoosingFiles) {
      UploadComponent = (
        <div>
          <input id="layersUpload" type="file" name="files" multiple />
          <div className="svg-button" onClick={this.uploadFiles}>
            <ConfirmIcon />
          </div>
        </div>
      );
    } else {
      UploadComponent = (
        <div className="svg-button" onClick={this.chooseFiles}>
          <UploadIcon />
        </div>
      );
    }

    return (
      <div className="layers">
        {UploadComponent}
        {this.state.layersList.map(layer => (
          <div className="layer" key={layer.id}>
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
