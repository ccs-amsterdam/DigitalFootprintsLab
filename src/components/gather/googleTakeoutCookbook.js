import { createCookbook } from "data-donation-importers";

const google_takeout_browsing_history = {
  name: "browsing",
  file: ["BrowserHistory.json", "BrausingHistörie.jsön"],
  filetype: "json",
  rows_selector: "Browser History",
  columns: [
    { name: "title", selector: "title" },
    { name: "url", selector: "url" },
    { name: "time", selector: "time_usec" },
    { name: "transition", selector: "page_transition" },
  ],
  transformers: [
    {
      transformer: "int_to_date",
      column: "time",
      new_column: "date",
      arguments: { unit: "microsecond" },
    },
  ],
};

const google_takeout_youtube_history_json = {
  name: "youtube",
  file: ["watch-history.json", "kijkgeschiedenis.json", "Wiedergabeverlauf.json"],
  filetype: "json",
  rows_selector: "$.",
  columns: [
    { name: "title", selector: "title" },
    { name: "title_url", selector: "titleUrl" },
    { name: "channel", selector: "subtitles[0].name" },
    { name: "channel_url", selector: "subtitles[0].url" },
    { name: "raw_date", selector: "time" },
  ],
  transformers: [
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {},
    },
  ],
};

const google_takeout_youtube_history_html = {
  name: "youtube",
  file: ["watch-history.html", "kijkgeschiedenis.html", "Wiedergabeverlauf.html"],
  filetype: "html",
  rows_selector: ".mdl-grid > .outer-cell",
  columns: [
    { name: "title", selector: "a" },
    { name: "title_url", selector: "a @href" },
    { name: "channel", selector: "a:nth-of-type(2)" },
    { name: "channel_url", selector: "a:nth-of-type(2) @href" },
    { name: "raw_date", selector: ".content-cell @INNER" },
  ],
  transformers: [
    { column: "raw_date", transformer: "replace", arguments: { regex: ".*<br>" } },
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {},
    },
  ],
};

const cookbook = createCookbook([
  google_takeout_youtube_history_json,
  google_takeout_youtube_history_html,
  google_takeout_browsing_history,
]);

export default cookbook;
