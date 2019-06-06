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

module.exports = server;
