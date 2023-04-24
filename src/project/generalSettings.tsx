import { QuestionInput } from "types";

const server = {
  //donationUrl: "dummy url for testing",
  donationUrl: "https://digitale-voetsporen.nl/youtube/upload",
};

export const contact = {
  title: {
    value: "Need help? Contact us!",
    NL: "Hulp nodig? Neem contact op!",
  },
  message: {
    value: "Send us an email, and we will get back to you within 24 hours",
    NL: "Stuur ons een email, en wij reageren binnen 24 uur",
  },
  email: "secret@for.reviewers",
  //phone: "test",
};

const donationInformation = {
  title: {
    value: "Donating your data",
    NL: "Het doneren van uw data",
  },
  text: {
    value:
      "You are almost finished! In the following pages we will walk you through the steps for donating your data. We also ask you to answer a few questions about your data.",
    NL: "Je bent bijna klaar! In de volgende paginas lopen wij met jou door het process voor het doneren van uw data. Wij zullen hier ook enkele vragen stellen over uw data. ",
  },
};

const confirmDonation = {
  checkboxes: [
    {
      value:
        "By clicking here I indicate that I agree to participate in this study, and give my permission to send my data for analysis.",
      NL: "Door hier te klikken geef ik aan dat ik het eens ben met mijn deelname aan dit onderzoek en geef ik toestemming om mijn data voor analyse op te sturen. ",
    },
  ],
  finishHeader: {
    value: "Thank you for your donation! You can now click the button below to get paid",
    NL: "Bedankt voor je donatie! Je kunt nu op de knop hieronder klikken om betaald te worden",
  },
  finishButton: {
    value: "Get paid!",
    NL: "Word betaald!",
  },
};

const validateData = [
  {
    question: {
      value: "Do you feel that you recognize this digital footprint as your own?",
      NL: "Heb je het gevoel dat je deze digitale voetafdruk herkent als de jouwe?",
    },
    answers: [
      { value: "very little", NL: "heel weinig" },
      { value: "a little", NL: "weinig" },
      { value: "somewhat", NL: "matig" },
      { value: "a lot", NL: "veel" },
      { value: "a great deal", NL: "heel veel" },
    ],
  },
  {
    question: {
      value: "Is this data only yours, or does someone else use your device or account?",
      NL: "Zijn deze gegevens alleen van jou, of gebruikt iemand anders jouw apparaat of account?",
    },
    answers: [
      { value: "only me", NL: "alleen van mij" },
      { value: "mostly me", NL: "voornamelijk van mij" },
      { value: "mostly someone else", NL: "voornamelijk van iemand anders" },
    ],
  },
];

const answerQuestions: QuestionInput[] = [
  {
    type: "topItems",
    data: "Youtube",
    field: "channel",
    top: 10,
    detail: "title",
    title: {
      value: "News and current affairs on Youtube",
      NL: "Nieuws en actualiteiten op Youtube",
    },
    intro: {
      value: `Below you see a list of Youtube channels that you watched. To what extent do you think their video content has involved discussion on news and current affairs?`,
      NL: `Hieronder zie je een aantal Youtube kanalen die jij bekeken hebt. In welke mate denk jij dat deze kanalen nieuws en actualiteiten bespreken?`,
    },
    canAdd: true,
    canAddIntro: {
      value: `Besides the channels listed above, are there any other news related channels (in your own data) that come to your mind? If so, please select them in the following search box to add them to the list. (Don't forget to score the added items) `,
      NL: `Zijn er volgens jou nog andere Youtube kanalen (in jouw eigen data) die over nieuws en actualiteiten berichten? Zo ja, selecteer deze dan alstublieft in deze zoekbox om ze aan de lijst toe te voegen. (Vergeet niet de toegevoegde items te scoren)`,
    },
    question: {
      value: "Does this channel cover content about news and current affairs?",
      NL: "In welke mate gaat de content van dit kanaal over nieuws of actualiteiten? ",
    },
    answers: [
      { value: "not at all", NL: "helemaal niet" },
      { value: "very little", NL: "heel weinig" },
      { value: "somewhat", NL: "matig" },
      { value: "quite a bit", NL: "veel" },
      { value: "a great deal", NL: "heel veel" },
    ],
  },
  {
    type: "simpleQuestion",
    title: {
      value: "Sharing Youtube news",
      NL: "Nieuws van Youtube delen",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `Thinking about this kind of news-related YouTube channels and videos, how often do you share such news related content to others? For example, sending a YouTube video link via WhatsApp, or posting a YouTube video on your Facebook or Twitter.`,
      NL: `Met betrekking tot dit soort nieuws-gerelateerde content op Youtube, hoe vaak deel jij dit soort content met anderen? Bijvoorbeeld, een Youtube video delen via WhatsApp, of een video posten op Facebook of Twitter.`,
    },
    answers: [
      { value: "never", NL: "nooit" },
      { value: "rarely", NL: "zelden" },
      { value: "sometimes", NL: "soms" },
      { value: "often", NL: "vaak" },
      { value: "very often", NL: "heel vaak" },
    ],
  },
];

const generalSettings = {
  server,
  contact,
  donationInformation,
  confirmDonation,
  validateData,
  answerQuestions,
};

export default generalSettings;
