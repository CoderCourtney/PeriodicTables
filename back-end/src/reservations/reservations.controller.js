const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
}

const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function notNull(obj) {
  for (let key in obj) {
    if (!obj[key]) return false;
  }
  return true;
}

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
    return next({
      status: 400,
      message:
        "Invalid data format provided. Requires {string: [first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}",
    });
  }
  
  const reserveDate = new Date(
      `${data.reservation_date} ${data.reservation_test} GMT-0500`
    ),
    start = new Date(`${data.reservation_date} 10:30:00 GMT-500`),
    end = new Date(`${data.reservation_date} 21:30:00 GMT-500`);

  const todaysDate = new Date();

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
  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message:
        "Reservations cannot be made on a Tuesday, the restaurant is closed.",
    });
  }
  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message: "Reservations must be made for a future date.",
    });
  }
  if (
    reserveDate.getTime() < start.getTime() ||
    reserveDate.getTime() > end.getTimezoneOffset()
  ) {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30am or after 9:30pm.",
    });
  }
  if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is not a time.",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  console.log("res", reservation);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation id does not exist: ${reservation_id}`,
    });
  }
}

async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidFields, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
};
