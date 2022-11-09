import { QuestionInput } from "types";

const server = {
  donationUrl: "dummy url for testing",
  //donationUrl: "https://digitale-voetsporen.nl/youtube/upload",
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
      value: "Some question",
      NL: "Een vraag",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `Any questions we want to ask? We don't really have survey features yet, but can have simple questions like this and scale questions`,
      NL: `Zie Engelse versie. Ik ga niet mijn boilerplate vertalen. Kom op zeg.`,
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
