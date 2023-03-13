const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const util = require(__dirname + "/util");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// setting current view engine as ejs
app.set("view engine", "ejs");

// set public folder as static file holder
app.use(express.static("public"));

const todoItems = [];
const workItems = [];

app.get("/", (req, res) => {
  const dayType = util.getCurrentDay();
  res.render("todoList", { todoHeading: dayType, todoItems });
});

app.post("/", (req, res) => {
  const { todoTask, submitTodoBtn } = req.body;

  if (submitTodoBtn === "Work") {
    if (todoTask.trim()) workItems.push(todoTask);
    res.redirect("/work");
  } else {
    if (todoTask.trim()) todoItems.push(todoTask);
    res.redirect("/")
  }
});

app.get("/work", (req, res) => {
  res.render("todoList", { todoHeading: "Work Items", todoItems: workItems })
});

app.get("/about", (req, res) => {
  res.render("about");
})

app.listen(3002, () => console.log("Server running on port 3002"));
