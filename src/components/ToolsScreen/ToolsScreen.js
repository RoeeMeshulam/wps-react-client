import React from "react";
import Select from "react-select";
import Promise from "bluebird";

import QueryHistory from "./QueryHistory";
import "./ToolsScreen.css";
import { wpsServerUrl, version } from "../../config";
import ProcessForm from "../ProcessForm";
import {
  CreateClientInstance,
  GetOutputGenerator,
  GenerateComplexInput,
  GenerateLiteralInput,
  GetCapabilies
} from "../../utils/wpsjs";
import { Statuses, QueryRecord } from "./QueryRecord";
import {
  generateInputsFromDescription,
  InputTypes
} from "../ProcessForm/ProcessFormUtils";

export default class ToolsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      history: this.fetchHistory(),
      isLoading: false
    };

    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleExecuteProcess = this.handleExecuteProcess.bind(this);
    this.handleExecuteResponse = this.handleExecuteResponse.bind(this);

    this.getQueryHistory = this.getQueryHistory.bind(this);
    this.setQueryHistory = this.setQueryHistory.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.setQueryAsForm = this.setQueryAsForm.bind(this);
  }

  loadCapabilies() {
    if (this.state.isLoading) return Promise.reject("Error: Already Loading");

    this.setState({ isLoading: true, processes: [] });
    return GetCapabilies(this.wps).then(capabilities => {
      this.setState({
        processes: capabilities.processes,
        isLoading: false
      });
    });
  }

  componentDidMount() {
    this.wps = CreateClientInstance(wpsServerUrl, version);
    this.loadCapabilies();
  }

  handleProcessChange(selected) {
    this.wps.describeProcess_GET(response => {
      const { process } = response.processOffering;
      const formContent = generateInputsFromDescription(process);
      this.setState({
        selectedProcess: process,
        formContent
      });
    }, selected.value);
  }

  getDescribeCallback(identifier, formContent) {
    this.wps.describeProcess_GET(response => {
      const { process } = response.processOffering;
      this.setState({
        selectedProcess: process,
        formContent
      });
    }, identifier);
  }

  handleExecuteProcess(inputs) {
    let { formContent } = this.state;
    const outputGenerator = new GetOutputGenerator();
    // const outputs = [];
    const outputs = this.state.selectedProcess.outputs.map(output => {
      if (output.hasOwnProperty("complexData")) {
        let geoJsonOutput = output.complexData.formats.filter(
          format => format.mimeType === "application/vnd.geo+json"
        )[0];
        if (!geoJsonOutput) {
          console.log(
            `application/vnd.geo+json output not found for ${output.identifier}`
          ); // todo handle more gracefuly
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

    const record = new QueryRecord(
      this.wps.settings.url,
      this.state.selectedProcess.identifier,
      this.state.selectedProcess.title,
      formContent,
      outputs,
      Statuses.RUNNING
    );
    this.addQuery(record);

    // Array of arrays of WPS inputs
    const inputsByIdentifier = formContent.map(input =>
      input.values.map(
        value =>
          input.type === InputTypes.COMPLEX
            ? GenerateComplexInput(input.id, this.getLayerData(value))
            : GenerateLiteralInput(input.id, value)
      )
    );

    const flatInputs = Array.prototype.concat.apply([], inputsByIdentifier);

    this.wps.execute(
      this.handleExecuteResponse.bind(null, record.queryId),
      this.state.selectedProcess.identifier,
      "document",
      "sync",
      false,
      flatInputs,
      outputs
    );
  }

  onFormChange(formContent) {
    this.setState({ formContent });
  }

  /**
   * @param {QueryRecord} queryRecord
   */
  setQueryAsForm(queryRecord) {
    this.getDescribeCallback(queryRecord.precessIdentifier, queryRecord.inputs);
  }

  handleExecuteResponse(queryId, response) {
    if (response.hasOwnProperty("errorThrown")) {
      this.setQueryStatus(queryId, Statuses.FAIL);
    } else {
      this.setQueryStatus(queryId, Statuses.SUCCESS);
    }
  }

  render() {
    const { processes, selectedProcess, formContent, isLoading } = this.state;
    return (
      <div className="wps-tools">
        <Select
          onChange={this.handleProcessChange}
          options={processes.map(process => ({
            value: process.identifier,
            label: process.title || process.identifier
          }))}
        />
        {isLoading ? <div className="loader" /> : null}
        {selectedProcess && !isLoading ? (
          <ProcessForm
            inputs={formContent}
            layers={this.getAllLayers()}
            onChange={this.onFormChange}
            onSubmit={this.handleExecuteProcess}
          />
        ) : null}
        <QueryHistory
          history={this.state.history}
          onClick={this.setQueryAsForm}
        />
      </div>
    );
  }

  /**
   * @param {string} queryId
   * @param {number} status
   */
  setQueryStatus(queryId, status) {
    const history = this.state.history.map(
      rec =>
        rec.queryId === queryId
          ? Object.assign(new QueryRecord(), rec, { status })
          : rec
    );

    this.setHistory(history);
  }

  /**
   * @param {string} queryId
   */
  removeQuery(queryId) {
    const history = this.state.history.filter(o => o.queryId !== queryId);
    this.setHistory(history);
  }

  /**
   * @param {QueryRecord} queryRecord
   */
  addQuery(queryRecord) {
    this.setHistory([queryRecord].concat(this.state.history));
  }

  /**
   * @param {Array<QueryRecord>} history
   */
  setHistory(history) {
    this.setState({ history });
    const historyText = JSON.stringify(history);
    this.setQueryHistory(historyText);
  }

  /**
   * @returns {Array<QueryRecord>}
   */
  fetchHistory() {
    const historyText = this.getQueryHistory();
    if (!historyText) {
      return [];
    }
    try {
      return JSON.parse(historyText).map(QueryRecord.fromObject);
    } catch (e) {
      return [];
    }
  }

  //
  //
  //
  // MOCK - should come as props
  //

  getAllLayers() {
    return [
      {
        displayName: "MapBox markers GeoJSON",
        id: 234,
        url: "http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson"
      }
    ];
  }

  getLayerData(id) {
    return this.getAllLayers().filter(x => x.id === id)[0].url;
  }

  addLayer(layer) {
    console.log("added Layer", layer);
  }

  /**
   * @param {string} history
   */
  setQueryHistory(history) {
    this.props.setQueryHistory(history);
  }

  /**
   * @returns {string}
   */
  getQueryHistory() {
    return this.props.getQueryHistory();
  }
}
