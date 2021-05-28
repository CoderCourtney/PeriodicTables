import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, formatPhoneNumber } from "../utils/api";

export default function NewReservation() {
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

  async function handleSubmit(event) {
    event.preventDefault();
    // console.log("fDRes", formData.reservation_date);
    await createReservation(formData);

    history.push(`/dashboard?date=${formData.reservation_date}`);
  }

  const phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormData({
      ...formData,
      mobile_number: formattedInputValue,
    });
  };

  return (
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
  );
}
