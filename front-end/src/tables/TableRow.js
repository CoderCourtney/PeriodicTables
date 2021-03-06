import React from "react";
import { useHistory } from "react-router";
import { deleteOnFinish, listTables } from "../utils/api";

// TABLE DISPLAY IS PARENT
export default function TableRow({ table, tables, setTables }) {
  const history = useHistory();

  const finishHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const confirmBox = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmBox === true) {
      deleteOnFinish(table.table_id, abortController.signal)
        .then(() =>
          tables.filter(
            (tableToKeep) => tableToKeep.table_id !== table.table_id
          )
        )
        .then(() => listTables())
        .then(setTables)
        .then(() => history.go(0))
        .catch();
    }
    return () => abortController.abort();
  };

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id} className={"text-primary"}>
        {table.reservation_id ? "occupied" : "free"}
      </td>
      <td>
        {table.reservation_id ? (
          <button
            type="button"
            className="btn btn-success ml-1"
            data-table-id-finish={table.table_id}
            onClick={finishHandler}
          >
            Finish
          </button>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
}
