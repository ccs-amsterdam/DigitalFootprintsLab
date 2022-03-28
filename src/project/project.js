import gtRecipes from "./googleTakeoutRecipes";
import { createCookbook } from "data-donation-importers";
import googleTakeoutInstruction from "./googleTakeoutInstruction";

export const gatherSettings = [
  {
    name: "Google Takeout",
    subname: "takeout.google.com",
    fileHint: "takeout-[some numbers]",
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
];

export const importMap = {
  "Chrome visited": { data: "Browsing", idFields: ["url", "date"] },
  "Chrome searched": { data: "Search", idFields: ["query", "date"] },
  "Youtube watched": { data: "Youtube", idFields: ["channel_url", "date"] },
  "Youtube searched": { data: "Search", idFields: ["query", "date"] },
  "Youtube subscriptions": { data: "Youtube", idFields: ["channel_url", "date"] },
};
