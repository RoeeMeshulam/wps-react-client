import React from "react";
import { LayersIcon } from "../Icons/Icons";

import "./MimetypeDropdown.css";
import FileFormats from "../../common/FileFormats";

export default class MimetypeDropdown extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    isActive: false
  };

  toFocusElement = null;

  onButtonClick = () => {
    if (this.state.isActive) {
      this.setState({ isActive: false });
    } else {
      this.setState({ isActive: true });
      if (this.toFocusElement) {
        this.toFocusElement.focus();
      }
    }
  };

  getMimeTypeDsiplayName(mimeType) {
    const mimeTypeDetails = FileFormats[mimeType];
    if (mimeTypeDetails) {
      return `${mimeTypeDetails.displayName} (${mimeTypeDetails.ext})`;
    } else {
      return mimeType;
    }
  }

  onItemClick = event => {
    const i = parseInt(
      event.currentTarget.id.replace("mimetype-menu-item-", ""),
      10
    );
    this.props.onChange(this.props.options[i]);
    this.setState({ isActive: false });
  };

  onBlur = () => {
    this.setState({ isActive: false });
  };

  onContentRef = element => {
    this.toFocusElement = element;
  };

  render() {
    const { isActive } = this.state;
    const { options } = this.props;
    return (
      <div
        className={`mimetype-menu ${isActive ? "active" : ""}`}
        ref={this.onContentRef}
        onBlur={this.onBlur}
        tabIndex="0"
      >
        <div className="mimetype-menu-button" onClick={this.onButtonClick}>
          <div className="arrow" />
          <LayersIcon className="process-form-icon" />
        </div>
        {isActive ? (
          <div className="mimetype-menu-content">
            {options.map(({ mimeType }, i) => (
              <div
                key={i}
                id={`mimetype-menu-item-${i}`}
                className="mimetype-menu-item"
                onClick={this.onItemClick}
              >
                {this.getMimeTypeDsiplayName(mimeType)}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
