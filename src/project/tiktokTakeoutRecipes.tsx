const tiktok_takeout_following = {
  name: "TikTok following",
  file: ["user_data.json"],
  filetype: "json",
  rows_selector: ["Activity.Following List.Following"],
  columns: [
    {
      name: "date",
      selector: ["Date"],
    },
    {
      name: "name",
      selector: ["UserName"],
    },
  ],
  transformers: [
    {
      transformer: "replace",
      column: "",
      new_column: "",
      arguments: {
        regex: "",
        replacement: "",
        "case sensitive": false,
      },
    },
  ],
};

const ttRecipes = [tiktok_takeout_following];

export default ttRecipes;
