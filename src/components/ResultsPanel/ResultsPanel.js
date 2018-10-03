import React from "react";

import "./ResultsPanel";

export default function({ outputs }) {
  return (
    <div className="results-panel">
      <h3>Results</h3>
      {outputs.map(output => (<div className="result-item" key={output.identifier}>
      {output.identifier}
      </div>))}
    </div>
  );
}
