import gtRecipes from "./googleTakeoutRecipes";
import { createCookbook } from "data-donation-importers";
import ttRecipes from "./tiktokTakeoutRecipes";
import tiktokTakeoutInstruction from "./tiktokTakeoutInstruction";
import googleTakeoutInstruction from "./googleTakeoutInstruction";
import { GatherSettings } from "types";

export const gatherSettings: GatherSettings[] = [
  {
    name: "Google Takeout",
    subname: "takeout.google.com",
    icon: "google",
    cookbook: createCookbook(gtRecipes),
    instructions: googleTakeoutInstruction,
    importMap: {
      "Chrome visited": { data: "Browsing", idFields: ["url", "date"] },
      "Chrome searched": { data: "Search", idFields: ["query", "date"] },
      "Youtube watched": { data: "Youtube", idFields: ["channel_url", "date"] },
      "Youtube searched": { data: "Search", idFields: ["query", "date"] },
      "Youtube subscriptions": { data: "Youtube", idFields: ["channel_url", "date"] },
    },
  },
  {
    name: "TikTok Takeout",
    subname: "tiktok.com",
    img: "https://www.tiktok.com/favicon.ico",
    cookbook: createCookbook(ttRecipes),
    instructions: tiktokTakeoutInstruction,
    importMap: {
      "TikTok following": { data: "TikTok", idFields: ["name", "date"] },
    },
  },
];
