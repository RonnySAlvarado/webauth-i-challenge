exports.up = async function(knex) {
  await knex.schema.createTable("usernames-passwords", tbl => {
    tbl.increments();
    tbl
      .string("username", 12)
      .notNullable()
      .unique();
    tbl.string("password").notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("usernames-passwords");
};
