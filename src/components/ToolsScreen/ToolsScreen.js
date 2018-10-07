import React from "react";
import Select from "react-select";
import Promise from "bluebird";

import QueryHistory from "./QueryHistory";
import "./ToolsScreen.css";
import { wpsServerUrl, version } from "../../config";
import ProcessForm from "../ProcessForm";
import {
  CreateClientInstance,
  GetCapabilies,
  DescribeProcess,
  ExecuteProcess
} from "../../utils/wpsjs";
import { Statuses, QueryRecord } from "./QueryRecord";
import { generateInputsFromDescription } from "../ProcessForm/ProcessFormUtils";
import ResultsPanel from "../ResultsPanel";
import LoadingIndicator from "../LoadingIndicator";

export default class ToolsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      history: this.fetchHistory(),
      isLoading: false,
      selectedProcessId: null
    };

    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleExecuteProcess = this.handleExecuteProcess.bind(this);
    this.getLayerData = this.getLayerData.bind(this);

    this.getQueryHistory = this.getQueryHistory.bind(this);
    this.setQueryHistory = this.setQueryHistory.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.setQueryAsForm = this.setQueryAsForm.bind(this);
  }

  loadCapabilies() {
    if (this.state.isLoading) return Promise.reject("Error: Already Loading");

    this.setState({ isLoading: true, processes: [] });
    return GetCapabilies(this.wps)
      .then(capabilities => {
        const processes = capabilities.processes.map(process => ({
          value: process.identifier,
          label: process.title || process.identifier
        }));
        this.setState({
          processes,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({ isLoading: false }); // todo handle error text
        throw err;
      });
  }

  loadProcess(identifier) {
    if (this.state.isLoading) return Promise.reject("Error: Already Loading");

    this.setState({ isLoading: true, currentProcessData: null });

    return DescribeProcess(this.wps, identifier)
      .then(process => {
        const formContent = generateInputsFromDescription(process);
        this.setState({
          isLoading: false,
          currentProcessData: process,
          formContent
        });
      })
      .catch(err => {
        this.setState({ isLoading: false }); // todo handle error text
        throw err;
      });
  }

  componentDidMount() {
    this.wps = CreateClientInstance(wpsServerUrl, version);
    this.loadCapabilies();
    // todo Catch and message error + try again button
  }

  handleProcessChange(selected) {
    this.setState({ selectedProcessId: selected.value });
    this.loadProcess(selected.value);
    // todo Catch and message error + try again button
  }

  handleExecuteProcess() {
    let { formContent, isLoading, currentProcessData } = this.state;

    if (isLoading) return;

    const record = new QueryRecord(
      this.wps.settings.url,
      this.state.currentProcessData.identifier,
      this.state.currentProcessData.title,
      formContent,
      null, //outputs,
      Statuses.RUNNING
    );
    this.addQuery(record);

    const { queryId } = record;
    
    this.setState({ isLoading: true })

    ExecuteProcess(
      this.wps,
      formContent,
      currentProcessData,
      this.getLayerData,
      "application/vnd.geo+json"
    )
      .then(
        response => {
          const {outputs} = response.responseDocument;
          console.log(response.responseDocument);
          this.setState({outputs})
          this.setQueryStatus(queryId, Statuses.SUCCESS);
        },
        err => {
          this.setQueryStatus(queryId, Statuses.FAIL);
        }
      )
      .then(() => this.setState({ isLoading: false }));
  }

  onFormChange(formContent) {
    this.setState({ formContent });
  }

  /**
   * @param {QueryRecord} queryRecord
   */
  setQueryAsForm(queryRecord) {
    this.setState({ selectedProcessId: queryRecord.precessIdentifier });
    this.loadProcess(queryRecord.precessIdentifier).then(() => {
      this.setState({
        formContent: queryRecord.inputs
      });
    });
  }

  render() {
    const {
      processes,
      selectedProcessId,
      currentProcessData,
      formContent,
      isLoading,
      outputs
    } = this.state;
    return (
      <div className="wps-tools">
        <Select
          value={processes.filter(p => p.value === selectedProcessId)[0]}
          onChange={this.handleProcessChange}
          options={processes}
        />
        {isLoading ? <LoadingIndicator /> : null}
        {currentProcessData && !isLoading ? (
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
        {outputs ? <ResultsPanel outputs={outputs} /> : null}
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
      },
      {
        displayName: "github New York example",
        id: 21,
        url:
          "https://raw.githubusercontent.com/ebrelsford/geojson-examples/master/596acres-02-18-2014.geojson"
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
