import React, { Component } from "react";

import "./Layers.css";
import { UploadFromFiles, UploadFromUrl } from "./RemoteStorage";
import { ConfirmIcon, UploadIcon } from "../Icons/Icons";
import LoadingIndicator from "../LoadingIndicator";

export default class Layers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layersList: []
    };

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
    this.setState({ layersList: layersList });
  }

  updateLayersList(layersList) {
    this.setState({ layersList });
    localStorage.setItem("LayersList", JSON.stringify(layersList));
  }

  // addLayer(id, url, name) {
  //   const layersList = this.state.layersList.concat({
  //     id: "404",
  //     url: "http://www.google.com",
  //     name: "saranga"
  //   });

  //   this.setState({
  //     layersList
  //   });
  //   localStorage.setItem("LayersList", JSON.stringify(this.state.layersList));
  // }

  addLayerFromUrl(url, name) {
    UploadFromUrl(url).then(id => {
      this.updateLayersList(this.state.layersList.concat({ id, name }));
    });
  }

  chooseFiles() {
    this.setState({ isChoosingFiles: true });
  }

  uploadFiles() {
    this.setState({ isChoosingFiles: false, isUploading: true });
    
    const fileInputElement = document.getElementById("layersUpload");

    UploadFromFiles(fileInputElement).then(layers => {
      this.updateLayersList(this.state.layersList.concat(layers));
      this.setState({isUploading: false});
    });
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
          <p>{layer.id}</p>
        ))}
      </div>
    );
  }
}
