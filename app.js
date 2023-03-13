const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// setting current view engine as ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const currentDay = new Date().getDay();
  let dayType = "";

  switch (currentDay) {
    case 0:
      dayType = "Sunday";
      break;
    case 1:
      dayType = "Monday";
      break;
    case 2:
      dayType = "Tuesday";
      break;
    case 3:
      dayType = "Wednesday";
      break;
    case 4:
      dayType = "Thursday";
      break;
    case 5:
      dayType = "Friday";
      break;
    case 6:
      dayType = "Saturday";
      break;
    default:
      console.log("Error: Your current day is " + currentDay);
      break;
  }

  res.render("dayList", { dayType });
})

app.listen(3002, () => console.log("Server running on port 3002"));
