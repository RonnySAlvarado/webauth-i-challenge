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

function login(username) {
  return db("usernames-passwords").where({ username: username });
}
