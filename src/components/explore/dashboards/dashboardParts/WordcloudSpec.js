import { createClassFromSpec } from "react-vega";

export default createClassFromSpec({
  spec: {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "A word cloud visualization depicting Vega research paper abstracts.",
    width: 1000,
    height: 500,
    padding: 50,

    data: [
      {
        name: "table",
        transform: [
          {
            type: "window",
            sort: { field: "visits", order: "descending" },
            groupby: ["type"],
            ops: ["count"],
          },
          { type: "filter", expr: "datum.count < 200" },
        ],
      },
    ],

    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "text" },
        range: ["#d5a928", "#652c90", "#939597"],
      },
    ],

    signals: [
      {
        name: "selectedWord",
        update: "data('table') ? '' : ''", // stupid, but this way it resets on rerender
        on: [
          {
            events: "click",
            update: "!datum || datum.text === selectedWord ? '' : datum.text",
            force: false,
          },
        ],
      },
    ],

    marks: [
      {
        type: "text",
        from: { data: "table" },
        encode: {
          enter: {
            text: { field: "text" },
            align: { value: "center" },
            baseline: { value: "alphabetic" },
          },
          update: {
            fill: [
              { test: "selectedWord === datum.text", value: "white" },
              { scale: "color", field: "text" },
            ],
            fillOpacity: { value: 1 },
          },
          hover: {
            fillOpacity: [{ test: "selectedWord === datum.text", value: 1 }, { value: 0.5 }],
          },
        },
        transform: [
          {
            type: "wordcloud",
            size: [1000, 500],
            text: { field: "text" },
            rotate: { field: "datum.angle" },
            font: "Helvetica Neue, Arial",
            fontSize: { field: "datum.visits" },
            fontSizeRange: [12, 56],
            padding: 2,
          },
        ],
      },
    ],
  },
});
