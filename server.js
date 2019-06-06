const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./data/dbMethod.js");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.post("/api/register", async (req, res) => {
  try {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    console.log(credentials);
    const newUser = await db.register(credentials);
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: "Bad request. Cannot register." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong with this request." });
  }
});

server.get("/api/users", async (req, res) => {
  try {
    const getUsers = await db.getUsers();
    if (getUsers) {
      res.status(200).json(getUsers);
    } else {
      res.status(400).json({ message: "Bad request. Cannot get users." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong with this request." });
  }
});

server.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    db.login(username)
      .first()
      .then(user => {
        console.log(user);
        console.log(user.password);
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ message: "Incorrect credentials." });
        } else {
          return res.status(200).json({ message: `Welcome, ${username}! ` });
        }
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong with this request." });
  }
});

module.exports = server;
