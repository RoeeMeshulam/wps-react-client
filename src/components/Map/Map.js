import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';

export default class Map extends React.Component {
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
    const height = window.innerHeight * 0.95;
    this.setState({height: height});
  }

  componentDidMount () {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render () {
    const position = [this.state.lat, this.state.lng];
    return (
      <div style={{margin: '2.5%'}}>
        <LeafletMap center={position}
                    zoom={this.state.zoom}
                    style={{height: `${this.state.height}px`}}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
        </LeafletMap>
      </div>
    );
  }
}