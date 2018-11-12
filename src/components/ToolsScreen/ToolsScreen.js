import React from "react";
import Select from "react-select";
import Promise from "bluebird";
import { withAlert } from "react-alert";

import QueryHistory from "./QueryHistory";
import "./ToolsScreen.css";
import { wpsServerUrl, version, isGeoJsonMimeType } from "../../config";
import ProcessForm from "../ProcessForm";
import {
  CreateClientInstance,
  GetCapabilies,
  DescribeProcess,
  ExecuteProcess
} from "../../common/utils/wpsjs";
import { Statuses, QueryRecord } from "./QueryRecord";
import { generateInputsFromDescription } from "../ProcessForm/ProcessFormUtils";
import ResultsPanel from "../ResultsPanel";
import LoadingIndicator from "../LoadingIndicator";
import { SettingsIcon } from "../Icons/Icons";
import { Settings, GetWpsServerPath, SetWpsServerPath } from "./Settings";

class ToolsScreen extends React.Component {
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

    this.zoomToLayer = this.zoomToLayer.bind(this);
    this.addLayer = this.addLayer.bind(this);

    this.toggleSettings = this.toggleSettings.bind(this);
    this.settingsChanges = this.settingsChanges.bind(this);
  }

  loadCapabilies() {
    if (this.state.isLoading) {
      this.props.alert.error("Error: Already loading processes list");
      return;
    }

    this.setState({ isLoading: true, processes: [] });
    GetCapabilies(this.wps)
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
      .catch(() => {
        this.props.alert.error(
          "Failed to load processes. Please try again later."
        );
        this.setState({ isLoading: false }); // todo handle error text
      });
  }

  loadProcess(identifier) {
    if (this.state.isLoading)
      return Promise.reject(new Error("Error: Already Loading"));

    this.setState({
      outputs: null,
      isHistoryOutputs: false,
      isLoading: true,
      currentProcessData: null
    });

    return DescribeProcess(this.wps, identifier)
      .then(process => {
        const formContent = generateInputsFromDescription(process);
        this.setState({
          isLoading: false,
          currentProcessData: process,
          processErrorMessage: null,
          formContent
        });
      })
      .catch(err => {
        this.props.alert.error(
          "Failed to load process. Please try again later."
        );
        this.setState({ isLoading: false });
        throw err;
      });
  }

  componentDidMount() {
    let serverPath = GetWpsServerPath();
    if (!serverPath) {
      serverPath = wpsServerUrl;
      SetWpsServerPath(serverPath);
    }

    this.wps = CreateClientInstance(serverPath, version);
    this.loadCapabilies();
    // todo try again button
  }

  handleProcessChange(selected) {
    this.setState({ selectedProcessId: selected.value });
    this.loadProcess(selected.value);
    // todo Catch and message error + try again button
  }

  handleExecuteProcess() {
    const { formContent, isLoading, currentProcessData } = this.state;
    const complexAsReference = !!this.props.complexAsReference;

    if (isLoading) return;

    const record = new QueryRecord(
      this.wps.settings.url,
      this.state.currentProcessData.identifier,
      this.state.currentProcessData.title,
      formContent,
      [],
      Statuses.RUNNING
    );
    this.addQuery(record);

    const { queryId } = record;

    this.setState({ isLoading: true });

    ExecuteProcess(
      this.wps,
      formContent,
      currentProcessData,
      this.getLayerData,
      isGeoJsonMimeType,
      complexAsReference
    )
      .then(response => {
        const layersForMap = [];
        const outputs = [];

        response.responseDocument.outputs.forEach(output => {
          if (output.reference || output.data.complexData) {
            layersForMap.push(output);
          } else {
            outputs.push({
              name: output.title,
              identifier: output.identifier,
              literal: output.data.literalData.value
            });
          }
        });

        Promise.all(layersForMap.map(this.addLayer))
          .then(ids => {
            ids.forEach((id, i) => {
              outputs.push({
                name: layersForMap[i].title,
                identifier: layersForMap[i].identifier,
                layer: id
              });
            });

            this.setQuery(queryId, {
              status: Statuses.SUCCESS,
              outputs,
              isHistoryOutputs: false
            });
            this.setState({
              outputs,
              processErrorMessage: null
            });
          })
          .catch(err => {
            console.error("Failed to add one or some layers", err);
            throw new Error(
              "Process succeeded but failed to add one or some layers"
            );
          });
      })
      .catch(err => {
        this.setQuery(queryId, { status: Statuses.FAIL });
        this.setState({ processErrorMessage: err.message });
        this.props.alert.error(
          `Failed in Process ${this.state.currentProcessData.title}`
        );
      })
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
    this.loadProcess(queryRecord.precessIdentifier).then(
      () =>
        this.setState({
          formContent: queryRecord.inputs,
          outputs: queryRecord.outputs,
          isHistoryOutputs: true,
          processErrorMessage: null
        }),
      () => {}
    );
  }

  toggleSettings() {
    let { settingsOpen } = this.state;
    settingsOpen = !settingsOpen;
    this.setState({ settingsOpen });

    // Reload capabilities on settings close
    if (!settingsOpen) {
      this.loadCapabilies();
    }
  }

  settingsChanges(settings) {
    const { wpsServerPath } = settings;
    this.wps = CreateClientInstance(wpsServerPath, version);
  }

  render() {
    const {
      processes,
      selectedProcessId,
      currentProcessData,
      formContent,
      isLoading,
      outputs,
      processErrorMessage,
      isHistoryOutputs,
      settingsOpen
    } = this.state;
    return (
      <div className="wps-tools">
        <div className="tools-header">
          <Select
            className="process-select"
            isDisabled={isLoading}
            value={processes.filter(p => p.value === selectedProcessId)[0]}
            onChange={this.handleProcessChange}
            options={processes}
          />
          <div onClick={this.toggleSettings}>
            <SettingsIcon
              className={`settings-icon ${settingsOpen ? "active" : ""}`}
            />
          </div>
        </div>
        {isLoading ? <LoadingIndicator /> : null}
        <div className="process-content">
          {processErrorMessage && !isLoading ? (
            <p className="process-error-message">
              <strong>
                Process have failed :( <br />
                <br />
                Error:{" "}
              </strong>
              {processErrorMessage}
            </p>
          ) : null}
          {outputs && outputs.length > 0 && !isLoading ? (
            <ResultsPanel
              isHistoryOutputs={isHistoryOutputs}
              outputs={outputs}
              layerZoom={this.zoomToLayer}
            />
          ) : null}
          {currentProcessData && !isLoading ? (
            <ProcessForm
              inputs={formContent}
              layers={this.getAllLayers()}
              onChange={this.onFormChange}
              onSubmit={this.handleExecuteProcess}
            />
          ) : null}
        </div>
        <QueryHistory
          history={this.state.history}
          onClick={this.setQueryAsForm}
        />
        {settingsOpen ? <Settings onChange={this.settingsChanges} /> : null}
      </div>
    );
  }

  /**
   * @param {string} queryId
   * @param {number} status
   */
  setQuery(queryId, record) {
    const history = this.state.history.map(rec =>
      rec.queryId === queryId
        ? Object.assign(new QueryRecord(), rec, record)
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

  getAllLayers() {
    return this.props.getLayers();
  }

  getLayerData(id) {
    return this.getAllLayers().filter(x => x.id === id)[0].url;
  }

  addLayer(layer) {
    return this.props.addLayer(layer);
  }

  zoomToLayer(layerId) {
    this.props.zoomToLayer(layerId);
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

export default withAlert(ToolsScreen);
