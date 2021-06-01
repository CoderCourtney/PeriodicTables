import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  updateTable,
  readReservation,
  listTables,
  listReservations,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

export default function SeatReservation({
  reservations,
  tables,
  loadDashboard,
  setReservations,
  setTables,
}) {
  const history = useHistory();
  const [tableId, setTableId] = useState(0);
  const [errors, setErrors] = useState(null);
  const [reservation, setReservation] = useState({});
  const { reservation_id } = useParams();

  //   if (!tables || !reservations) return null;

  function handleChange({ target }) {
    setTableId(target.value);
  }

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal).then(
      setReservation
    );
  }, [reservation_id]);

  function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);
    const valid = validateSeat();
    if (valid) {
      updateTable(tableId, reservation_id)
        .then(() => listReservations({date: today()}).then(setReservations))
        .then(() => listTables().then(setTables))
        .then(() => history.push(`/dashboard`))
        .catch(setErrors);
    }
  }

  //   function handleSubmit(event) {
  //     event.preventDefault();
  //     setErrors(null);
  //     const valid = validateSeat();
  //     // console.log("\n\n\n errors", errors);
  //     if (valid) {
  //       createReservation(formData)
  //         .then(() =>
  //           history.push(`/dashboard?date=${formData.reservation_date}`)
  //         )
  //         .catch(setErrors);
  //     }
  //   }

  function validateSeat() {
    const foundErrors = [];
    const foundTable = tables.find((table) => +table.table_id === +tableId);
    // const foundReservation = reservations.find(
    //   (reservation) => +reservation.reservation_id === +reservation_id
    // );

    if (!foundTable) {
      foundErrors.push("The table you selected does not exist.");
    } else if (!reservation) {
      foundErrors.push(`This reservation ${reservation_id} does not exist.`);
    } else {
      if (foundTable.reservation_id) {
        foundErrors.push("The table you selected is currently occupied.");
      }
      // res id on the table => occupied
      // no res id on the table => free

      if (foundTable.capacity < reservation.people) {
        foundErrors.push(
          `The table you selected cannot seat ${reservation.people} people.`
        );
      }
    }

    if (foundErrors.length) {
      setErrors(new Error(foundErrors.toString()));
      return false;
    }
    return true;
  }

  const tableOptionsJSX = () => {
    return tables.map((table) => (
      <option value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  };

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Choose table:</label>
        <select
          name="table_id"
          id="table_id"
          value={tableId}
          onChange={handleChange}
        >
          {tableOptionsJSX()}
        </select>

        <button type="submit">Submit</button>
        <button type="button" onClick={history.goBack}>
          Cancel
        </button>
      </form>
    </div>
  );
}
