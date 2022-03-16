import React from "react";
import { Vega } from "react-vega";
import useResponsiveSize from "./useResponsiveSize";

const VegaCirclePack = ({ data, signalListeners }) => {
  const [size, box] = useResponsiveSize();

  const spec = getSpec(500, size.width, 500, 30);
  return (
    <div ref={box} style={{ height: "100%", width: "100%", maxWidth: "100vw" }}>
      <Vega
        data={data}
        spec={spec}
        signalListeners={signalListeners}
        actions={false}
        renderer={"svg"}
      />
      ;
    </div>
  );
};

export default VegaCirclePack;

const getSpec = (height, width, maxnodes, withimage) => {
  const stretch = width / height;

  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: width,
    height: height,
    autosize: "none",
    data: [
      {
        name: "tree",
        transform: [
          {
            type: "filter",
            expr: "selectedCategory != '' ? datum.type != 'group' || selectedCategory == datum.category : true",
          },
          {
            type: "window",
            sort: { field: "visits", order: "descending" },
            groupby: ["type"],
            ops: ["count"],
          }, // note that tree (input data) needs to be sorted from most to least frequent group
          { type: "filter", expr: `datum.type != 'group' || datum.count < ${maxnodes}` },
          { type: "stratify", key: "id", parentKey: "parent" },
          {
            type: "formula",
            as: "scaledsize",
            expr: "datum.category === selectedCategory && datum.type === 'group' ?  (datum.size * (1/(datum.categorySize))) : datum.size",
          },
          { type: "formula", as: "scaledsize", expr: "pow(datum.scaledsize*1000, 0.8)" },

          // we use circlepacking, but pretend that height*2, and then afterwards divide y by 2 to create (the basis for) ellipse shape
          // and add height and width
          {
            type: "pack",
            field: "scaledsize",
            padding: 2,
            as: ["x", "y", "r"],
            size: [{ signal: "width" }, { signal: `height*${stretch}` }],
          },
          { type: "formula", as: "y", expr: `datum.y / ${stretch}` },
          { type: "formula", as: "width", expr: "datum.r" },
          { type: "formula", as: "height", expr: `datum.r / ${stretch}` },
          { type: "filter", expr: "datum.type != 'root'" },
        ],
      },
      {
        name: "with_image",
        source: "tree",
        transform: [
          { type: "filter", expr: `datum.type === 'group' && datum.count < ${withimage}` },
        ],
      },
    ],

    signals: [
      {
        name: "selectedCategory",
        value: "",
        // on: [
        //   {
        //     events: "click",
        //     update:
        //       "datum && datum.type == 'group' && (isValid(selectedDatum) ? selectedDatum.id !== datum.id : true) ? datum.category : ''",
        //     force: false,
        //   },
        // ],
      },
      {
        name: "selectedDatum",
        value: null,
        update: "data('tree') ? '' : ''", // stupid, but this way it resets on rerender
        on: [
          {
            events: "click",
            update:
              "datum && datum.type == 'group' && (isValid(selectedDatum) ? selectedDatum.id !== datum.id : true) ? datum : ''",
            force: false,
          },
        ],
      },
      {
        name: "cursor",
        value: "default",
        on: [
          {
            events: "path:mouseover",
            update: "'pointer'",
          },
          {
            events: "image:mouseover",
            update: "'pointer'",
          },
          { events: "path:mouseout", update: "'default'" },
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
            path: [
              { test: "true", value: "M-1 0 A1 1 0 1 1 -1 0.01 z" },
              {
                // now not used, but maybe use alternative shape for groups (set test to datum.type === 'category')
                value: `M-1 -0.2 
                    A0.8 0.8 0 0 1 -0.5 -0.7 
                    L0.5 -0.7 
                    A0.8 0.8 0 0 1 1 -0.2
                    L1 0.2 
                    A0.8 0.8 0 0 1 0.5 0.7
                    L-0.5 0.7
                    A0.8 0.8 0 0 1 -1 0.2
                    z
                    `,
              },
            ], // ellipse shape
          },
          update: {
            tooltip: {
              signal: "datum.type === 'category' ? null : datum.label + ' (' + datum.visits + ')'",
            },
            xc: { field: "x" },
            yc: { field: "y" },
            scaleX: { signal: "datum.width" },
            scaleY: { signal: "datum.height" },
            stroke: { value: "#ffffff55" },
            strokeWidth: [{ test: "datum.type == 'category'", value: 2 }, { value: 0.5 }],
            fill: [
              {
                test: "datum.type === 'category' && (datum.category === selectedCategory || selectedCategory === '')",
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
          //enter: { image: { field: "image" }, tooltip: { signal: "datum.label" } },
          enter: {
            url: { field: "icon" },
            tooltip: { signal: "datum.label + ' (' + datum.visits + ')'" },
          },

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
            tooltip: { signal: "datum.label + ' (' + datum.visits + ')'" },
          },
          update: {
            text: {
              signal:
                //`(datum.type === 'category' && (selectedCategory !== datum.category )) || (datum.type === 'group' && (datum.count > ${WITHIMAGE} || !datum.icon)) ? datum.label : null`,
                `(datum.type === 'group' && (datum.count > ${withimage} || !datum.icon)) ? datum.label : null`,
            },
            xc: { field: "x" },
            yc: { field: "y" },
            fontSize: {
              signal: "max(10,(datum.width/10)*(10/length(datum.label || '')))",
            },
            ellipsis: { value: ".." },
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
  };
};
