const knex = require("../db/connection");

const tableName = "reservations";

function list(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

function create(newRestaurant) {
  return knex(tableName)
    .insert(newRestaurant, "*")
    .then((createdRestaurant) => createdRestaurant[0]);
}

function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}

module.exports = {
  create,
  list,
  read,
};
