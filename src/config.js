export const wpsServerUrl = "http://localhost:5000/wps";
// export const wpsServerUrl = "http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService";

export const tileLayerTemplate = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";

export const version = "1.0.0";

export const queryHistoryStorageKey = "QueryHistory";

export const layerServerPath = "http://localhost:3001";

export const isGeoJsonMimeType = mimeType =>
  mimeType === "application/json" || mimeType === "application/vnd.geo+json";
