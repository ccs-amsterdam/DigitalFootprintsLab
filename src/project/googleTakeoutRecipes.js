const google_takeout_browsing_history = {
  name: "Chrome visited",
  file: ["BrowserHistory.json"],
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
    {
      transformer: "filter_regex",
      column: "url",
      new_column: "",
      arguments: {
        regex: "google\\.com/search",
        "rm selected": true,
      },
    },
    {
      transformer: "url_to_domain",
      column: "url",
      new_column: "domain",
      arguments: {
        "rm prefix": true,
      },
    },
  ],
};

const google_takeout_search_history = {
  name: "Chrome searched",
  file: ["BrowserHistory.json"],
  filetype: "json",
  rows_selector: "Browser History",
  columns: [
    {
      name: "query",
      selector: ["title"],
    },
    {
      name: "url",
      selector: ["url"],
    },
    {
      name: "time",
      selector: ["time_usec"],
    },
    {
      name: "transition",
      selector: ["page_transition"],
    },
  ],
  transformers: [
    {
      transformer: "int_to_date",
      column: "time",
      new_column: "date",
      arguments: {
        unit: "microsecond",
      },
    },
    {
      transformer: "filter_regex",
      column: "url",
      new_column: "",
      arguments: {
        regex: "google\\.com/search",
        "rm selected": false,
      },
    },
    {
      transformer: "replace",
      column: "query",
      new_column: "",
      arguments: {
        regex: " - Google.*",
        replacement: "",
        "case sensitive": false,
      },
    },
    {
      transformer: "tokenize_string",
      column: "query",
      new_column: "words",
      arguments: {},
    },
  ],
};

const google_takeout_youtube_history_json = {
  name: "Youtube watched",
  file: ["watch-history.json", "kijkgeschiedenis.json", "Wiedergabeverlauf.json"],
  filetype: "json",
  rows_selector: ["$."],
  columns: [
    {
      name: "title",
      selector: ["title"],
    },
    {
      name: "title_url",
      selector: ["titleUrl"],
    },
    {
      name: "channel",
      selector: ["subtitles[0].name"],
    },
    {
      name: "channel_url",
      selector: ["subtitles[0].url"],
    },
    {
      name: "raw_date",
      selector: ["time"],
    },
    {
      name: "details",
      selector: ["details[0].name"],
    },
  ],
  transformers: [
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {},
    },
    {
      transformer: "filter",
      column: "",
      new_column: "",
      arguments: {
        expression: "details == null",
        "rm selected": false,
      },
    },
  ],
};

const google_takeout_youtube_history_html = {
  name: "Youtube watched",
  file: ["watch-history.html", "kijkgeschiedenis.html", "Wiedergabeverlauf.html"],
  filetype: "html",
  rows_selector: [".mdl-grid > .outer-cell"],
  columns: [
    {
      name: "title",
      selector: ["a"],
    },
    {
      name: "title_url",
      selector: ["a @href"],
    },
    {
      name: "channel",
      selector: ["a:nth-of-type(2)"],
    },
    {
      name: "channel_url",
      selector: ["a:nth-of-type(2) @href"],
    },
    {
      name: "raw_date",
      selector: [".content-cell @INNER"],
    },
    {
      name: "caption",
      selector: [".mdl-typography--caption"],
    },
  ],
  transformers: [
    {
      column: "raw_date",
      transformer: "replace",
      arguments: {
        regex: ".*<br>",
      },
    },
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {},
    },
    {
      transformer: "filter_regex",
      column: "caption",
      new_column: "",
      arguments: {
        regex: "Anzeigen|Adverteren|Ads",
        "rm selected": true,
        "case sensitive": false,
      },
    },
  ],
};

const google_takeout_youtube_search_html = {
  name: "Youtube searched",
  file: ["search-history.html", "zoekgeschiedenis.html", "Suchverlauf.html"],
  filetype: "html",
  rows_selector: [".mdl-grid > .outer-cell"],
  columns: [
    {
      name: "query",
      selector: ["a"],
    },
    {
      name: "raw_date",
      selector: [".content-cell @INNER"],
    },
    {
      name: "url",
      selector: ["a @href"],
    },
  ],
  transformers: [
    {
      transformer: "replace",
      column: "raw_date",
      new_column: "",
      arguments: {
        regex: ".*<br>",
        replacement: "",
        "case sensitive": false,
      },
    },
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {
        format: [],
        "auto parse": true,
      },
    },
    {
      transformer: "tokenize_string",
      column: "query",
      new_column: "words",
      arguments: {},
    },
    {
      transformer: "filter_regex",
      column: "url",
      new_column: "",
      arguments: {
        regex: "/watch|/activitycontrols",
        "rm selected": true,
        "case sensitive": false,
      },
    },
  ],
};

const google_takeout_youtube_search_json = {
  name: "Youtube searched",
  file: ["search-history.json", "zoekgeschiedenis.json", "Suchverlauf.json"],
  filetype: "json",
  rows_selector: [""],
  columns: [
    {
      name: "query",
      selector: ["title"],
    },
    {
      name: "raw_date",
      selector: ["time"],
    },
    {
      name: "url",
      selector: ["titleUrl"],
    },
  ],
  transformers: [
    {
      transformer: "str_to_date",
      column: "raw_date",
      new_column: "date",
      arguments: {
        format: [],
        "auto parse": true,
      },
    },
    {
      transformer: "tokenize_string",
      column: "query",
      new_column: "words",
      arguments: {},
    },
    {
      transformer: "filter_regex",
      column: "url",
      new_column: "",
      arguments: {
        regex: "/watch",
        "rm selected": true,
        "case sensitive": false,
      },
    },
    {
      transformer: "filter",
      column: "",
      new_column: "",
      arguments: {
        expression: "url == null",
        "rm selected": true,
      },
    },
  ],
};

const google_takeout_youtube_subscriptions = {
  name: "Youtube subscriptions",
  file: ["subscriptions.csv", "abonnementen.csv", "Abos.csv"],
  filetype: "csv",
  rows_selector: [""],
  columns: [
    {
      name: "channel_url",
      selector: ["Channel URL", "Kanaal-URL", "Kanal-URL"],
    },
    {
      name: "channel",
      selector: ["Channel title", "Kanaaltitel", "Kanaltitel"],
    },
  ],
  transformers: [
    {
      transformer: "mutate_expression",
      column: "",
      new_column: "title",
      arguments: {
        expression: '"Subscribed to this channel"',
      },
    },
  ],
};

const gtRecipes = [
  google_takeout_browsing_history,
  google_takeout_search_history,
  google_takeout_youtube_history_html,
  google_takeout_youtube_history_json,
  google_takeout_youtube_search_html,
  google_takeout_youtube_search_json,
  google_takeout_youtube_subscriptions,
];

export default gtRecipes;
