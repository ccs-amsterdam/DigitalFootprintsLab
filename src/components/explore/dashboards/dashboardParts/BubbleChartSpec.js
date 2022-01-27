import { createClassFromSpec } from "react-vega";

export default createClassFromSpec({
  spec: {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 500,
    height: 500,
    padding: 0,
    autosize: {
      type: "fit",
      resize: true,
    },

    data: [
      {
        name: "tree",
        transform: [
          {
            type: "filter",
            expr: "if(selectedDatum === null, datum.name == selectedDatum.name, true)",
          },
          {
            type: "stratify",
            key: "name",
            parentKey: "parent",
          },
          {
            type: "pack",
            field: "count",
            sort: { field: "count" },
            size: [{ signal: "width" }, { signal: "height" }],
          },

          {
            type: "filter",
            expr: "datum.type != 'root' && datum.type != 'category'",
          },
        ],
      },
    ],

    signals: [
      {
        name: "selectedDatum",
        value: "null",
        on: [{ events: "click", update: "datum", force: "true" }],
      },
    ],

    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: { data: "tree", field: "category" },
        range: { scheme: "category20" },
      },
    ],

    marks: [
      {
        type: "symbol",
        from: { data: "tree" },
        encode: {
          enter: {
            shape: { value: "circle" },
            fill: { scale: "color", field: "category" },
            tooltip: { signal: "datum.name" },
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            size: { signal: "4 * datum.r * datum.r" },
            stroke: { value: "white" },
            strokeWidth: { value: 0.8 },
          },
          hover: {
            stroke: { value: "white" },
            strokeWidth: { value: 2 },
          },
        },
      },
      {
        type: "image",
        name: "images",
        from: { data: "tree" },
        encode: {
          enter: {
            url: { signal: "datum.r < 16 ? '' : datum.logo" },
            tooltip: { signal: "datum.name" },
          },
          update: {
            x: { signal: "datum.x - min(datum.r, 32) / 2" },
            y: { signal: "datum.y - min(datum.r, 32) / 2" },
            width: { signal: "min(datum.r, 32)" },
            height: { signal: "min(datum.r, 32)" },
          },
          hover: {
            stroke: { value: "red" },
            strokeWidth: { value: 2 },
          },
        },
      },
    ],
  },
});
