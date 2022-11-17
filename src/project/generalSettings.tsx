import { QuestionInput } from "types";

const server = {
  //donationUrl: "dummy url for testing",
  donationUrl: "https://digitale-voetsporen.nl/youtube/upload",
};

export const contact = {
  title: {
    value: "Need help? Contact us!",
    NL: "Hulp nodig? Neem contact op!",
    PL: "Potrzebuję pomocy? Skontaktuj się z nami!",
  },
  message: {
    value: "Send us an email, and we will get back to you within 24 hours",
    NL: "Stuur ons een email, en wij reageren binnen 24 uur",
    PL: "Wyślij do nas e-mail i odpowiemy Ci w ciągu 24 godzin",
  },
  email: "digitale-voetsporen.fsw@vu.nl",
  //phone: "test",
};

const donationInformation = {
  title: {
    value: "Donating your data",
    NL: "Het doneren van uw data",
    PL: "Udodostępnianie danych",
  },
  text: {
    value:
      "You are almost finished! In the following pages we will walk you through the steps for donating your data. We also ask you to answer a few questions about your data.",
    NL: "Je bent bijna klaar! In de volgende paginas lopen wij met jou door het process voor het doneren van uw data. Wij zullen hier ook enkele vragen stellen over uw data. ",
    PL: "Prawie koniec! Na kolejnych stronach przeprowadzimy Cię przez kolejne etapy przekazywania danych. Będziesz też poproszony(a) o odpowiedzenie na kilka pytań dotyczących Twoich danych.",
  },
};

const confirmDonation = {
  checkboxes: [
    {
      value:
        "By clicking here I indicate that I agree to participate in this study, and give my permission to send my data for analysis.",
      NL: "Door hier te klikken geef ik aan dat ik het eens ben met mijn deelname aan dit onderzoek en geef ik toestemming om mijn data voor analyse op te sturen. ",
      PL: "Klikając tutaj, oświadczam, że wyrażam zgodę na udział w tym badaniu i wyrażam zgodę na przesłanie moich danych do analizy.",
    },
  ],
  finishHeader: {
    value: "Thank you for your donation! You can now click the button below to get paid",
    NL: "Bedankt voor je donatie! Je kunt nu op de knop hieronder klikken om betaald te worden",
    PL: "Dziękujemy za udział! Możesz teraz kliknąć poniższy przycisk, aby otrzymać zapłatę.",
  },
  finishButton: {
    value: "Get paid!",
    NL: "Word betaald!",
    PL: "Otrzymaj wynagrodzenie!",
  },
};

const validateData = [
  {
    question: {
      value: "Is this data only yours, or does someone else use your device or account?",
      NL: "Zijn deze gegevens alleen van jou, of gebruikt iemand anders jouw apparaat of account?",
      PL: "Czy te dane są tylko Twoje i nikt inny nie korzysta z Twojego urządzenia lub konta?",
    },
    answers: [
      { value: "only me", NL: "alleen van mij", PL: "tylko moje" },
      { value: "mostly me", NL: "voornamelijk van mij", PL: "w większości moje" },
      {
        value: "mostly someone else",
        NL: "voornamelijk van iemand anders",
        PL: "w większości cudze",
      },
    ],
  },
];

const answerQuestions: QuestionInput[] = [
  {
    type: "simpleQuestion",
    title: {
      value: "Some question",
      NL: "Een vraag",
      PL: "Proste pytanie",
    },
    //intro: { value: "One final question!", NL: "Laatste vraag!", PL: "Ostanie pytanie!" },
    question: {
      value: `Any questions we want to ask? We don't really have survey features yet, but can have simple questions like this and scale questions`,
      NL: `Zie Engelse versie. Ik ga niet mijn boilerplate vertalen. Kom op zeg.`,
      PL: "",
    },
    answers: [
      { value: "never", NL: "nooit", PL: "nigdy" },
      { value: "rarely", NL: "zelden", PL: "rzadko" },
      { value: "sometimes", NL: "soms", PL: "czasem" },
      { value: "often", NL: "vaak", PL: "często" },
      { value: "very often", NL: "heel vaak", PL: "często" },
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
