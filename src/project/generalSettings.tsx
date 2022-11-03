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
      value: "Rutte",
      NL: "Rutte",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!" },
    question: {
      value: `Do you still trust Rutte?`,
      NL: `Vertrouwt u Rutte nog wel?`,
    },
    answers: [
      { value: "never have", NL: "nooit gedaan" },
      { value: "not really", NL: "niet echt" },
      { value: "could be better", NL: "kan beter" },
      { value: "nope", NL: "neuh" },
      { value: "meh", NL: "meh" },
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
