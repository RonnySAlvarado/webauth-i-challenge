const db = require("./dbConfig.js");

module.exports = {
  register
};

function register(credentials) {
  return db("usernames-passwords").insert(credentials);
}
