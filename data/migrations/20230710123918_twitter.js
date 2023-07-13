/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema
      .createTable("users", (table) => {
        table.increments("user_id").primary();
        table.string("username", 255).notNullable().unique();
        table.string("password", 40).notNullable();
      })

      // Create the tweets table
      .createTable("tweets", (table) => {
        table.increments("tweet_id").primary();
        table.string("tweet", 140).notNullable();
        table
          .datetime("date_tweet")
          .defaultTo(knex.fn.now()) // Set the default value to the current date and time
          .notNullable();
        table
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT
      })

      // Create the likes table

      .createTable("likes", (table) => {
        table.increments("id_like").primary();
        table
          .integer("tweet_id")
          .unsigned()
          .notNullable()
          .references("tweet_id")
          .inTable("tweets")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT
        table
          .integer("tweeted_id")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT

        table
          .integer("liked_id")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT

        table.timestamps(true, true);
      })
      // Create the followers comments

      .createTable("comments", (table) => {
        table.increments("id_comment").primary();
        table
          .integer("tweet_id")
          .unsigned()
          .references("tweet_id")
          .inTable("tweets")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT;

        table
          .integer("tweeted_id")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT;

        table
          .integer("commented_id")
          .unsigned()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT;

        table.text("comment_text");
        table.timestamps(true, true);
      })

      // Create the followers table
      .createTable("followers", (table) => {
        table
          .integer("id_user")
          .unsigned()
          .notNullable()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT;

        table
          .integer("id_follower")
          .unsigned()
          .notNullable()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE") //RESTRICT
          .onUpdate("CASCADE"); //RESTRICT;

        table.primary(["id_user", "id_follower"]);
      })
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("followers")
    .dropTableIfExists("comments")
    .dropTableIfExists("likes")
    .dropTableIfExists("tweets")
    .dropTableIfExists("users");
};
