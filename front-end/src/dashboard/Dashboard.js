import React from "react";

import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import ReservationsDisplay from "../reservations/ReservationsDisplay";
// import TableRow from "../tables/TableRow";
import TableDisplay from "../tables/TableDisplay";

// ROUTES IS PARENT
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
  setTables,
  tablesError,
  loadDashboard,
  onCancel,
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

  // function handleClick({ target }) {
  //   let newDate;
  //   let useDate;

  //   if (!date) {
  //     useDate = today();
  //   } else {
  //     useDate = date;
  //   }

  //   if (target.name === "previous") {
  //     newDate = previous(useDate);
  //   } else if (target.name === "next") {
  //     newDate = next(useDate);
  //   } else {
  //     newDate = today();
  //   }

  //   history.push(`/dashboard?date=${newDate}`);
  // }

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   updateTable(table.table_id, reservation_id)
  //     .then(() => listTables().then(setTables))
  //     .then(() => listReservations().then(setReservations))
  //     .then(() => history.push(`dashboard?date=${date}`))
  //     .catch(console.log);
  // }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-info"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
      <ErrorAlert error={reservationsError} />
      <ReservationsDisplay
        reservations={reservations}
        loadDashboard={loadDashboard}
        onCancel={onCancel}
      />

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
      <TableDisplay
        date={date}
        tables={tables}
        loadDashboard={loadDashboard}
        setTables={setTables}
      />
    </main>
  );
}

export default Dashboard;
