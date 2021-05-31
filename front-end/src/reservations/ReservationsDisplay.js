import React from "react"

export default function ReservationsDisplay({reservations}) {

    return (
        <div>
        {reservations.map((reservation) => (
            <div className="card" key={reservation.reservation_id}>
              <div className="card-body">
                <h4 className="card-title">
                  Reservation {reservation.first_name} {reservation.last_name}
                </h4>
                <p className="card-text">{reservation.mobile_number} </p>
                <p className="card-text">{reservation.reservation_date}</p>
                <p className="card-text">{reservation.reservation_time}</p>
                <p className="card-text">{reservation.people}</p>
                <p className="card-text">{}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={history.goBack()}
                >
                  Seat
                </button>
              </div>
            </div>
          ))}
        </div>
    )
}