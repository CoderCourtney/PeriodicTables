const knex = require("../db/connection");
const reservationsService = require("../reservations/reservations.service");

const tableName = "tables";
//   "/" .get(controller.list) GET tables => list all
function list() {
  return knex(tableName).select("*").orderBy("table_name", "asc");
}

//   "/" .post(controller.create) POST tables => new table
function create(newTable) {
  return knex(tableName)
    .insert(newTable, "*")
    .then((createdTable) => createdTable[0]);
}

//   "/:table_id" .get(controller.read) GET tables tableID
function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

//    PUT /tables/:table_id/seat
function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .returning("*")
    .then((updatedTab) => updatedTab[0]);
}

function destroy(resId) {
  return knex(tableName).where({ reservation_id: null }).del();
}

module.exports = {
  list,
  create,
  read,
  update,
  delete: destroy,
};
