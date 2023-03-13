const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// setting current view engine as ejs
app.set("view engine", "ejs");

// set public folder as static file holder
app.use(express.static("public"));

const todoItems = [];

app.get("/", (req, res) => {
  const currentDay = new Date();
  const options = {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
  }

  const dayType = currentDay.toLocaleString("en-US", options);

  res.render("dayList", { dayType, todoItems });
});

app.post("/", (req, res) => {
  const { todoTask } = req.body;

  if (todoTask.trim()) todoItems.push(todoTask);

  res.redirect("/")
})

app.listen(3002, () => console.log("Server running on port 3002"));
