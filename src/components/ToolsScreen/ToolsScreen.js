import React from "react";
import _ from "lodash";
import Select from "react-select";

import { pyWpsUrl, version } from "../../config";
import ProcessForm from "../ProcessForm/ProcessForm";
import { wpsServerUrl, version } from "../../config";
import ProcessForm from "../ProcessForm";
import { GetInputGenerator, CreateClientInstance, GetOutputGenerator } from "../../utils/wpsjs";

export default class ToolsScreen extends React.Component {
  constructor (props) {
    this.state = {
      processes: [],
      processInputs: []
    };

    this.getCapabilitiesCallback = this.getCapabilitiesCallback.bind(this);
    this.getDescribeCallback = this.getDescribeCallback.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleExecuteProcess = this.handleExecuteProcess.bind(this);
    this.handleExecuteResponse = this.handleExecuteResponse.bind(this);
  }

  componentDidMount() {
    this.wps = CreateClientInstance(wpsServerUrl, version);
    this.wps.getCapabilities_GET(this.getCapabilitiesCallback);
  }

  getCapabilitiesCallback(response) {
    const capabilities = response.capabilities;
    this.setState({ processes: capabilities.processes });
  }

  handleProcessChange(selected) {
    this.wps.describeProcess_GET(this.getDescribeCallback, selected.value);
  }

  getDescribeCallback(response) {
    this.setState({ selectedProcess: response.processOffering.process });
  }

  getPotentialLayers() {
    return [
      {
        displayName: "MapBox markers GeoJSON",
        id: 234,
        url: "http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson"
      }
    ];
  }

  handleExecuteProcess(inputs) {
    const outputGenerator = new window.OutputGenerator();
    // const outputs = [];
    const outputs = this.state.selectedProcess.outputs.map(output => {
      if (output.hasOwnProperty("complexData")) {
        let geoJsonOutput = output.complexData.formats.filter(format => format.mimeType === "application/vnd.geo+json")[0]
        if(!geoJsonOutput){
          console.log(`application/vnd.geo+json output not found for ${output.identifier}`) // todo handle more gracefuly
          geoJsonOutput = output.complexData.formats[0];
        }

        return outputGenerator.createComplexOutput_WPS_1_0(
          output.identifier,
          geoJsonOutput.mimeType,
          geoJsonOutput.schema,
          geoJsonOutput.encoding,
          "value"
        );
      } else if (output.hasOwnProperty("literalData")) {
        // todo handle
      }
    });
    this.wps.execute(
      this.handleExecuteResponse,
      this.state.selectedProcess.identifier,
      "document",
      "sync",
      false,
      inputs,
      outputs
    );
  }

  handleExecuteResponse(value) {
    console.log(value);
  }

  render() {
    const { processes, selectedProcess } = this.state;
    return (
      <div style={{ margin: "2.5%" }}>
        <Select
          onChange={this.handleProcessChange}
          options={processes.map(process => ({
            value: process.identifier,
            label: process.identifier
          }))}
        />
        {selectedProcess ? (
          <ProcessForm
            layers={this.getPotentialLayers()}
            inputs={selectedProcess.inputs}
            handleOnSubmit={this.handleExecuteProcess}
          />
        ) : null}
      </div>
    );
  }
}
