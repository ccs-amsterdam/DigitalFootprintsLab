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
          text: "If you're participating in this study, you should have received an email before with instructions for how to request your TikTok takeout data. You should have also received and follow-up email with a link to this app that also explains how to download your data from TikTok once they are generated.",
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
          text: "Als je aan dit onderzoek meedoet dan zou je eerder een email moeten hebben ontvangen met instructies voor het opvragen van je TikTok takeout data. Als je deze instructies gevolgd hebt, dan zou je later een follow-up email van TikTok moeten hebben ontvangen met instructies voor hoe je de TikTok data kunt downloaden",
        },
      ],
    },
  ],
};

// add here polish version

const tiktokTakeoutInstruction_PL: Instruction = {
  title: "TikTok Takeout",
  introduction: `Instrukcja importowania danych TikTok`,
  fileHint: "user_data.json",

  steps: [
    {
      title: "Pobierz swoje dane z TikTok",
      items: [
        {
          text: "Jeśli bierzesz udział w tym badaniu, otrzymałeś(-łaś) wcześniej e-mail z instrukcjami, jak poprosić o Twoje dane z TikToka. Powinieneś był(-a) również otrzymać wiadomość e-mail z linkiem do tej aplikacji, która wyjaśnia również, jak pobrać dane z TikToka po ich wygenerowaniu",
        },
      ],
    },
  ],
};

const tiktokTakeoutInstruction = {
  default: tiktokTakeoutInstruction_EN,
  en: tiktokTakeoutInstruction_EN,
  nl: tiktokTakeoutInstruction_NL,
  pl: tiktokTakeoutInstruction_PL,
};

export default tiktokTakeoutInstruction;
