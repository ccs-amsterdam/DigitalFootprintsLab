import { createClassFromSpec } from "react-vega";

export default createClassFromSpec({
  spec: {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 800,
    height: 600,
    padding: 0,
    autosize: {
      type: "pad",
      resize: true,
    },

    data: [
      {
        name: "tree",
        transform: [
          {
            type: "filter",
            expr: "selectedCategory != '' ? datum.type != 'domain' || (selectedCategory == datum.category) : datum.rank < 1000",
          },
          {
            type: "stratify",
            key: "name",
            parentKey: "parent",
          },
          {
            type: "pack",
            field: "count",
            size: [{ signal: "width" }, { signal: "height" }],
          },
          {
            type: "filter",
            expr: "datum.type != 'root'",
          },
        ],
      },
    ],

    signals: [
      {
        name: "selectedCategory",
        value: "",
        on: [
          {
            events: "click",
            update: "datum && datum.type == 'category' ? datum.category : selectedCategory",
            force: false,
          },
          {
            events: "click",
            update: "!datum ? '' : selectedCategory",
            force: false,
          },
        ],
      },
      {
        name: "selectedDatum",
        value: "",
        on: [
          {
            events: "click",
            update: "datum && datum.type == 'domain' ? datum : ''",
            force: "true",
          },
        ],
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
        type: "group",
        name: "categories",
        data: [
          {
            name: "categoryBranch",
            source: "tree",
          },
        ],

        marks: [
          {
            type: "symbol",
            from: { data: "categoryBranch" },
            encode: {
              enter: {
                shape: { value: "circle" },
                fill: [
                  {
                    test: "datum.type == 'domain'",
                    scale: "color",
                    field: "category",
                  },
                  { value: "transparent" },
                ],
                tooltip: { signal: "datum.name" },
              },
              update: {
                x: { field: "x" },
                y: { field: "y" },
                size: { signal: "4 * datum.r * datum.r" },
                stroke: { value: "white" },
                strokeWidth: [{ test: "datum.type == 'category'", value: 10 }, { value: 0.8 }],
              },
              hover: {
                stroke: { value: "white" },
                strokeWidth: [{ test: "datum.type == 'category'", value: 10 }, { value: 2 }],
              },
            },
          },
          {
            type: "image",
            name: "images",
            from: { data: "categoryBranch" },
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
          {
            type: "text",
            name: "label",
            from: { data: "categoryBranch" },
            encode: {
              enter: {
                text: { signal: "datum.type == 'category' ? datum.name : ''" },
                fill: [{ value: "white" }],
              },
            },
          },
        ],
      },
    ],
  },
});
