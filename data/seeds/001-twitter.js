/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { HASH_ROUND } = require("../../config");
const bcrypt = require("bcryptjs");
const defautUsers = [
  {
    username: "foo",
    password: bcrypt.hashSync("1234", HASH_ROUND),
  },
  {
    username: "bar",
    password: bcrypt.hashSync("1234", HASH_ROUND),
  },
  {
    username: "lol",
    password: bcrypt.hashSync("1234", HASH_ROUND),
  },
  {
    username: "bro",
    password: bcrypt.hashSync("1234", HASH_ROUND),
  },
];

const defaultTweets = [
  { tweet: "Tweet 1 by foo", date_tweet: new Date(), user_id: 1 },
  { tweet: "Tweet 2 by foo", date_tweet: new Date(), user_id: 1 },
  { tweet: "Tweet 1 by bar", date_tweet: new Date(), user_id: 2 },
  { tweet: "Tweet 2 by bar", date_tweet: new Date(), user_id: 2 },
  { tweet: "Tweet 1 by lol", date_tweet: new Date(), user_id: 3 },
  { tweet: "Tweet 2 by lol", date_tweet: new Date(), user_id: 3 },
  { tweet: "Tweet 1 by bro", date_tweet: new Date(), user_id: 4 },
  { tweet: "Tweet 2 by bro", date_tweet: new Date(), user_id: 4 },
];
const defaultFollowers = [
  { id_user: 1, id_follower: 2 },
  { id_user: 1, id_follower: 3 },
  { id_user: 2, id_follower: 3 },
  { id_user: 2, id_follower: 4 },
  { id_user: 3, id_follower: 1 },
  { id_user: 3, id_follower: 4 },
  { id_user: 4, id_follower: 1 },
  { id_user: 4, id_follower: 2 },
];

exports.seed = async function (knex) {
  // Deletes ALL existing entries

  await knex("followers").truncate();
  await knex("tweets").truncate();
  await knex("users").truncate();

  await knex("users").insert(defautUsers);
  await knex("tweets").insert(defaultTweets);
  await knex("followers").insert(defaultFollowers);
};
