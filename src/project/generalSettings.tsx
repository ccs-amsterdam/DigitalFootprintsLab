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
  email: "digitale-voetsporen.fsw@vu.nl",
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
      NL: "Heb je het gevoel dat je deze digitale voetafdruk herkent als jouw eigen?",
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
    type: "simpleQuestion",
    title: {
      value: "Age",
      NL: "Leeftijd",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `What is your age?`,
      NL: `Wat is uw leeftijd?`,
    },
    answers: [
      { value: "< 24" },
      { value: "25 - 34" },
      { value: "35 - 44" },
      { value: "45 - 54" },
      { value: "55 - 64" },
      { value: "> 64" },
    ],
  },
  {
    type: "simpleQuestion",
    title: {
      value: "Education",
      NL: "Opleiding",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `What is your highest level of education?`,
      NL: `Wat is uw hoogst genoten opleiding?`,
    },
    answers: [
      { value: "HBO or University", NL: "HBO of universiteit" },
      { value: "MBO, HBS, HAVO or VWO", NL: "MBO, HBS, HAVO of VWO" },
      { value: "VMBO, MAVO or preliminary", NL: "VMBO, MAVO of basisonderwijs" },
    ],
  },
  {
    type: "scaleQuestion",
    title: {
      value: "Trust",
      NL: "Vertrouwen",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `How much trust do you have in...`,
      NL: `Hoeveel vertrouwen heeft u in...`,
    },
    items: [
      { value: "Journalists", NL: "Journalisten" },
      {
        value: "The government",
        NL: "De regering",
      },
      {
        value: "Politicians",
        NL: "Politici",
      },
      { value: "The Dutch Democracy", NL: "De Nederlandse Democratie" },
      { value: "Science", NL: "De wetenschap" },
    ],
    answers: [
      { value: "Not at all", NL: "Helemaal niet" },
      { value: "A little", NL: "weinig" },
      { value: "Neutral", NL: "Neutraal" },
      { value: "A lot", NL: "Veel" },
      { value: "A great deal", NL: "Heel veel" },
    ],
    answerLabels: [
      { value: "-2" },
      { value: "-1" },
      { value: "0" },
      { value: "1" },
      { value: "2" },
    ],
  },
  {
    type: "scaleQuestion",
    title: {
      value: "Politics and current affairs news",
      NL: "Nieuws over politiek en actualiteiten",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `How many days in the past two weeks have you followed the following sources to stay up to date on politics and current affairs?`,
      NL: `Hoeveel dagen in de afgelopen twee weken heeft u de volgende bronnen gevold om iets te weten te komen over politiek en actualiteiten`,
    },
    items: [
      { value: "Television", NL: "Televisie" },
      {
        value: "Newspapers or magazines (paper or online)",
        NL: "Kranten of opiniebladen (op papier of online)",
      },
      {
        value: "Online nieuwssites (like nu.nl) or blogs",
        NL: "Online nieuwssites (zoals nu.nl) of blogs",
      },
      { value: "Radio (including online)", NL: "Radio (inclusief online)" },
      {
        value: "Social media (Facebook, Twitter, Instagram, etc.)",
        NL: "Sociale Media (Facebook, Twitter, Instagram, etc.",
      },
      {
        value: "Messaging apps (Whatsapp, messenger, etc.)",
        NL: "Messaging apps (Whatsapp, messenger, etc.)",
      },
      { value: "Conversations with people", NL: "Gesprekken met mensen" },
      {
        value: "News apps or pushmessages on my phone",
        NL: "Nieuwsapps of pushberichten op mijn telefoon",
      },
      { value: "Search enginges (like Google or Bing)", NL: "Zoekmachines (zoals Google of Bing)" },
    ],
    answers: [
      { value: "didn't follow", NL: "niet gevolgd" },
      { value: "1-3 days", NL: "1-3 dagen" },
      { value: "4-6 days", NL: "4-6 dagen" },
      { value: "7-9 days", NL: "7-9 dagen" },
      { value: "10-12 days", NL: "10-12 dagen" },
      { value: "more than 12 days", NL: "meer dan 12 dagen" },
    ],
    answerLabels: [
      { value: "0" },
      { value: "1+" },
      { value: "4+" },
      { value: "7+" },
      { value: "10+" },
      { value: "12+" },
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
