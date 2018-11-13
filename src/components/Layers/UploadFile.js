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


  static getDerivedStateFromProps(props, state) {
    if(state.drawingBbox && props.drawedRectange){
      props.addBoundingBox(props.drawedRectange)
      props.setDrawRectange(false)
      return {
        drawingBbox: false
      }
    }
    return null;
  }

  state = {
    isUploading: false,
    isChoosing: false,
    drawingBbox: false
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
    this.setState({ isChoosing: false, drawingBbox: false });
  }

  //setDrawRectange={setDrawRectange} drawedRectange={drawedRectange}
  startDrawBbox = () => {
    const drawingBbox = !this.state.drawingBbox;

    this.props.setDrawRectange(drawingBbox);

    this.setState({ drawingBbox });
  };

  render() {
    const { isUploading, isChoosing } = this.state;

    if (isUploading) {
      return (
        <div className="upload-files">
          <LoadingIndicator className="upload-loading" />
        </div>
      );
    } else if (isChoosing) {
      const { drawingBbox } = this.state;
      return (
        <div className="upload-files">
          <div className="close-panel-button" onClick={this.closeClick}>
            <CloseIcon />
          </div>
          <div className="upload-button" onClick={this.uploadFiles}>
            <ConfirmIcon />
          </div>
          <input id="layersUpload" type="file" name="files" multiple />
          <div className="or-label">OR</div>
          <button className="bbox-draw-start" onClick={this.startDrawBbox}>
            {drawingBbox
              ? "Waiting... click for cancel"
              : "Draw new bounding box"}
          </button>
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
