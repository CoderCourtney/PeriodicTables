const knex = require("../db/connection");

const tableName = "reservations";

// GET route("/")
function list(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time", "asc");
}

// POST route("/")
function create(newRes) {
  return knex(tableName)
    .insert(newRes, "*")
    .then((createdRes) => createdRes[0]);
}

// GET "/:reservation_id"
function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}

// PUT "/:reservation_id/status"
function updateStatus(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id }) // obj to update
    .update("status", status)
    .returning("*")
    .then((updatedRes) => updatedRes[0]);
}

// GET LIST using mobile_number
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

// PUT "/:reservation_id" FOR EDIT 
function update(updatedReservation, resId) {
  return knex(tableName)
    .where({ reservation_id: resId })
    .update(updatedReservation, "*") 
    .then((updatedRes) => updatedRes[0]);
}

module.exports = {
  create,
  list,
  read,
  updateStatus,
  search,
  update,
};
