import React from "react";
import PropTypes from "prop-types";
import {
  Map as LeafletMap,
  TileLayer,
  GeoJSON,
  Rectangle,
  Popup
} from "react-leaflet";
import L from "leaflet";
import { tileLayerTemplate } from "../../config";
import LayerTypes from "../../common/LayerTypes";
import { popupFormat } from "../../common/utils/featuePopup";
import tryParseFloat from "../../common/utils/tryParseFloat";

const sizes = {
  small: 4,
  medium: 8,
  large: 12
};

class MapComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!props.isDrawingRectange && state.drawData) {
      return {
        drawData: null
      };
    } else return null;
  }

  state = {
    popup: null,
    lat: 31.84,
    lng: 34.84,
    zoom: 7,
    height: 0,
    drawData: null
  };

  bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

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

  onClick_Marker = e => {
    console.log(e);
    const fp = e.target.feature.properties || {};
    this.setState({
      popup: {
        id: Math.random()
          .toString(36)
          .substring(7),
        position: e.latlng,
        ...popupFormat(fp)
      }
    });
  };

  pointToLayer = (f, latlon) => L.circleMarker(latlon, {});

  // Symology based on simplestyle-spec v1.1.0 of MapBox
  // https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
  featureStyle = feature => {
    const fp = feature.properties || {};
    const fg = feature.geometry || {};
    if (fg.type === "MultiPoint" || fg.type === "Point") {
      const size = fp["marker-size"] || "medium";
      // const symbol = fp["marker-symbol"] ? "-" + fp["marker-symbol"] : "";
      const color = fp["marker-color"] || "#7e7e7e";
      return {
        radius: sizes[size],
        fillColor: color,
        weight: 0,
        fillOpacity: 1
      };
    } else {
      const stroke = fp["stroke"] || "#555555";
      const strokeOpacity = tryParseFloat(fp["stroke-opacity"], 1);
      const strokeWidth = tryParseFloat(fp["stroke-width"], 2);
      const fill = fp["fill"] || "#555555";
      const fillOpacity = tryParseFloat(fp["fill-opacity"], 0.6);
      return {
        color: stroke,
        weight: strokeWidth,
        opacity: strokeOpacity,
        fillColor: fill,
        fillOpacity
      };
    }
  };

  onEachFeature = (feature, layer) => {
    layer.on("click", this.onClick_Marker);
  };

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

  lockingLeafletParams = () => ({
    dragging: !this.props.isDrawingRectange,
    touchZoom: !this.props.isDrawingRectange,
    doubleClickZoom: !this.props.isDrawingRectange,
    scrollWheelZoom: !this.props.isDrawingRectange
  });

  render() {
    const position = [this.state.lat, this.state.lng];
    const { isDrawingRectange } = this.props;
    const { drawData, popup } = this.state;
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
      .map(({ id, data: { west, east, south, north } }) => ({
        bounds: L.latLngBounds(L.latLng(south, west), L.latLng(north, east)),
        id
      }));
    return (
      <div>
        <LeafletMap
          center={position}
          zoom={this.state.zoom}
          style={{ height: `${this.state.height}px` }}
          onmousedown={this.onMouseDown}
          onmouseup={this.onMouseUp}
          onmousemove={this.onMouseMove}
          maxBounds={this.bounds}
          minZoom={3}
          {...this.lockingLeafletParams()}
        >
          <TileLayer url={tileLayerTemplate} />
          {geoJsons.map(layer => (
            <GeoJSON
              key={layer.id}
              data={layer.data}
              style={this.featureStyle}
              pointToLayer={this.pointToLayer}
              onEachFeature={this.onEachFeature}
            />
          ))}
          {rectangles.map(({ id, bounds }) => (
            <Rectangle key={id} bounds={bounds} />
          ))}
          {drawedRectangle}
          {popup ? (
            <Popup key={popup.id} position={popup.position}>
              <div>
                <h3>{popup.title}</h3>
                <p>{popup.description}</p>
                <table>{popup.rows}</table>
              </div>
            </Popup>
          ) : null}
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
