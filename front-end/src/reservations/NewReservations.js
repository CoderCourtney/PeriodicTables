import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, formatPhoneNumber } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

export default function NewReservation({ loadDashboard }) {
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  const phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormData({
      ...formData,
      mobile_number: formattedInputValue,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);
    const valid = validateDate();
    // console.log("\n\n\n errors", errors);
    if (valid) {
      createReservation(formData)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch(setErrors);
    }
    // } else {
    //   const errorMessage = { message: `${foundErrors.join(",").trim()}` };
    //   setErrors(errorMessage);
    // }
  }
  // console.log("\n\n\n");
  // console.log(Date().toLocaleString());

  const validateDate = () => {
    const errorsArray = [];
    // const today = new Date();
    const reservationDate = new Date(formData.reservation_date);
    // console.log("\n\n\n reservation date", reservationDate);
    const reservationTime = formData.reservation_time;
    // const currentDateTime = Date().toLocaleString();

    //1 equals tuesday
    if (reservationDate.getDay() === 1) {
      errorsArray.push("We are closed on Tuesdays, hope to see you soon!");
    }
    if (formData.reservationDate < today()) {
      errorsArray.push(
        "Reservations cannot be made in the past, pick today's date or a future date."
      );
    }
    if (reservationTime.localeCompare("10:30") === -1) {
      errorsArray.push("We are closed before 10:30AM");
    } else if (reservationTime.localeCompare("21:30") === 1) {
      errorsArray.push("We are closed after 9:30PM");
    } else if (reservationTime.localeCompare("21:00") === 1) {
      errorsArray.push(
        "You must book at least 60 minutes before the restaurant closes"
      );
    }

    if (errorsArray.length) {
      setErrors(new Error(errorsArray.toString()));
      return false;
    }
    return true;
  };

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:&nbsp;</label>
          <input
            name="first_name"
            id="first_name"
            type="text"
            placeholder="First Name"
            className="form-control"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:&nbsp;</label>
          <input
            name="last_name"
            id="last_name"
            type="text"
            placeholder="Last Name"
            className="form-control"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
          <input
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="xxx-xxx-xxxx"
            className="form-control"
            onChange={phoneNumberFormatter}
            value={formData.mobile_number}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Reservation Date:&nbsp;</label>
          <input
            name="reservation_date"
            id="reservation_date"
            type="date"
            className="form-control"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Reservation Time:&nbsp;</label>
          <input
            name="reservation_time"
            id="reservation_time"
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            className="form-control"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Party Size:&nbsp;</label>
          <input
            name="people"
            id="people"
            type="number"
            placeholder="Number of people"
            className="form-control"
            onChange={handleChange}
            value={formData.people}
            min="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

//// AM
// function isTuesday(date) {
//   const temp = date.split("-");
//   const newDate = new Date(
//     Number(temp[0]),
//     Number(temp[1]) - 1,
//     Number(temp[2])
//   );
//   return newDate.getDay() === 2;
// }
// function isPast(date) {
//   const temp = date.split("-");
//   const newDate = new Date(
//     Number(temp[0]),
//     Number(temp[1]) - 1,
//     Number(temp[2]) + 1
//   );

//   return newDate.getTime() < new Date().getTime();
// }
// function isTimeOpen(time) {
//   const timeArr = time.split(":");
//   const hour = Number(timeArr[0]);
//   const min = Number(timeArr[1]);
//   if (hour >= 10) {
//     if (hour === 10 && min < 30) {
//       return false;
//     }
//     if (hour >= 21) {
//       if (hour === 21 && min <= 30) {
//         return true;
//       }
//       return false;
//     }
//     return true;
//   }
//   return false;
// }

// function isTimeValid(time, date) {
//   if (date === today()) {
//     const now = new Date();
//     const timeArr = time.split(":");
//     const hour = Number(timeArr[0]);
//     const min = Number(timeArr[1]);
//     if (now.getHours() >= hour) {
//       if (now.getHours() == hour) {
//         if (now.getMinutes() < min) {
//           return true;
//         }
//         return false;
//       }
//     }
//   }
//   return true;
// }

// function validateDate() {
//   let message = "";

//   if (/\d{4}-\d{2}-\d{2}/.test(formData.reservation_date)) {
//     if (isTuesday(formData.reservation_date)) {
//       message += "  /closed Tuesdays";
//     }
//     if (isPast(formData.reservation_date)) {
//       message += " /Must be in future";
//     }
//   } else {
//     message += "reservation_date must be a date";
//   }
//   if (/[0-9]{2}:[0-9]{2}/.test(formData.reservation_time)) {
//     if (!isTimeOpen(formData.reservation_time)) {
//       message += "  /closed only open 10:30 AM - 10:30 PM with 1hr window ";
//     }
//     if (!isTimeValid(formData.reservation_time, formData.reservation_date)) {
//       message += "/ Must be in future ";
//     }
//   } else {
//     message += "reservation_time must be a time ";
//   }
//   if (message.length) {
//     setErrors(new Error(message));
//     return true;
//   } else {
//     return false;
//   }
// }
