import React from "react";

import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import ReservationsDisplay from "../reservations/ReservationsDisplay";
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
        className="btn btn-info ml-1"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-primary ml-1"
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
