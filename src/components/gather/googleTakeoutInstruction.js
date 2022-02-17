import GoogleTakeout_unselected from "images/GoogleTakeout_unselected.png";
import GoogleTakeout_deselect from "images/GoogleTakeout_deselect.png";
import GoogleTakeout_chrome from "images/GoogleTakeout_chrome.png";
import GoogleTakeout_youtube from "images/GoogleTakeout_youtube.png";
import GoogleTakeout_youtube2 from "images/GoogleTakeout_youtube2.png";
import GoogleTakeout_create from "images/GoogleTakeout_create.png";
import GoogleTakeout_download from "images/GoogleTakeout_download.png";

export const googleTakeoutInstruction = {
  title: "Google Takeout",
  introduction: `If you have a Google account, a lot of things that you do online are automatically
  documented. Google is legally required to give you access to this data, and they have
  made it easy for you to download it. Here we will walk you through the steps for
  collecting a specific selection of this data.`,
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
      description: "Select Youtube, and only include History",
      items: [
        {
          text: "Scroll all the way down to Youtube and check the box",
          image: GoogleTakeout_youtube,
        },
        {
          text: "Click on **All YouTube data included** to open a popup for selecting what data to include",
        },
        {
          text: "Deselect all data, and then only select **History**",
          image: GoogleTakeout_youtube2,
          image_style: { width: "50%", marginLeft: "25%" },
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
        {
          text: "Once ready, Google will take you to the download page (and also send you a link via Email)",
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
          text: "Click the download link, and store the file in a location where you can find it. Your browser might also automatically put it in your **Downloads** folder ",
        },
        {
          text: "Finally, click the **Import Google Takeout** button below, and select the downloaded Google Takeout file. It should be named **takeout-some numbers.zip**",
        },
      ],
    },
  ],
};
