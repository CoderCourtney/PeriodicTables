const knex = require("../db/connection");

const tableName = "reservations";

function list(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time", "asc");
}

function create(newRes) {
  return knex(tableName)
    .insert(newRes, "*")
    .then((createdRes) => createdRes[0]);
}

function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}

function updateStatus(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id }) // obj to update
    .update("status", status)
    .returning("*")
    .then((updatedRes) => updatedRes[0]);
}

// function updateStatus(updatedRes) {
//   return knex(tableName)
//     .where({ reservation_id: updatedRes.reservation_id })
//     .update(updatedRes, "*")
//     .returning("*")
//     .then((createdRes) => createdRes[0]);
// }
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

// EDIT
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
