import React, { useState } from "react";
import { useHistory } from "react-router";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "../reservations/ReservationsDisplay";

export default function Search() {
  const [number, setNumber] = useState("");
  const [list, setList] = useState([]);
  const [errors, setErrors] = useState(null);
  const [display, setDisplay] = useState(false);
  const history = useHistory();

  function handleChange({ target }) {
    setNumber(target.value);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setErrors(null);
    listReservations({ mobile_number: number }, abortController.signal)
      .then(setList).then(() => setDisplay(true))
      .catch(setErrors);
    return () => abortController.abort();
  }

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSearchSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
          <input
            name="mobile_number"
            id="mobile_number"
            type="text"
            placeholder="Enter a customer's phone number"
            className="form-control"
            onChange={handleChange}
            value={number}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
      {display && (<div>
        {list.length === 0 ? (
          <h2>No reservations found</h2>
        ) : (
          <ReservationsDisplay reservations={list} />
        )}
      </div>)}
    </div>
  );
}
