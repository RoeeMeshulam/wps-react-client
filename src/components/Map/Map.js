import React from 'react';
import PropTypes from 'prop-types';
import { Map as LeafletMap, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet'
import { tileLayerTemplate } from '../../config';

class MapComponent extends React.Component {
  constructor () {
    super();

    this.state = {
      lat: 31.84,
      lng: 34.84,
      zoom: 7,
      height: 0,
    };

    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions () {
    const height = window.innerHeight;
    this.setState({height: height});
  }

  componentDidMount () {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions);
  }

  pointToLayer(feature, latlng) {
    // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
    // parameters to style the GeoJSON markers
    const markerParams = {
      radius: 4,
      fillColor: 'black',
      color: '#fff',
      weight: 0,
      fillOpacity: 1
    };

    return L.circleMarker(latlng, markerParams);
  }

  render () {
    const position = [this.state.lat, this.state.lng];
    return (
      <div>
        <LeafletMap
          center={position}
          zoom={this.state.zoom}
          style={{height: `${this.state.height}px`}}
        >
          <TileLayer
            url={tileLayerTemplate}
          />
          {this.props.layers.map(layer => <GeoJSON data={layer.data} pointToLayer={this.pointToLayer} />)}
        </LeafletMap>
      </div>
    );
  }
}

MapComponent.propTypes = {
  layers: PropTypes.array.isRequired,
  removeLayer: PropTypes.func.isRequired,
};

export default MapComponent;