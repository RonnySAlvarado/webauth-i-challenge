const db = require("./dbConfig.js");

module.exports = {
  register,
  getUsers
};

function register(credentials) {
  return db("usernames-passwords").insert(credentials);
}

function getUsers() {
  return db("usernames-passwords");
}
