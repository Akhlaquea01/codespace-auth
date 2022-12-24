require("dotenv").config();

require("./database/database").connect();
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("./model/user");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Server is Working</h1>");
});

app.post("/register", async (req, res) => {
  try {
    // get all data from body
    const { firstname, lastname, email, password } = req.body;
    // all the data should exists
    if (!(firstname && lastname && email && password)) {
      res.status(400).send("All fields are compulsory");
    }
    // if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already exists with same email");
    }
    // encrypt the password
    const myEncPassword = await bcrypt.hash(password, 10);

    // save the user in DB
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: myEncPassword,
    });
    // generate token for user and send it
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "attssecretstring",
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    user.password = undefined;

    res.status(201).send(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    // get all data from frontend
    const { email, password } = req.body;
    // check validation
    if (!(email && password)) {
      res.status(400).send("fields are missing");
    }
    // find user in DB

    const user = await User.findOne({ email });
    // TODO if user it not there

    // match the password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "attssecretstring", {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;
      // }
      // send a token in user cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      // const token = user.token;
      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", auth, (req, res) => {
  console.log(req.user);
  res.send("welcome to dashboard");
});
module.exports = app;
