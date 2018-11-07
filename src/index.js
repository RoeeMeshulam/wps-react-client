import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import store from "./store";
import App from "./App";

import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

const messageBoxOptions = {
  timeout: 5000,
  position: "bottom center",
  zIndex: 1000
};

render(
  <AlertProvider template={AlertTemplate} {...messageBoxOptions}>
    <Provider store={store}>
      <App />
    </Provider>
  </AlertProvider>,
  document.getElementById("root")
);

registerServiceWorker();
