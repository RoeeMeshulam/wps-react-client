import React, { Component } from "react";

import "./Layers.css";

export default class Layers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layersList: []
    };

    this.fetchLayersList = this.fetchLayersList.bind(this);
    this.addLayer = this.addLayer.bind(this);
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
    // console.log(localStorage.getItem('LayersList'));
    this.setState({ layersList: layersList });
  }

  addLayer(id, url, name) {
    this.fetchLayersList();
    this.setState({
      layersList: this.state.layersList.concat({
        id: "404",
        url: "http://www.google.com",
        name: "saranga"
      })
    });
    localStorage.setItem("LayersList", JSON.stringify(this.state.layersList));
  }

  getLayerData() {}

  render() {
    return (
      <div className="layers">
        <button onClick={this.addLayer}>add layer</button>
        {this.state.layersList.map(layer => (
          <p>{layer.id}</p>
        ))}
      </div>
    );
  }
}
