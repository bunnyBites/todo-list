const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// connect with mongoose
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB")
.then((value) => {
  if (value) console.log("Connection to Mongo Database is Successful!");
})
.catch((err) => console.log(err));

// setting current view engine as ejs
app.set("view engine", "ejs");

// set public folder as static file holder
app.use(express.static("public"));

const port = process.env.PORT || 3002;

const itemSchema = new mongoose.Schema({ name: String });

// Create a model based on the schema created
const Item = new mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
  Item.find().then((result) => {
    if (!result.length) {
      Item.create([{ name: "Eat" }, { name: "Sleep" }, { name: "Code" }])
        .then(() => {
          console.log("Inserted Default todo list Successfully!");

          // This will redirect to the onload route and goto else statemement
          res.redirect("/");
        });
    } else {
      res.render("todoList", { todoHeading: "Yo", todoItems: result });
    }
  });
});

app.post("/", (req, res) => {
  const { todoTask } = req.body;

  if (todoTask) Item.create({ name: todoTask });

  res.redirect("/");
});

// handle delete
app.post("/delete", (req, res) => {
  const { deletingItem } = req.body;

  Item.findIdAndRemove({ _id: deletingItem })
  .then((result) => res.redirect("/"));
})

app.get("/work", (req, res) => {
  res.render("todoList", { todoHeading: "Work Items", todoItems: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => console.log("Server running on port " + port));
