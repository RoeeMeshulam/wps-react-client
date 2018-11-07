import React from "react";
import PropTypes from "prop-types";

import moment from "moment";

import { QueryRecord, Statuses } from "./QueryRecord";
import "./QueryHistory.css";

const StatusDisplayMap = {
  [Statuses.SUCCESS]: {
    color: "green",
    text: "Success"
  },
  [Statuses.FAIL]: {
    color: "#cc5858",
    text: "Failed"
  },
  [Statuses.RUNNING]: {
    color: "lightblue",
    text: "Running"
  },
  [Statuses.SAVE_WITHOUT_RUN]: {
    color: "lightblue",
    text: "Saved"
  }
};

export default class QueryHistory extends React.Component {
  constructor(props) {
    super(props);

    this.onRecordClick = this.onRecordClick.bind(this);
  }

  onRecordClick(e) {
    const id = e.currentTarget.id.replace("query-record-", "");
    return this.props.onClick(
      this.props.history.filter(rec => rec.queryId === id)[0]
    );
  }


  getStatusTag(status){
    const statusDisplay = StatusDisplayMap[status] || StatusDisplayMap[Statuses.FAIL];
    return <span className="status-tag" style={{backgroundColor:statusDisplay.color}}>{statusDisplay.text}</span>
  }

  numberToStr = number => number === 0 ? 'No' : `${number}`

  render() {
    return (
      <div className="query-history">
        {this.props.history.map(rec => (
          <div
            key={rec.queryId}
            id={`query-record-${rec.queryId}`}
            className="query-record"
            onClick={this.onRecordClick}
          >
            <div>
              {this.getStatusTag(rec.status)}
              <span className="title">{rec.title}</span>
              <span className="request-time">
                {moment(rec.timestamp).fromNow()}
              </span>
            </div>
            <p className="content">{`${this.numberToStr(rec.inputs.length)} inputs, ${this.numberToStr(rec.outputs.length)} outputs`}</p>
          </div>
        ))}
      </div>
    );
  }
}

QueryHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.instanceOf(QueryRecord)),
  onClick: PropTypes.func
};
