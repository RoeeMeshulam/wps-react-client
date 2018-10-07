import axios from "axios";
import { layerServerPath } from "../../config";

export function GetLayerData(id) {
  return axios.get(`${layerServerPath}/layer/${id}`);
}

export function UploadFromUrl(url) {
  return axios
    .post(`${layerServerPath}/api/urlUpload`, { url })
    .then(res => res.data.id);
}

export function UploadFromFiles(element) {
  const formData = new FormData();

  for (let i = 0; i < element.files.length; i += 1) {
    formData.append("files", element.files[i]);
  }

  return axios
    .post(`${layerServerPath}/api/convertUpload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => res.data.ids);
}
