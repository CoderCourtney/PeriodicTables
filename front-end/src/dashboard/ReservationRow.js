import React from "react";

// note that i pass in a reservation object as a prop:
export default function ReservationRow({ reservation, loadDashboard }) {
  // returning "null" inside of a react component basically means return nothing. however, we always want to make sure we return null if we intend to return nothing.
  if (!reservation) return null;

  return (
    <tr>
      {/* because the reservation id is a primary key, i figured i would make this a sort of table header (recall it basically just makes the test bold */}
      <th scope="row">{reservation.reservation_id}</th>
      {/* for everything else, i use "td", which means table data. */}
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      {/* <td>{reservation.status}</td> */}

      {/* lastly, the instructions call for a "seat" button. here is where i put it: */}
      <td>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button type="button">Seat</button>
        </a>
      </td>
    </tr>
  );
}
