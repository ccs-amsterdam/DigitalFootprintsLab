import React, { useEffect, useState } from "react";
import { ResponsiveCalendar, Calendar } from "@nivo/calendar";
import createColors from "../util/createColors";

import db from "../apis/dexie";
import { Button, ButtonGroup, Dimmer, Grid, Header, Loader, Popup } from "semantic-ui-react";

const COLORS = createColors(100, "white", "#0C1D35", "#954856");

const getSelection = async (table, field, dayRange, setSelection) => {
  let selection = await db.getSelectionAny(table, field, dayRange);
  setSelection(selection);
};

const TimeLine = ({ table, field, selection, loading, setSelection }) => {
  const [data, setData] = useState(null);
  const [dayRange, setDayRange] = useState([null, null]);

  const [selectionStatus, setSelectionStatus] = useState("idle");

  useEffect(() => {
    prepareData(table, field, selection, setData);
  }, [table, field, selection, setData]);

  if (data === null) return null;

  console.log(dayRange);

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
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          <ResponsiveCalendar
            data={data.day.data.filter((day) => {
              if (dayRange[0] !== null && day.date < dayRange[0]) return false;
              if (dayRange[1] !== null && day.date > dayRange[1]) return false;
              return true;
            })}
            from={data.day.min}
            to={data.day.max}
            emptyColor="#ededed1f"
            colors={COLORS}
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
                console.log(midnightMorning);
                if (dayRange[1] !== null && dayRange[1] < midnightMorning)
                  midnightMorning = new Date(dayRange[1]);
                midnightMorning.setHours(0, 0, 0, 0);
                console.log(midnightMorning);
                setDayRange([midnightMorning, dayRange[1]]);
                setSelectionStatus("idle");
              }
              if (selectionStatus === "select_end") {
                console.log(e);
                let midnightEvening = new Date(e.day);
                if (dayRange[0] !== null && dayRange[0] >= midnightEvening)
                  midnightEvening = new Date(dayRange[0]);
                console.log(midnightEvening);
                midnightEvening.setHours(23, 59, 59, 0);
                console.log(midnightEvening);

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

const prepareData = async (table, field, selection, setData) => {
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
};

const addZ = (n) => {
  return n < 10 ? "0" + n : "" + n;
};

const formatDate = (date) => {
  return date.getFullYear() + "-" + addZ(date.getMonth() + 1) + "-" + addZ(date.getDate());
};

export default React.memo(TimeLine);
