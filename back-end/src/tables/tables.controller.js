const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

const validFields = ["table_name", "capacity"];

async function list(req, res) {
  res.json({ data: await tablesService.list() });
}

// CREATE MIDDLEWARE VALIDATION HELPER FUNCTION
function tableValidator(data, validFields) {
  // returns an array of fields that are invalid
  const fieldsNotValid = [];

  if (!data.table_name || data.table_name.length < 2) {
    fieldsNotValid.push("table_name");
  }
  if (data.capacity < 1 || typeof data.capacity !== "number") {
    fieldsNotValid.push("capacity");
  }
  const dataFields = Object.getOwnPropertyNames(data);
  validFields.forEach((field) => {
    if (!dataFields.includes(field)) {
      fieldsNotValid.push(field);
    }
  });
  return fieldsNotValid;
}

// CREATE MIDDLEWARE
function hasValidCreateFields(req, res, next) {
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

// UPDATE MIDDLEWARE 1 of 2
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({ status: 404, message: `Table ${table_id} cannot be found.` });
  }
}

// UPDATE MIDDLEWARE 2 of 2
async function validateToSeatTable(req, res, next) {
  let table = res.locals.table;
  if (!req.body.data || !req.body.data.reservation_id) {
    return next({
      status: 400,
      message: `No reservation_id/data`,
    });
  }
  const reservationId = await reservationsService.read(
    req.body.data.reservation_id
  );
 
  if (!reservationId) {
    return next({
      status: 404,
      message: `Reservation ${req.body.data.reservation_id} does not exist`,
    });
  }

  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table occupied`,
    });
  }
  if (reservationId.people > table.capacity) {
    return next({
      status: 400,
      message: `Table does not have sufficient capacity`,
    });
  }
  if (reservationId.status === "seated") {
    return next({
      status: 400,
      message: `reservation is already seated`,
    });
  }
  next();
}

// DESTROY MIDDLEWARE 1 of 2
async function tableIdExists(req, res, next) {
  const tableId = req.params.table_id;

  const table = await tablesService.read(tableId);

  if (table) {
    res.locals.table = table;
    return next();
  }
  return next({
    status: 404,
    message: `${tableId} table_id is non-existent.`,
  });
}

// DESTROY MIDDLEWARE 2 of 2
async function tableNotOccupied(req, res, next) {
  const tableId = req.params.table_id;
  const table = res.locals.table;

  if (table.reservation_id) {
    res.locals.table = table;
    return next();
  }
  return next({
    status: 400,
    message: `table_id: ${tableId} is not occupied`,
  });
}

async function create(req, res) {
  const newTable = req.body.data;
  const createdTable = await tablesService.create(newTable);
  res.status(201).json({ data: createdTable });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: Number(req.body.data.reservation_id),
  };
  // parking the resId on the table now that it is seated
  await reservationsService.updateStatus(
    Number(req.body.data.reservation_id),
    "seated"
  );

  const data = await tablesService.update(updatedTable);
  res.status(200).json({ data });
}

async function destroy(req, res) {
  const tabId = req.params.table_id;
  
  const tableToUpdate = res.locals.table;

  await reservationsService.updateStatus(
    Number(req.body.data.reservation_id),
    "finished"
  );

  tableToUpdate.reservation_id = null;
  await tablesService.update(tableToUpdate);
  res.sendStatus(200).json(`table_id: ${tabId} is now free`);
}

module.exports = {
  list,
  create: [
    asyncErrorBoundary(hasValidCreateFields),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validateToSeatTable),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableIdExists),
    asyncErrorBoundary(tableNotOccupied),
    asyncErrorBoundary(destroy),
  ],
};
