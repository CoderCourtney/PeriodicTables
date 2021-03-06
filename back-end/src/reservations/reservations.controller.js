const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

// LIST
async function list(req, res) {
  if (req.query.mobile_number) {
    return res.json({ data: await service.search(req.query.mobile_number) });
  }
  if (req.query.date) {
    return res.json({ data: await service.list(req.query.date) });
  }
}

// VALIDATION FUNCTION hasValidFields SUPPORT
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

// HELPER FN FOR hasValidFields SUPPORT
function notNull(obj) {
  for (let key in obj) {
    if (!obj[key]) return false;
  }
  return true;
}

// HELPER FN FOR hasValidFields SUPPORT
function isPast(date) {
  const temp = date.split("-");
  const newDate = new Date(
    Number(temp[0]),
    Number(temp[1]) - 1,
    Number(temp[2]) + 1
  );
  // indexing for the months etc.
  return newDate.getTime() < new Date().getTime();
}

// CREATE MIDDLEWARE 1 OF 1  &  UPDATE 2 of 3
function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const dataFields = Object.getOwnPropertyNames(data);
  validFields.forEach((field) => {
    if (!dataFields.includes(field)) {
      return next({
        status: 400,
        message: `The ${field} is missing`,
      });
    }
  });

  if (!notNull(data)) {
    // checks if empty
    return next({
      status: 400,
      message:
        "Invalid data format provided. Requires {string: [first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}",
    });
  }

  const reserveDate = new Date(data.reservation_date);

  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, people is not a number.",
    });
  }

  if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a date.",
    });
  }
  if (reserveDate.getDay() === 1) {
    // 1 is Tuesday
    return next({
      status: 400,
      message:
        "Reservations cannot be made on a Tuesday, the restaurant is closed.",
    });
  }

  if (isPast(data.reservation_date)) {
    return next({
      status: 400,
      message: "Reservations must be made for a future date.",
    });
  }

  if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is not a time.",
    });
  }

  if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30am or after 9:30pm.",
    });
  }

  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: "reservation is seated or finished",
    });
  }

  next();
}

// READ MIDDLEWARE 1 OF 1  &  UPDATE STATUS 1 OF 3
async function reservationExists(req, res, next) {
  const reservationId = req.params.reservation_id;
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation id does not exist: ${reservationId}`,
    });
  }
}

// UPDATE STATUS MIDDLEWARE 2 OF 3 (after reservationExists 1st)
async function reservationStatusFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: "reservation is currently finished",
    });
  }
  return next();
}

// UPDATE STATUS MIDDLEWARE 3 OF 3
async function reservationStatus(req, res, next) {
  const status = req.body.data.status;
  if (!["finished", "seated", "cancelled", "booked"].includes(status)) {
    return next({
      status: 400,
      message: "reservation has an unknown status",
    });
  }
  return next();
}

// UPDATE MIDDLEWARE 3 of 3
async function onlyIfBooked(req, res, next) {
  const status = req.body.data.status;
  const reservationId = req.params.reservation_id;
  if (status !== "booked") {
    return next({
      status: 400,
      message: `The reservation_id ${reservationId} status is not booked.`,
    });
  }
  return next();
}

//////////////////// CRUD ////////////////////

// CREATE
async function create(req, res) {
  const newRestaurant = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);
  const createdRestaurant = await service.create(newRestaurant);
  res.status(201).json({ data: createdRestaurant });
}

// READ
async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// UPDATE STATUS
async function updateStatus(req, res) {
  const resId = req.params.reservation_id;
  const status = req.body.data.status;

  const data = await service.updateStatus(resId, status);
  res.status(200).json({ data });
}

// UPDATE
async function update(req, res) {
  const updatedReservation = req.body.data;
  const resId = req.params.reservation_id;

  const data = await service.update(updatedReservation, resId);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidFields, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(reservationStatusFinished),
    asyncErrorBoundary(reservationStatus),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidFields,
    asyncErrorBoundary(onlyIfBooked),
    asyncErrorBoundary(update),
  ],
};
