export const TRANSLATIONS_EN = {
  home: {
    gather: {
      title: "Gather",
      description: "Click a card to gather your data",
    },

    explore: {
      title: "Explore",
      description: "This step is optional, but aren't you curious?",

      exploreCard: {
        missing: "Data not yet gathered",
        today: "today",
        onDate: "on {{date}}",
      },
    },

    donate: {
      title: "Donate",
      description: "Support academic research by sharing your data",

      removeCard: {
        name: "Remove sensitive data",
        subname: "Use keywords to search and remove any data that you prefer not to share",
      },

      donateCard: {
        name: "Go to donation screen",
        subname:
          "Here you can learn more about what your data will be used for, and safely donate it",
        status: {
          any: "Some of the data types are not yet (successfull) gathered. You can continue, but some data will be missing",
          none: "Please go to the <b>Gather</b> column for instructions on how to gather your digital footprints",
          ready: "<b>{{name}}</b> data ready",
          notReady: "<b>{{name}}</b> data",
        },
      },
    },

    deleteButton: {
      header: "Delete data from browser",
      content1: "Do you want to delete all the gathered data from the browser?",
      content2:
        "Note that any data you downloaded will still be on your computer, so you might want to delete that as well",
    },
  },

  dataTypes: {
    browsing: {
      label: "Browsing",
      description: "What pages did you visit?",
    },
    search: {
      label: "Search",
      description: "What did you search for?",
    },
    youtube: {
      label: "Youtube",
      description: "Channels and videos",
    },
  },
};
