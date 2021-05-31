import React from "react";

export default function TableRow({ table }) {
  if (!table) return null;

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      {/* the instructions say the tests are looking for this data-table-id-status, so be sure to include it. */}
      <td data-table-id-status={table.table_id}>{table.status}</td>
    </tr>
  );
}
