import { createClassFromSpec } from "react-vega";

export default createClassFromSpec({
  spec: {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 1000,
    height: 500,
    padding: 20,
    autosize: "none",
    data: [
      {
        name: "tree",
        transform: [
          {
            type: "filter",
            expr: "selectedCategory != '' ? datum.type != 'group' || selectedCategory == datum.category : datum.type != 'group'",
          },
          { type: "window", groupby: ["type"], ops: ["count"] }, // note that tree (input data) needs to be sorted from most to least frequent group
          { type: "filter", expr: "datum.type != 'group' || datum.count < 200" },
          { type: "stratify", key: "id", parentKey: "parent" },
          {
            type: "formula",
            as: "scaledsize",
            expr: "datum.category === selectedCategory && datum.type === 'group' ?  (datum.size * (0.8/(datum.categorySize))) : datum.size",
          },
          { type: "formula", as: "scaledsize", expr: "pow(datum.scaledsize*1000, 0.8)" },

          // we use circlepacking, but pretend that height*2, and then afterwards divide y by 2 to create (the basis for) ellipse shape
          // and add height and width
          {
            type: "pack",
            field: "scaledsize",
            padding: 4,
            as: ["x", "y", "r"],
            size: [{ signal: "width" }, { signal: "height*2" }],
          },
          { type: "formula", as: "y", expr: "datum.y / 2" },
          { type: "formula", as: "width", expr: "datum.r" },
          { type: "formula", as: "height", expr: "datum.r / 2" },
          { type: "filter", expr: "datum.type != 'root'" },
        ],
      },
      {
        name: "with_image",
        source: "tree",
        transform: [{ type: "filter", expr: "datum.type === 'group' && datum.count < 15" }],
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
            update: "!datum || datum.type == 'root' ? '' : selectedCategory",
            force: false,
          },
        ],
      },
      {
        name: "selectedDatum",
        value: null,
        on: [
          {
            events: "click",
            update:
              "datum && datum.type == 'group' && (isValid(selectedDatum) ? selectedDatum.id !== datum.id : true) ? datum : ''",
            force: false,
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
        type: "path",

        from: { data: "tree" },

        encode: {
          enter: {
            path: { value: "M-1 0 A1 1 0 1 1 -1 0.01 z" }, // ellipse shape
          },
          update: {
            tooltip: {
              signal:
                "datum.type === 'category' && datum.category === selectedCategory ? null : datum.name",
            },
            xc: { field: "x" },
            yc: { field: "y" },
            scaleX: { signal: "datum.width" },
            scaleY: { signal: "datum.height" },
            stroke: { value: "white" },
            strokeWidth: [{ test: "datum.type == 'category'", value: 2 }, { value: "0.8" }],
            fill: [
              {
                test: "datum.type === 'category' && datum.category === selectedCategory",
                value: "transparent",
              },
              { test: "isValid(selectedDatum) && selectedDatum.id === datum.id", value: "white" },
              { scale: "color", field: "category" },
            ],
          },
          // hover: {
          //   stroke: { value: "white" },
          //   strokeWidth: [{ test: "datum.type == 'category'", value: 5 }, { value: 2 }],
          // },
        },
      },
      {
        type: "image",
        name: "icon",
        from: { data: "with_image" },
        encode: {
          enter: { url: { field: "icon" }, tooltip: { signal: "datum.name" } },
          update: {
            xc: { field: "x" },
            yc: { field: "y" },
            width: { signal: "min(datum.width,32)" },
            height: { signal: "min(datum.height,32)" },
          },
        },
      },
      {
        type: "text",
        name: "label",
        from: { data: "tree" },
        encode: {
          enter: {
            tooltip: { field: "name" },
          },
          update: {
            text: {
              signal:
                "(datum.type === 'category' && (selectedCategory !== datum.category )) || (datum.type === 'group' && (datum.count > 15 || !datum.icon)) ? datum.label : null",
            },
            xc: { field: "x" },
            yc: { field: "y" },
            fontSize: {
              signal: "max(10,(datum.width/10)*(10/length(datum.name)))",
            },
            ellipsis: { value: "-" },
            align: { value: "center" },
            limit: { signal: "datum.width*1.8" },
            baseline: { value: "middle" },
            fill: {
              signal:
                "selectedCategory === datum.category && datum.type === 'category' ? '#00000096' : 'black'",
            },
          },
        },
      },
    ],
  },
});
