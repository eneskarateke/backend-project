const { HASH_ROUND } = require("../../config");
const bcrypt = require("bcryptjs");

const defaultUsers = [
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

const defaultLikes = [
  { tweet_id: 1, tweeted_id: 1, liked_id: 2 },
  { tweet_id: 2, tweeted_id: 1, liked_id: 3 },
  { tweet_id: 3, tweeted_id: 2, liked_id: 1 },
  { tweet_id: 4, tweeted_id: 2, liked_id: 3 },
  { tweet_id: 5, tweeted_id: 3, liked_id: 1 },
  { tweet_id: 6, tweeted_id: 4, liked_id: 3 },
];

const defaultComments = [
  {
    tweet_id: 1,
    tweeted_id: 1,
    commented_id: 2,
    comment_text: "Great tweet!",
  },
  {
    tweet_id: 2,
    tweeted_id: 1,
    commented_id: 3,
    comment_text: "Interesting post.",
  },
  {
    tweet_id: 3,
    tweeted_id: 2,
    commented_id: 1,
    comment_text: "Nice work!",
  },
];

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("followers").truncate();
  await knex("comments").truncate();
  await knex("likes").truncate();
  await knex("tweets").truncate();
  await knex("users").truncate();

  await knex("users").insert(defaultUsers);
  await knex("tweets").insert(defaultTweets);
  await knex("followers").insert(defaultFollowers);
  await knex("likes").insert(defaultLikes);
  await knex("comments").insert(defaultComments);
};
