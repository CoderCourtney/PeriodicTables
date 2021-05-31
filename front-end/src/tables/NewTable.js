import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import { today } from "../utils/date-time";

export default function NewTable() {
  const history = useHistory();

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: 1,
  });

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   if (validateFields()) {
  //     history.push(`/dashboard`);
  //   }
  // }

  // ALT FROM NEW RESERVATION
  function handleSubmit(event) {
    event.preventDefault();
    // const abortController = new AbortController();
    setError(null);
    const valid = validateFields();
    if (valid) {
      createTable(formData)
        .then(() => history.push(`/dashboard?date=${today()}`))
        .catch(setError);
    }
  }

  function validateFields() {
    let foundError = "";

    if (
      formData.table_name === "" ||
      formData.capacity === "" ||
      formData.capacity === "0"
    ) {
      foundError +=
        "Please fill out all fields and make sure the table is more than 0.";
    } else if (formData.table_name.length < 2) {
      foundError += "Table name must be at least 2 characters.";
    }
    if (foundError) {
      setError(new Error(foundError));
      return false;
    }
    return true;
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <label htmlFor="table_name">Table Name:&nbsp;</label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        // minLength="2"
        onChange={handleChange}
        value={formData.table_name}
        required
      />
      <label htmlFor="capacity">Capacity:&nbsp;</label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        // min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
