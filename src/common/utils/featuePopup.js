

import React from 'react';

const IgnoreFields = {
  title: true,
  description: true,
  "marker-size": true,
  "marker-symbol": true,
  "marker-color": true,
  stroke: true,
  "stroke-opacity": true,
  "stroke-width": true,
  fill: true,
  "fill-opacity": true
};

export function popupFormat(properties) {
  const title = properties.title || "Feature";
  const description = properties.description || "";
  const rows = Object.keys(properties)
    .filter(key => !IgnoreFields.hasOwnProperty(key))
    .map(key => <tr><th>{key}</th><th>{properties[key]}</th></tr>)

  return { title, description, rows };
}
