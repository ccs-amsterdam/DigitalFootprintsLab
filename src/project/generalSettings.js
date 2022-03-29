const donationInformation = {
  title: {
    value: "What are you donating?",
    NL: "Over het doneren van uw gegevens",
  },
  text: {
    value: "Still need some words here",
    NL: "Hier moeten we nog iets voor schrijven",
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
      value: "Are the largest items indeed the items you often visit?",
      NL: "Zijn de grootste items inderdaad de items die je vaak bezoekt?",
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
      value: "Are there any items that you know you visited often, but are not shown here?",
      NL: "Zijn er items waarvan je weet dat je ze vaak hebt bezocht, maar die hier niet worden weergegeven?",
    },
    answers: [
      { value: "none missing", NL: "niks ontbreekt" },
      { value: "some missing", NL: "iets ontbreekt" },
      { value: "quite a lot missing", NL: "veel ontbreekt" },
      { value: "most missing", NL: "meeste ontbreekt" },
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

const answerQuestions = [
  {
    type: "topItems",
    data: "Youtube",
    field: "channel",
    top: 10,
    detail: "title",
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
];

const generalSettings = {
  donationInformation,
  confirmDonation,
  validateData,
  answerQuestions,
};

export default generalSettings;
