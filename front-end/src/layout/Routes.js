import React, { useEffect, useState } from "react";

import useQuery from "../utils/useQuery";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservations";
import { listReservations, listTables, cancelStatus } from "../utils/api";
import SeatReservation from "../reservations/SeatReservation";
import NewTable from "../tables/NewTable";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables()
      .then((existingTables) => {
        const updatedExistingTables = existingTables.map((table) => {
          return { ...table };
        });
        return updatedExistingTables;
      })
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

function onCancel(reservation_id) {
  const abortController = new AbortController();
  cancelStatus(reservation_id, abortController.signal)
        .then(loadDashboard)
        .catch(setReservationsError);
  
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation loadDashboard={loadDashboard} createOrEdit={"create"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          setTables={setTables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
          onCancel={onCancel}
        />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <NewReservation loadDashboard={loadDashboard} createOrEdit={"edit"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation
          reservations={reservations}
          tables={tables}
          loadDashboard={loadDashboard}
          setReservations={setReservations}
          setTables={setTables}
        />
      </Route>
      <Route path="/tables/new">
        <NewTable tables={tables} setTables={setTables} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
