const express = require("express");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwtPassword = "1234567";
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require("method-override");
const User = require("./models/User.js");
const { error } = require("console");

app.set("view engine", "ejs");
app.use(cookieParser());
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public"))); // this is used to connect public(style.css) file to index.ejs
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let port = 8080;

app.listen(port, () => {
  console.log("listen along the port 8080");
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}
main()
  .then((res) => {
    console.log("Connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/page", (req, res) => {
  res.render("page.ejs");
});

// sign up
app.post("/signup", function (req, res) {
  let { email, password, username } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      const data = new User({
        email: email,
        password: hash,
        username: username,
      });
      data.save();
      console.log(data);
      let token = jwt.sign({ email }, "hii");
      res.cookie("token", token);
      res.redirect("/chats");
    });
  });
});

// login
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/authentication", async (req, res) => {
  let { email, password } = req.body;
  let detail = await User.findOne({ email });
  if (!detail)
    return res.json({
      message: "something went wrong",
    });
  bcrypt.compare(req.body.password, detail.password, function (err, result) {
    // result is either true or false
    if (result) {
      let token = jwt.sign({ email }, "Hii");
      res.cookie("token", token);
      res.redirect("/chats");
    } else {
      res.json({
        mesage: "something went wrong",
      });
    }
  });
}); // pass in req.body automatic convert in hashed form and compare with detail password

// index route
app.get("/user", (req, res) => {
  let token = req.cookies.token;
  let decoded = jwt.verify(token, "Hii");  // jo data hamne jwt.sign k time dala tha vo mile gha 
  let email = decoded.email;
  if (decoded.email === email) {
    res.json({
      decoded,
      email
  })
  }
  }
);

// log-out route
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/page");
});

// index route

app.get("/chats", async (req, res) => {
  let chats = await Chat.find(); // to print all the chats on web-page
  console.log(chats);
  res.render("index.ejs", { chats });
});

// new route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// create route
app.post("/chats", (req, res) => {
  let { from, to, msg } = req.body;
  let newchat = new Chat({
    from: from,
    to: to,
    mssege: msg,
    created_at: new Date(),
  });
  newchat
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/chats");
});

//edit route
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chatf = await Chat.findById(id); // async function banana padegha kyuki database k under search karna asyronous nature hotta h.
  console.log(chatf);
  res.render("edit.ejs", { chatf });
});

// update route
app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { mssege: newmsg } = req.body;
  let updatedchat = await Chat.findByIdAndUpdate(
    id,
    { mssege: newmsg },
    { runValidators: true, new: true },
  );
  console.log(updatedchat);
  res.redirect("/chats");
});

// delete route
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let deletedchat = await Chat.findByIdAndDelete(id);
  console.log(deletedchat);
  res.redirect("/chats");
});
