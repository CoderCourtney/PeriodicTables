import React from "react";

import { Link, useHistory } from "react-router-dom";
import { cancelStatus, listReservations } from "../utils/api";

export default function ReservationsButtons({
  status,
  reservation_id,
  setErrors,
  loadDashboard,
  onCancel,
}) {
  const history = useHistory();

  const handleCancel = (event) => {
    event.preventDefault();
    const confirmBox = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmBox === true) {
      onCancel(reservation_id);
    }
  };

  // function cancelHandler({
  //   target: { dataset: { reservationIdCancel } } = {},
  // }) {
  //   if (
  //     reservationIdCancel &&
  //     window.confirm(
  //       "Do you want to cancel this reservation?\n\nThis cannot be undone."
  //     )
  //   ) {
  //     onCancel(reservationIdCancel);
  //   }
  // }

  // function onCancel(reservation_id) {
  //   const abortController = new AbortController();
  //   cancelReservation(reservation_id, abortController.signal)
  //     .then(loadDashboard)
  //     .catch(setReservationsError);
  //   return () => abortController.abort();
  // }

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
          className="btn btn-secondary mr-1 oi"
        >
          {" "}
          Edit
        </Link>
        <button
          className="btn btn-danger mr-1 oi"
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