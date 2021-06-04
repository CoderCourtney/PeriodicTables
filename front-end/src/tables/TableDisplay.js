import React from "react";
import TableRow from "./TableRow";

// DASHBOARD IS PARENT
export default function TableDisplay({ tables, loadDasboard, setTables, date }) {

    const tablesJSX = (loadDashboard) => {
    return tables.map((table) => (
      <TableRow
        key={table.table_id}
        table={table}
        loadDashboard={loadDashboard}
        tables={tables}
        setTables={setTables}
        date={date}
      />
    ));
  };
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{tablesJSX()}</tbody>
      </table>
    </div>
  );
}


