import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  createReservation,
  formatPhoneNumber,
  readReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

export default function NewReservation({ loadDashboard, createOrEdit }) {
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
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    if (reservation_id) {
      readReservation(reservation_id, abortController.signal)
        .then((foundRes) =>
          setFormData({
            first_name: foundRes.first_name,
            last_name: foundRes.last_name,
            mobile_number: foundRes.mobile_number,
            reservation_date: new Date(foundRes.reservation_date)
              .toISOString()
              .substr(0, 10),
            reservation_time: foundRes.reservation_time,
            people: foundRes.people,
          })
        )
        .catch(setErrors);
    }
    return () => abortController.abort();
  }, [reservation_id]);

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
    if (valid) {
      createReservation(formData)
        .then(() => loadDashboard())
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch(setErrors);
    }
  }

  const validateDate = () => {
    const errorsArray = [];
    const reservationDate = new Date(formData.reservation_date);
    const reservationTime = formData.reservation_time;

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
            placeholder="MM/DD/YYYY"
            pattern="\d{4}-\d{2}-\d{2}"
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
          {/* {createOrEdit === "edit" ? "Save" : "Submit"} */}
        </button>
        <button
          type="button"
          className="btn btn-danger ml-1"
          onClick={history.goBack}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
