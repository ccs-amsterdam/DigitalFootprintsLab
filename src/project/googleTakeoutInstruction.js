import GoogleTakeout_unselected from "project/images/GoogleTakeout_unselected.png";
import GoogleTakeout_deselect from "project/images/GoogleTakeout_deselect.png";
import GoogleTakeout_chrome from "project/images/GoogleTakeout_chrome.png";
import GoogleTakeout_youtube from "project/images/GoogleTakeout_youtube.png";
import GoogleTakeout_youtube2 from "project/images/GoogleTakeout_youtube2.png";
import GoogleTakeout_create from "project/images/GoogleTakeout_create.png";
import GoogleTakeout_download from "project/images/GoogleTakeout_download.png";

import GoogleTakeout_unselected_nl from "project/images/GoogleTakeout_unselected_nl.png";
import GoogleTakeout_deselect_nl from "project/images/GoogleTakeout_deselect_nl.png";
import GoogleTakeout_chrome_nl from "project/images/GoogleTakeout_chrome_nl.png";
import GoogleTakeout_youtube_nl from "project/images/GoogleTakeout_youtube_nl.png";
import GoogleTakeout_youtube2_nl from "project/images/GoogleTakeout_youtube2_nl.png";
import GoogleTakeout_create_nl from "project/images/GoogleTakeout_create_nl.png";
import GoogleTakeout_download_nl from "project/images/GoogleTakeout_download_nl.png";

const googleTakeoutInstruction_EN = {
  title: "Google Takeout",
  introduction: `If you have a Google account, a lot of things that you do online are automatically
  documented. Google is legally required to give you access to this data, and they have
  made it easy for you to download it. Here we will walk you through the steps for
  collecting a specific selection of this data.`,
  fileHint: "takeout-[some numbers]",

  steps: [
    {
      title: "Step 1",
      description: "Go to Google Takeout",
      items: [
        { text: "Visit the [Google Takeout website](https://takeout.google.com)" },
        { text: "Log in if needed" },
        {
          text: "Scroll down a little bit to the **CREATE A NEW EXPORT** table",
          image: GoogleTakeout_deselect,
        },
      ],
    },
    {
      title: "Step 2",
      description: "Deselect all items",
      items: [
        {
          text: "Click **deselect all** to un-check all the boxes",
          image: GoogleTakeout_deselect,
          image_style: { objectFit: "cover", objectPosition: "0 90%", height: "120px" },
        },
        {
          text: "It should now say that 0 items are selected, and all boxes should be un-checked",
          image: GoogleTakeout_unselected,
        },
      ],
    },
    {
      title: "Step 3",
      description: "Select Chrome",
      items: [
        {
          text: "Scroll down to Chrome (items are sorted by alphabet) and click on the box to check it",
          image: GoogleTakeout_chrome,
        },
      ],
    },
    {
      title: "Step 4",
      description: "Select Youtube history and subscriptions",
      items: [
        {
          text: "Scroll all the way down to Youtube and check the box",
          image: GoogleTakeout_youtube,
        },
        {
          text: "Click on **All YouTube data included** to open a popup for selecting what data to include",
        },
        {
          text: "Deselect all data, and then only select **History** and **subscriptions**. (If your Google account uses a different language, the names and order of items can be different)",
          image: [GoogleTakeout_youtube2, GoogleTakeout_youtube2_nl],
          image_style: { width: "45%", marginRight: "5%", verticalAlign: "text-top" },
        },
      ],
    },
    {
      title: "Step 5",
      description: "Create data export",
      items: [
        {
          text: "Click on the **Next step** button on the bottom right",
        },
        {
          text: "You should now see that **Select data to include** has 2 items selected",
          image: GoogleTakeout_create,
        },
        {
          text: "In **Choose file type, frequency and destination**, keep the default settings and click on the **Create export** button",
        },

        {
          text: "Do **NOT** close the window. Google will tell you that the export can take a long time, but with only these two items selected **exporting will usually take between a few seconds and a minute**",
        },
      ],
    },
    {
      title: "Step 6",
      description: "Download your data",
      items: [
        {
          text: "Google will automatically open the download page. If you accidentally closed the window, you can also find the download link in your email",
          image: GoogleTakeout_download,
        },
        {
          text: "Click the download link, and store the file in a location where you can find it. Most browsers automatically put it in your **Downloads** folder ",
        },
      ],
    },
  ],
};

const googleTakeoutInstruction_NL = {
  title: "Google Takeout",
  introduction: `Als je een Google account hebt, dan wordt een groot deel van je online activiteiten
  automatisch gedocumenteerd. Google is wettelijk verplicht om jou deze data te geven als jij hier om vraagt, 
  en hebben het daarom makkelijk gemaakt om deze data te downloaden. In de volgende stappen laten wij zien hoe je
  (een onderdeel van) deze data kunt ophalen.`,
  fileHint: "takeout_[getallen]",

  steps: [
    {
      title: "Stap 1",
      description: "Ga naar Google Takeout",
      items: [
        { text: "Bezoek de [Google Takeout website](https://takeout.google.com)" },
        { text: "Log indien nodig in" },
        {
          text: "Scroll naar de  **CREATE A NEW EXPORT** (EEN NIEUWE EXPORT MAKEN) tabel",
          image: GoogleTakeout_deselect_nl,
        },
      ],
    },
    {
      title: "Stap 2",
      description: "Selectie ongedaan maken",
      items: [
        {
          text: "Klik **deselect all** (of **selectie van alle items ongedaan maken**) zodat alle checkboxes leeg zijn",
          image: GoogleTakeout_deselect_nl,
          image_style: { objectFit: "cover", objectPosition: "0 90%", height: "120px" },
        },
        {
          text: "Er zou nu aangegeven moeten zijn dat er 0 items geselecteerd zijn, en alle checkboxes zijn leeg",
          image: GoogleTakeout_unselected_nl,
        },
      ],
    },
    {
      title: "Stap 3",
      description: "Selecteer Chrome",
      items: [
        {
          text: "Scroll naar beneden naar Chrome (items gesorteerd op alfabet) en klik op de checkbox",
          image: GoogleTakeout_chrome_nl,
        },
      ],
    },
    {
      title: "Stap 4",
      description: "Selecteer Youtube history en kanaal abonnementen",
      items: [
        {
          text: "Scroll helemaal naar beneden naar **Youtube**",
          image: GoogleTakeout_youtube_nl,
        },
        {
          text: "Klik op **All YouTube data included** (**alle youtube-gegevens inbegrepen**) om een popup te openen",
        },
        {
          text: "Maak ook hier eerst de selectie ongedaan, en selecteer dan alleen **history** (**geschiedenis**) en **subscriptions** (**abonnementen**)",
          image: [GoogleTakeout_youtube2_nl, GoogleTakeout_youtube2],
          image_style: { width: "45%", marginRight: "5%", verticalAlign: "text-top" },
        },
      ],
    },
    {
      title: "Stap 5",
      description: "Maak een data export",
      items: [
        {
          text: "Klik op de **Next step** (**Volgende stap**) knop rechtsonder",
        },
        {
          text: "Je zou nu moeten zien dat bij **Select data to include** (**gewenste gegevens selecteren**) 2 items zijn geselecteerd",
          image: GoogleTakeout_create_nl,
        },
        {
          text: "Open **Choose file type, frequency and destination** (**bestandstype, frequentie en bestemming kiezen**). Gebruik de standaard instellingen en klik op **Create export** (**Export maken**)",
        },

        {
          text: "Sluit **NIET** het venster. Google zal je vertellen dat het lang kan duren voor de download klaar is, maar de twee items die we geselecteerd hebben **zijn vaak klaar ruim binnen een minuut**",
        },
      ],
    },
    {
      title: "Stap 6",
      description: "Download je data",
      items: [
        {
          text: "Google zal je vanzelf naar de download pagina sturen. Als je de pagina per ongeluk afgesloten hebt, dan heb je ook een mail ontvangen met de link",
          image: GoogleTakeout_download_nl,
        },
        {
          text: "Klik op de download link, en sla het bestand op op een locatie die je makkelijk terug kunt vinden. De meeste browsers slaan het bestand vanzelf op in je **Downloads** folder",
        },
      ],
    },
  ],
};

const googleTakeoutInstruction = {
  default: googleTakeoutInstruction_EN,
  en: googleTakeoutInstruction_EN,
  nl: googleTakeoutInstruction_NL,
};

export default googleTakeoutInstruction;
