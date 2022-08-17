import { useEffect, useState } from "react";
import { Vega } from "react-vega";
import useResponsiveSize from "./useResponsiveSize";

const COLORS = ["#e0ca8a", "#8acce0", "#bea5e9"];

const VegaWordcloud = ({
  data,
  selectedWord,
  setSelectedWord,
  colors,
  unclickable,
  rotate,
  width = null,
  height = null,
}) => {
  const [size, box] = useResponsiveSize();
  const [view, setView] = useState(null);

  useEffect(() => {
    if (view) view.signal("selectedWord", selectedWord).run();
  }, [view, selectedWord]);

  const onSelectWord = (signal, word) => {
    setSelectedWord(word);
  };

  const signalListeners = {
    selectedWord: onSelectWord,
  };

  const handleNewView = (view) => {
    setView(view);
  };

  const spec = getSpec(
    height || size.height,
    width || size.width,
    colors || COLORS,
    !unclickable,
    rotate
  );

  console.log(size);
  if (!data) return null;

  return (
    <div ref={box} style={{ height: "100%", width: "100%", maxWidth: "100vw" }}>
      <Vega
        data={data}
        spec={spec}
        signalListeners={signalListeners}
        onNewView={handleNewView}
        actions={false}
      />
    </div>
  );
};

export default VegaWordcloud;

const getSpec = (height, width, colors, clickable, rotate) => {
  const clicksignal = clickable
    ? [
        {
          events: "click",
          update: "!datum || datum.text === selectedWord ? '' : datum.text",
          force: false,
        },
      ]
    : [];

  const mouseoversignal = clickable
    ? [
        {
          events: "text:mouseover",
          update: "'pointer'",
        },
        { events: "text:mouseout", update: "'default'" },
      ]
    : [];

  const hoveropacity = clickable ? 0.5 : 1;

  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: width,
    height: height,
    //autosize: { type: "fit-x", contains: "padding" },

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
        range: colors,
      },
    ],

    signals: [
      {
        name: "selectedWord",
        //update: "data('table') ? '' : ''", // stupid, but this way it resets on rerender
        on: clicksignal,
      },
      {
        name: "cursor",
        value: "default",
        on: mouseoversignal,
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
            //tooltip: { signal: "datum.text + ' (' + datum.visits + ')'" },
          },
          update: {
            fill: [
              { test: "selectedWord === datum.text", value: "white" },
              { test: "selectedWord && selectedWord !== datum.text", value: "grey" },

              { scale: "color", field: "text" },
            ],
            fillOpacity: { value: 1 },
          },
          hover: {
            fillOpacity: [
              { test: "selectedWord === datum.text", value: 1 },
              { value: hoveropacity },
            ],
          },
        },
        transform: [
          {
            type: "wordcloud",
            size: [width, height],
            text: { field: "text" },
            rotate: rotate ? { field: "datum.angle" } : null,
            font: "Helvetica Neue, Arial",
            fontSize: { field: "datum.visits" },
            fontSizeRange: [12, 56],
            padding: 2,
          },
        ],
      },
    ],
  };
};
