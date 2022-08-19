import GoogleTakeout_sources from "project/images/GoogleTakeout_sources.png";
import GoogleTakeout_youtube from "project/images/GoogleTakeout_youtube.png";
import GoogleTakeout_create from "project/images/GoogleTakeout_create.png";
import GoogleTakeout_download from "project/images/GoogleTakeout_download.png";

import GoogleTakeout_sources_nl from "project/images/GoogleTakeout_sources_nl.png";
import GoogleTakeout_youtube_nl from "project/images/GoogleTakeout_youtube_nl.png";
import GoogleTakeout_create_nl from "project/images/GoogleTakeout_create_nl.png";
import GoogleTakeout_download_nl from "project/images/GoogleTakeout_download_nl.png";
import { Instruction } from "types";

const googleTakeoutInstruction_EN: Instruction = {
  title: "Google Takeout",
  introduction: `The following steps will show you how to gather your digital footprints from Google.`,
  fileHint: "takeout-[some numbers]",

  steps: [
    {
      title: "Go to Google Takeout",
      items: [
        {
          text: "Use [this link](https://takeout.google.com/settings/takeout/custom/youtube,chrome) to gather your *Chrome* and *Youtube* data from **Google Takeout**",
        },
        { text: "Log in if needed" },
        {
          text: "You should see the following *products* to export (maybe without the 'news', but that's ok)",
          image: GoogleTakeout_sources,
        },
      ],
    },
    {
      title: "Filter Youtube data",
      items: [
        {
          text: "Go to the **YouTube** product, and Click on the button that says **All Youtube data included**",
        },
        {
          text: "Make sure to only select **History** and **subscriptions**. (If your Google account uses a different language, the names and order of items can be different)",
          image: [GoogleTakeout_youtube, GoogleTakeout_youtube_nl],
          image_style: { width: "45%", marginRight: "5%", verticalAlign: "text-top" },
        },
      ],
    },
    {
      title: "Create data export",
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
      title: "Download your data",
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

const googleTakeoutInstruction_NL: Instruction = {
  title: "Google Takeout",
  introduction: `Volg de instructies om je digitale voetsporen van Google te downloaden.`,
  fileHint: "takeout_[getallen]",

  steps: [
    {
      title: "Ga naar Google Takeout",
      items: [
        {
          text: "Gebruik [deze link](https://takeout.google.com/settings/takeout/custom/youtube,chrome) om je *Chrome* en *Youtube* data van **Google Takeout** te verzamelen",
        },
        { text: "Log indien nodig in" },
        {
          text: "Je zou nu de volgende *producten* moeten zien (misschien zonder 'nieuws', maar dat is ok)",
          image: GoogleTakeout_sources_nl,
        },
      ],
    },
    {
      title: "Filter YouTube data",
      items: [
        {
          text: "Ga naar het **YouTube** product en click op de knop met de tekst **Alle YouTube-gegevens inbegrepen**",
        },
        {
          text: "Selecteer alleen **history** (**geschiedenis**) en **subscriptions** (**abonnementen**)",
          image: [GoogleTakeout_youtube_nl, GoogleTakeout_youtube],
          image_style: { width: "45%", marginRight: "5%", verticalAlign: "text-top" },
        },
      ],
    },
    {
      title: "Maak een data export",
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
      title: "Download je data",
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
