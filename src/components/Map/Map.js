import React from "react";
import PropTypes from "prop-types";
import {
  Map as LeafletMap,
  TileLayer,
  GeoJSON,
  Rectangle
} from "react-leaflet";
import L from "leaflet";
import { tileLayerTemplate } from "../../config";
import LayerTypes from "../../common/LayerTypes";

class MapComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!props.isDrawingRectange && state.drawData) {
      return {
        drawData: null
      };
    } else return null;
  }

  state = {
    lat: 31.84,
    lng: 34.84,
    zoom: 7,
    height: 0,
    drawData: null
  };

  updateDimensions = () => {
    const height = window.innerHeight;
    this.setState({ height: height });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  pointToLayer(feature, latlng) {
    // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
    // parameters to style the GeoJSON markers
    const markerParams = {
      radius: 4,
      fillColor: "black",
      color: "#fff",
      weight: 0,
      fillOpacity: 1
    };

    return L.circleMarker(latlng, markerParams);
  }

  onMouseDown = ({ latlng }) => {
    if (this.props.isDrawingRectange) {
      this.setState({
        a: { startCoordinate: latlng, endCoordinate: latlng },
        drawData: {
          startCoordinate: latlng,
          endCoordinate: latlng
        }
      });
    }
  };
  onMouseMove = ({ latlng }) => {
    if (this.state.drawData) {
      this.setState({
        drawData: {
          ...this.state.drawData,
          endCoordinate: latlng
        }
      });
    }
  };
  onMouseUp = ({ latlng }) => {
    if (this.state.drawData) {
      const start = this.state.drawData.startCoordinate;
      const end = latlng;

      this.setState({ drawData: null });

      const west = Math.min(start.lng, end.lng);
      const east = Math.max(start.lng, end.lng);
      const south = Math.min(start.lat, end.lat);
      const north = Math.max(start.lat, end.lat);

      this.props.onDrawingDone({ west, east, south, north });
    }
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    const { isDrawingRectange } = this.props;
    const { drawData } = this.state;
    const drawedRectangle =
      isDrawingRectange && drawData ? (
        <Rectangle
          bounds={L.latLngBounds(
            drawData.startCoordinate,
            drawData.endCoordinate
          )}
        />
      ) : null;

    const geoJsons = this.props.layers.filter(
      ({ layerType }) => layerType === LayerTypes.GEO_JSON
    );
    const rectangles = this.props.layers
      .filter(({ layerType }) => layerType === LayerTypes.BOUNDING_BOX)
      .map(({ data: { west, east, south, north } }) =>
        L.latLngBounds(L.latLng(south, west), L.latLng(north, east))
      );
    return (
      <div>
        <LeafletMap
          center={position}
          zoom={this.state.zoom}
          style={{ height: `${this.state.height}px` }}
          onmousedown={this.onMouseDown}
          onmouseup={this.onMouseUp}
          onmousemove={this.onMouseMove}
          dragging={!isDrawingRectange}
          touchZoom={!isDrawingRectange}
          doubleClickZoom={!isDrawingRectange}
          scrollWheelZoom={!isDrawingRectange}
        >
          <TileLayer url={tileLayerTemplate} />
          {geoJsons.map(layer => (
            <GeoJSON data={layer.data} pointToLayer={this.pointToLayer} />
          ))}
          {rectangles.map(rec => (
            <Rectangle bounds={rec} />
          ))}
          {drawedRectangle}
        </LeafletMap>
      </div>
    );
  }
}

MapComponent.propTypes = {
  layers: PropTypes.array.isRequired,
  isDrawingRectange: PropTypes.bool,
  onDrawingDone: PropTypes.func
};

export default MapComponent;
