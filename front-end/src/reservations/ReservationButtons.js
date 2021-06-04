import React from "react";

import { Link } from "react-router-dom";

export default function ReservationsButtons({
  status,
  reservation_id,
  onCancel,
}) {

  const handleCancel = (event) => {
    event.preventDefault();
    const confirmBox = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmBox === true) {
      onCancel(reservation_id);
    }
  };

  if (status === "booked") {
    return (
      <div>
        <Link
          to={`/reservations/${reservation_id}/seat`}
          className="btn btn-secondary mr-1 oi"
        >
          {" "}
          Seat
        </Link>
        <Link
          to={`/reservations/${reservation_id}/edit`}
          className="btn btn-secondary mr-1 oi ml-1"
        >
          {" "}
          Edit
        </Link>
        <button
          className="btn btn-danger mr-1 oi ml-1"
          data-reservation-id-cancel={reservation_id}
          onClick={handleCancel}
        >
          {" "}
          Cancel
        </button>
      </div>
    );
  }
  return <div></div>;
}