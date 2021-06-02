import React from "react";

import { Link } from "react-router-dom";

export default function ReservationsButtons({ status, reservation_id }) {
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
      </div>
    );
  }
  return <div></div>;
}
