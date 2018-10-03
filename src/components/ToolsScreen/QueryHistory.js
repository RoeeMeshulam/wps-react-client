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
  render() {
    return (
      <div className="query-history">
        {this.props.history.map(a => (
          <div
            key={a.queryId}
            id={`query-record-${a.queryId}`}
            className="query-record"
            onClick={this.onRecordClick}
          >
            <div>
              {this.getStatusTag(a.status)}
              <span className="title">{a.title}</span>
              <span className="request-time">
                {moment(a.timestamp).fromNow()}
              </span>
            </div>
            <p className="content">{`${a.inputs.length} inputs, ${0} output`}</p>
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
