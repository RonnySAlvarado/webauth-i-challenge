const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const SessionStore = require("connect-session-knex")(session);

const sessionConfig = {
  name: "This-is-not-Express",
  secret: "This-is-definitely-not-Express",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  },
  store: new SessionStore({
    knex: require("./data/dbConfig.js"),
    tablename: "sessions",
    sid: "sid",
    createtable: true,
    clearInterval: 60 * 60 * 1000
  })
};
const db = require("./data/dbMethod.js");

const server = express();

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
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

server.get("/api/users", protected, async (req, res) => {
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
          req.session.username = user;
          res.status(200).json({ message: `Welcome, ${username}! ` });
        }
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong with this request." });
  }
});

server.get("/api/logout", protected, (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "There was an error" });
      } else {
        res.end();
      }
    });
  } else {
    res.end();
  }
});

module.exports = server;

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
}
