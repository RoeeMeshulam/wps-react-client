import React from "react";

import "./ResultsPanel.css";
import { LayersIcon } from "../Icons/Icons";

export default class ResultsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onLayerClick = this.onLayerClick.bind(this);
  }

  onLayerClick(event) {
    const output_identifier = event.currentTarget.id.replace(
      "output-layer-logo-",
      ""
    );
    const layerId = this.props.outputs.filter(
      output => output.identifier === output_identifier
    )[0].layer;
    this.props.layerZoom(layerId);
  }

  render() {
    const { isHistoryOutputs, outputs } = this.props;
    return (
      <div className="results-panel">
        <h3>
          <span>Results</span>
          {isHistoryOutputs ? (
            <span className="history-results-comment">(from past process)</span>
          ) : null}
        </h3>
        {outputs.map(output => (
          <div className="result-item" key={output.identifier}>
            <span className="item-title">{output.name}</span>
            {output.literal ? (
              <span className="item-content literal">{output.literal}</span>
            ) : (
              <span
                className="item-content layer"
                id={`output-layer-logo-${output.identifier}`}
                onClick={this.onLayerClick}
              >
                <LayersIcon className="layer-logo" />
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
}
