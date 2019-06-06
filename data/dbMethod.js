const db = require("./dbConfig.js");

module.exports = {
  register,
  getUsers,
  findUser
};

function register(credentials) {
  return db("usernames-passwords").insert(credentials);
}

function getUsers() {
  return db("usernames-passwords");
}

function login(credentials) {}

function findUser(username) {
  return db("usernames-passwords").where({ username: username });
}
