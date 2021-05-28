const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const tableValidator = require("../Utils/tableValidator")
const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

const validFields = new Set(["table_name", "capacity", "reservation_id"]);

async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await tablesService.read(Number(tableId));
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({ status: 404, message: `Table ${tableId} cannot be found.` });
  }
}

function hasValidFieldsCreate(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = tableValidator(data, validFields);
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid fields(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function seatTable(req, res, next) {
  let { table } = res.locals;
  if (!req.body.data || !req.body.data.reservation_id) {
    returnnext({
      status: 400,
      message: `No reservation_id/data`,
    });
  }
  const reservation = await reservationsService.read(
    req.body.data.reservation_id
  );
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${req.body.data.reservation_id} does not exist`,
    });
  }
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: `Table occupied`,
    });
  }
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Table does not have the capacity`,
    });
  }
}

module.exports = {
  list,
  create,
};
