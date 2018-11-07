import React from "react";
import { withAlert } from "react-alert";
import LoadingIndicator from "../LoadingIndicator";
import { ConfirmIcon, CloseIcon, PlusIcon } from "../Icons/Icons";
import { UploadFromFiles } from "./RemoteStorage";

import "./UploadFile.css";

class UploadFile extends React.Component {
  constructor(props) {
    super(props);

    this.chooseFiles = this.chooseFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.closeClick = this.closeClick.bind(this);
  }

  state = {
    isUploading: false,
    isChoosing: false
  };

  chooseFiles() {
    this.setState({ isChoosing: true });
  }

  uploadFiles() {
    this.setState({ isChoosing: false, isUploading: true });

    const fileInputElement = document.getElementById("layersUpload");

    UploadFromFiles(fileInputElement)
      .then(layers => {
        this.props.concatLayers(layers);

        this.setState({ isUploading: false });
      })
      .catch(() => {
        this.props.alert.error("Failed To Upload new layers");
        this.setState({ isUploading: false });
      });
  }

  closeClick() {
    this.setState({ isChoosing: false });
  }

  render() {
    const { isUploading, isChoosing } = this.state;

    if (isUploading) {
      return (
        <div className="upload-files">
          <LoadingIndicator className="upload-loading" />
        </div>
      );
    } else if (isChoosing) {
      return (
        <div className="upload-files">
          <div className="close-panel-button" onClick={this.closeClick}>
            <CloseIcon />
          </div>
          <input id="layersUpload" type="file" name="files" multiple />
          <div className="upload-button" onClick={this.uploadFiles}>
            <ConfirmIcon />
          </div>
        </div>
      );
    } else {
      return (
        <div className="open-panel-button" onClick={this.chooseFiles}>
          <PlusIcon />
        </div>
      );
    }
  }
}

export default withAlert(UploadFile);
