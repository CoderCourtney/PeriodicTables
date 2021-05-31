import React from "react";

import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import ReservationsDisplay from "../reservations/ReservationsDisplay";
import TableRow from "./TableRow";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard,
}) {
  const history = useHistory();

  // const reservationsJSX = () => {
  //   return reservations.map((reservation) => (
  //     <ReservationRow
  //       key={reservation.reservation_id}
  //       reservation={reservation}
  //       loadDashboard={loadDashboard}
  //     />
  //   ));
  // };

  const tablesJSX = () => {
    return tables.map((table) => (
      <TableRow
        key={table.table_id}
        table={table}
        loadDashboard={loadDashboard}
      />
    ));
  };

  function handleClick({ target }) {
    let newDate;
    let useDate;

    if (!date) {
      useDate = today();
    } else {
      useDate = date;
    }

    if (target.name === "previous") {
      newDate = previous(useDate);
    } else if (target.name === "next") {
      newDate = next(useDate);
    } else {
      newDate = today();
    }

    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationsDisplay reservations={reservations} />

      {/* <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Time</th>
            <th scope="col">People</th> */}
      {/* <th scope="col">Status</th> */}
      {/* <th scope="col">Seat Table</th> */}
      {/* </tr>
        </thead>
        <tbody>{reservationsJSX}</tbody>
      </table> */}

      <h4 className="mb-0">Tables</h4>
      <ErrorAlert error={tablesError} />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{tablesJSX}</tbody>
      </table>

      <button type="button" className="btn btn-secondary" onClick={handleClick}>
        Previous
      </button>
      <button type="button" className="btn btn-info" onClick={handleClick}>
        Today
      </button>
      <button type="button" className="btn btn-primary" onClick={handleClick}>
        Next
      </button>
    </main>
  );
}

export default Dashboard;
