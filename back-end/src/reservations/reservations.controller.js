const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const reservationValidator = require("../Utils/reservationValidator")

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

// HELPER FN
function isPast(date) {
  const temp = date.split("-");
  const newDate = new Date(
    Number(temp[0]),
    Number(temp[1]) - 1, // indexing for the months 
    Number(temp[2]) + 1
  );

  return newDate.getTime() < new Date().getTime();
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
    // checks if empty
    return next({
      status: 400,
      message:
        "Invalid data format provided. Requires {string: [first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}",
    });
  }
  // console.log("data", data);
  const reserveDate = new Date(
    data.reservation_date
    // `${data.reservation_date} ${data.reservation_test} GMT-0500`
  );
  //   start = new Date(data.reservation_date),
  //   end = new Date(`${data.reservation_date} 21:30:00`);
  // start.setHours(10);
  // start.setMinutes(30);
  const todaysDate = new Date();
  // console.log("getDay", reserveDate.getDay());
  // console.log("reserveDate", reserveDate);
  // console.log("todaysDate", todaysDate);

  // const tableStatus = new Map(table.status);

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
  // let [hours, minutes] = data.reservation_time.split(":");
  // reserveDate.setHours(hours);
  // reserveDate.setMinutes(minutes);
  // console.log("startTime", start);
  // console.log("endTime", end);
  // console.log("reserveDate.getTime", reserveDate);

  if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30am or after 9:30pm.",
    });
  }

  // if (status === "seated" || status === "finished") {
  //   return next({
  //     status: 400,
  //     message: "reservation is seated or complete",
  //   });
  // }

  next();
}

async function reservationExists(req, res, next) {
  const reservationId = req.params.reservation_id;
  const reservation = await service.read(req.params.reservation_id);
  // console.log("res", reservation);
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
