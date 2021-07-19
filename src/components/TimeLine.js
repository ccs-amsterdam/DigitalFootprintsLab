import React, { useEffect, useState } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import createColors from "../util/createColors";

import db from "../apis/dexie";
import { Button, ButtonGroup, Dimmer, Grid, Header, Loader, Popup } from "semantic-ui-react";
import { useLiveQuery } from "dexie-react-hooks";

const COLORS = createColors(100, "white", "#0C1D35", "#954856");

const getSelection = async (table, field, dayRange, setSelection) => {
  let selection = await db.getSelectionAny(table, field, dayRange);
  setSelection(selection);
};

const TimeLine = ({ table, field, selection, loading, setSelection }) => {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(null);
  const [dayRange, setDayRange] = useState([null, null]);
  const [loadingData, setLoadingData] = useState(false);

  const [selectionStatus, setSelectionStatus] = useState("idle");

  const n = useLiveQuery(() => db.idb.table(table).count());

  useEffect(() => {
    prepareData(table, field, selection, setData, setLoadingData);
  }, [table, field, selection, setData, setLoadingData, n]);

  useEffect(() => {
    if (data === null) {
      setDays(null);
      return;
    }
    setDays(
      data.day.data.filter((day) => {
        if (dayRange[0] !== null && day.date < dayRange[0]) return false;
        if (dayRange[1] !== null && day.date > dayRange[1]) return false;
        return true;
      })
    );
  }, [data, dayRange]);

  if (data === null || days === null) return null;

  return (
    <Grid
      style={{
        width: "100%",
        background: "#ffffff00",
        border: "none",
        boxShadow: "none",
        paddingTop: "2em",
      }}
    >
      <Grid.Row centered style={{ padding: "0" }}>
        <ButtonGroup>
          <Button
            primary
            style={{ width: "20em" }}
            onClick={() => setSelectionStatus("select_start")}
          >
            {selectionStatus === "select_start"
              ? "Click on calender to set start date"
              : `From date: ${dayRange[0] ? formatDate(dayRange[0]) : data.day.min}`}
          </Button>
          <Button
            secondary
            style={{ width: "20em" }}
            onClick={() => setSelectionStatus("select_end")}
          >
            {selectionStatus === "select_end"
              ? "Click on calender to set end date"
              : `To date: ${dayRange[1] ? formatDate(dayRange[1]) : data.day.max}`}
          </Button>
        </ButtonGroup>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column
          width={16}
          style={{ height: "30em", width: "100%", padding: "0", margin: "0" }}
        >
          <Dimmer active={loading || loadingData}>
            <Loader />
          </Dimmer>
          <ResponsiveCalendar
            data={days}
            from={data.day.min}
            to={data.day.max}
            emptyColor="#ededed1f"
            colors={days.some((day) => day.value > 0) ? COLORS : ["white"]}
            margin={{ top: 0, right: 40, bottom: 20, left: 40 }}
            yearSpacing={35}
            monthSpacing={30}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#150a0a2e"
            legends={[
              {
                anchor: "bottom-right",
                direction: "row",
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: "right-to-left",
              },
            ]}
            onContextMenu={(e) => console.log(e)}
            onClick={(e) => {
              if (selectionStatus === "select_start") {
                let midnightMorning = new Date(e.day);
                if (dayRange[1] !== null && dayRange[1] < midnightMorning)
                  midnightMorning = new Date(dayRange[1]);
                midnightMorning.setHours(0, 0, 0, 0);
                setDayRange([midnightMorning, dayRange[1]]);
                setSelectionStatus("idle");
              }
              if (selectionStatus === "select_end") {
                console.log(e);
                let midnightEvening = new Date(e.day);
                if (dayRange[0] !== null && dayRange[0] >= midnightEvening)
                  midnightEvening = new Date(dayRange[0]);
                midnightEvening.setHours(23, 59, 59, 0);
                setDayRange([dayRange[0], midnightEvening]);
                setSelectionStatus("idle");
              }
            }}
            theme={{ textColor: "white", fontSize: 14 }}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const prepareData = async (table, field, selection, setData, setLoadingData) => {
  setLoadingData(true);

  let dayTotalObj = {};
  let weekday = [0, 0, 0, 0, 0, 0, 0];

  let t = await db.idb.table(table);

  let collection =
    selection === null ? await t.toCollection() : await t.where("id").anyOf(selection);

  let dateOrdered = t.orderBy(field);
  let minDate = await dateOrdered.first();
  let maxDate = await dateOrdered.last();
  minDate = minDate.date;
  maxDate = maxDate.date;

  await collection.each((url) => {
    if (url[field] !== "") {
      weekday[url[field].getDay()]++;
      const day = formatDate(url[field]);
      dayTotalObj[day] = (dayTotalObj[day] || 0) + 1;
    }
  });

  if (minDate === null) return null;

  // add empty days within timeframe
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    const day = formatDate(d);
    if (!dayTotalObj[day]) dayTotalObj[day] = 0;
  }

  let dayTotal = Object.keys(dayTotalObj).map((day) => {
    const date = new Date(day);
    date.setHours(0, 0, 0, 0);
    return { date: date, day: day, value: dayTotalObj[day] };
  });

  setData({
    day: { min: formatDate(minDate), max: formatDate(maxDate), data: dayTotal },
    weekday: weekday,
  });
  setLoadingData(false);
};

const addZ = (n) => {
  return n < 10 ? "0" + n : "" + n;
};

const formatDate = (date) => {
  return date.getFullYear() + "-" + addZ(date.getMonth() + 1) + "-" + addZ(date.getDate());
};

export default React.memo(TimeLine);
