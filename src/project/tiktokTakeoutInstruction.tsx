import { Instruction } from "types";

const tiktokTakeoutInstruction_EN: Instruction = {
  title: "TikTok takeout",
  introduction: `Instructions for importing your TikTok data`,
  fileHint: "user_data.json",

  steps: [
    {
      title: "Download your TikTok takeout data",
      items: [
        {
          text: "If you're participating in this study, you should have received an email before with instructions for how to request your TikTok takeout data. If you have followed these instructions, you should have received an email from TikTok with a download link",
        },
      ],
    },
  ],
};

const tiktokTakeoutInstruction_NL: Instruction = {
  title: "TikTok Takeout",
  introduction: `Instructies voor het importeren van je TikTok data`,
  fileHint: "user_data.json",

  steps: [
    {
      title: "Download je TikTok takeout data",
      items: [
        {
          text: "Als je aan dit onderzoek meedoet dan zou je eerder een email moeten hebben ontvangen met instructies voor het opvragen van je TikTok takeout data. Als je deze instructies gevolgd hebt, dan zou je een email van TikTok moeten hebben ontvangen met een download link",
        },
      ],
    },
  ],
};

// add here polish version

const tiktokTakeoutInstruction_PL: Instruction = {
  title: "TikTok Takeout",
  introduction: `Instructies voor het importeren van je TikTok data`,
  fileHint: "user_data.json",

  steps: [
    {
      title: "Download je TikTok takeout data",
      items: [
        {
          text: "Als je aan dit onderzoek meedoet dan zou je eerder een email moeten hebben ontvangen met instructies voor het opvragen van je TikTok takeout data. Als je deze instructies gevolgd hebt, dan zou je een email van TikTok moeten hebben ontvangen met een download link",
        },
      ],
    },
  ],
};

const tiktokTakeoutInstruction = {
  default: tiktokTakeoutInstruction_EN,
  en: tiktokTakeoutInstruction_EN,
  nl: tiktokTakeoutInstruction_NL,
};

export default tiktokTakeoutInstruction;
