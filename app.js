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

// Custom List
const customListSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const CustomList = new mongoose.model("List", customListSchema);

const defaultItems = [new Item({ name: "Eat" }), new Item({ name: "Sleep" }), new Item({ name: "Code" })];

app.get("/", (req, res) => {
  Item.find().then((result) => {
    if (!result.length) {
      Item.create(defaultItems)
        .then(() => {
          console.log("Inserted Default todo list Successfully!");

          // This will redirect to the onload route and goto else statemement
          res.redirect("/");
        });
    } else {
      res.render("todoList", { todoHeading: "Today", todoItems: result });
    }
  });
});

app.post("/", (req, res) => {
  const { todoTask, formSubmitHeading } = req.body;

  if (todoTask) {
    const newItem = new Item({ name: todoTask });

    if (formSubmitHeading === "Today") {
      newItem.save().then(() => res.redirect("/"));
    } else {
      CustomList.findOne({ name: formSubmitHeading })
      .then((result) => {
        console.log(result);

        if (result) {
          result.items.push(newItem);
          result.save();
          res.redirect("/" + formSubmitHeading);
        }
      })
    }
  }
});

// handle delete
app.post("/delete", (req, res) => {
  const { deletingItem } = req.body;

  Item.deleteOne({ _id: deletingItem })
  .then(() => res.redirect("/"));
})

app.get("/:itemTitle", (req, res) => {
  const { itemTitle } = req.params;

  CustomList.findOne({ name: itemTitle })
  .then((result) => {
    if (result?.items?.length) {
      console.log(result);
      res.render("todoList", { todoHeading: itemTitle, todoItems: result.items });
    } else {
      CustomList.create({ name: itemTitle, items: defaultItems })
        .then((result) => {
          res.render("todoList", { todoHeading: result.name, todoItems: [...result.items]});
        })
    }
  })
})

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => console.log("Server running on port " + port));
