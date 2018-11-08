import React from "react";

import "./Settings.css";

export function GetWpsServerPath() {
  return localStorage.getItem("wpsServerPath");
}
export function SetWpsServerPath(path) {
  localStorage.setItem("wpsServerPath", path);
}

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.updateWpsServerPath = this.updateWpsServerPath.bind(this);
    this.state = {
      wpsServerPath: ""
    };
  }

  componentDidMount() {
    const wpsServerPath = GetWpsServerPath();
    this.setState({ wpsServerPath });
  }

  updateWpsServerPath(event) {
    const wpsServerPath = event.target.value;
    this.setState({ wpsServerPath });
    this.props.onChange({ ...this.state, wpsServerPath });
    SetWpsServerPath(wpsServerPath);
  }

  render() {
    return (
      <div className="settings-panel">
        <span>WPS server path</span>
        <input
          type="text"
          value={this.state.wpsServerPath}
          onChange={this.updateWpsServerPath}
        />
      </div>
    );
  }
}
