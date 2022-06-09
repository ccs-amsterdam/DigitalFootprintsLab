# Digital Footprints Lab

The Digital Footprints Lab is a React web application where users can import, explore, process and donate digital trace data.
It is designed to be integrated with a backend for securely storing data donations.
The core design principle of this application is that we want the entire process up to the donation to be performed entirely client-side.
In other words, a user's digital trace data should not leave their own device before they have seen their data and given informed consent to share it.

This application is still in active development, but is already being used in pilot studies. If you are interested in using this application, or more generally want to talk data donations, please do get in touch.

## Demo

See [here](https://ccs-amsterdam.github.io/DigitalFootprintsLab/datasquare) for a live demo.

## What types of digital traces does this thing support?

The primary target is **takeout** data, such as [Google Takeout](https://takeout.google.com/settings/takeout).
As a result of the GDPR, people can nowadays request their own data from big data owning companies.
This opens up the possibility to ask participants in a study to donate this data for academic research.
In order to get participants to agree with this, we believe that we need to make this process as simple, transparent and respecting of their privacy as possible.

Conveniently, companies need to provide the user's data in a machine-readable format.
In theory, this means that its easy to import this data (yay!).
In practice, though, there is still the issue that there are quite a lot of different common data formats, and the way the data is structured is not always consistent over time or across users (for instance due to language settings).
In order to import data from a variety of formats, our tool therefore comes with a pipeline for parsing and cleaning various common data formats.
This way, researchers should be able to relatively easily add new **recipes** to the pipeline for importing different types of takeout data, and adding variants for different formats and languages.

We are developing this pipeline in a separate JS module called [data-donation-importers](https://github.com/kasperwelbers/data-donation-importers).

A demo of some recipes for Google Takeout data that we used can be found [here](https://kasperwelbers.github.io/data-donation-importers/)

# Install and run

```
git clone https://github.com/ccs-amsterdam/DigitalFootprintsLab
cd DigitalFootprintsLab
npm install
npm start
```

# Credits and collaborations

This tool is developed in close collaboration with the [OSD2F](https://github.com/uvacw/osd2f) team.
A current development goal is to use OSD2F as a backend.

A major inspiration of this tool is the [Web Historian](https://github.com/erickaakcire/webhistorian) software (Menchen-Trevino, 2016).
In fact, development of this tool started as a Web Historian spin-off. Given that the focus on takeout data required several major changes,
we eventually decided to start afresh in a different framework, but the general design and philosophy owe a clear dept of inspiration.
