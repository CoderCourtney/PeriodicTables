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
// function update(updatedTable) {
//   return knex(tableName)
//     .select("*")
//     .where({ reservation_id: updatedTable.reservation_id })
//     .update(updatedTable, "*");
// }

function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

// function update(updatedTable) {
//   return knex(tableName)
//     .where({ reservation_id: updatedTable.reservation_id })
//     .update(updatedTable, "*")
//     .then(() => {
//       return knex("reservations")
//         .select("*")
//         .where({ reservation_id: reservations.reservation_id })
//         .first();
//     });
// }
module.exports = {
  list,
  create,
  read,
  update,
};

// return knex.schema.createTable("tables", (table) => {
//     table.increments("table_id").primary().notNullable();
//     table.string("table_name").notNullable();
//     table.integer("capacity").notNullable();
//     table.string("status").defaultTo("free").notNullable();
//     table.integer("reservation_id").unsigned();
//     table
//       .foreign("reservation_id")
//       .references("reservation_id")
//       .inTable("reservations")
//       .onDelete("SET NULL");
//     table.timestamps(true, true);
//   });
