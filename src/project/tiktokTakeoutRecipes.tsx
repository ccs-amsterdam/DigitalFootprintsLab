const tiktok_following = {
  name: "TikTok following",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Following List.Following"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "UserName",
      selector: ["UserName"],
    },
  ],
  transformers: [],
};

const tiktok_favvideos = {
  name: "TikTok favorite videos",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Favorite Videos.FavoriteVideoList"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "Link",
      selector: ["Link"],
    },
  ],
  transformers: [],
};

const tiktok_likelist = {
  name: "TikTok like list",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Like List.ItemFavoriteList"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "Link",
      selector: ["VideoLink"],
    },
  ],
  transformers: [],
};

const tiktok_loginhist = {
  name: "TikTok login history",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Login History.LoginHistoryList"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "DeviceModel",
      selector: ["DeviceModel"],
    },
    {
      name: "DeviceSystem",
      selector: ["DeviceSystem"],
    },
    {
      name: "NetworkType",
      selector: ["NetworkType"],
    },
    {
      name: "Carrier",
      selector: ["Carrier"],
    },
    {
      name: "IP",
      selector: ["IP"],
    },
  ],
  transformers: [],
};

const tiktok_searchhist = {
  name: "TikTok search history",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Search History.SearchList"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "SearchTerm",
      selector: ["SearchTerm"],
    },
  ],
  transformers: [],
};

const tiktok_sharehist = {
  name: "TikTok share history",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Share History.ShareHistoryList"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "SharedContent",
      selector: ["SharedContent"],
    },
    {
      name: "Link",
      selector: ["Link"],
    },
    {
      name: "Method",
      selector: ["Method"],
    },
  ],
  transformers: [],
};

const tiktok_browsehist = {
  name: "TikTok browse history",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Video Browsing History.VideoList"],
  columns: [
    {
      name: "Date",
      selector: ["Date"],
    },
    {
      name: "Link",
      selector: ["VideoLink"],
    },
  ],
  transformers: [],
};

const ttRecipes = [
  tiktok_following,
  tiktok_favvideos,
  tiktok_likelist,
  tiktok_loginhist,
  tiktok_searchhist,
  tiktok_sharehist,
  tiktok_browsehist,
];

export default ttRecipes;
