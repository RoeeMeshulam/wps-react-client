import {
  UploadNonLayerFile,
  GetLayerUrlFromId
} from "../components/Layers/RemoteStorage";

export class Input {
  constructor(mimeType) {
    this.mimeType = mimeType;
  }

  getData() {
    throw new Error("Non Implemented");
  }
}

export class LayerInput extends Input {
  constructor(mimeType, layerId) {
    super(mimeType);
    this.layerId = layerId;
  }

  getData() {
    return GetLayerUrlFromId(this.layerId);
  }
}

export class FileInput extends Input {
  constructor(mimeType, file) {
    super(mimeType);
    this.file = file;
  }

  getData() {
    return UploadNonLayerFile(this.file).then(GetLayerUrlFromId);
  }
}
