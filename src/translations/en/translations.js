export const TRANSLATIONS_EN = {
  home: {
    gather: {
      title: "Gather",
      description: "Click a card to gather your data",

      gatherCard: {
        click:
          "Click here to gather the data that Google has about your <b>browsing</b>, <b>search</b> and <b>Youtube</b> history",
        failedUpdated: "Failed to update <b>{{name}}</b> history",
        failedGet: "Failed to get <b>{{name}}</b> history",
        success: "Gathered <b>{{name}}</b> history",
        empty: "<b>{{name}}</b> history",
      },
    },

    explore: {
      title: "Explore",
      description: "This step is optional, but aren't you curious?",

      exploreCard: {
        missing: "Data not yet gathered",
        status: "Gathered <b>{{date}}</b> from <b>{{source}}</b>",
      },
    },

    donate: {
      title: "Donate",
      description: "Support academic research by sharing your data",

      removeCard: {
        name: "Exclude data",
        subname: "Use keywords to search and remove any data that you prefer not to share",
      },

      donateCard: {
        name: "Donate",
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
      buttonLabel: "Delete data",
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
