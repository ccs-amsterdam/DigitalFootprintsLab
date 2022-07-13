import { Instruction } from "types";

const tiktokTakeoutInstruction_EN: Instruction = {
  title: "TikTok takeout",
  introduction: `Get your tiktok data pls`,
  fileHint: "user_data.json",

  steps: [],
};

const tiktokTakeoutInstruction_NL: Instruction = {
  title: "TikTok Takeout",
  introduction: `haal je tiktok data op pls.`,
  fileHint: "user_data.json",

  steps: [],
};

const tiktokTakeoutInstruction = {
  default: tiktokTakeoutInstruction_EN,
  en: tiktokTakeoutInstruction_EN,
  nl: tiktokTakeoutInstruction_NL,
};

export default tiktokTakeoutInstruction;
