# Courtney Shane' Periodic Tables - Restaurant Reservation App

Thanks for checking out my Restaurant Reservation App! Built with the following: React.js, React Hooks, Bootstrap, Express.js, Node.js, Knex.js, etc.

<br><br>

# App images

### DASHBOARD

![Dashboard with Table & Buttons](../images/dashboard-table.png)

### NEW RESERVATION FORM

![New Reservation Form](../images/new-reservation-form.png)

### RESERVATION DISPLAYED ON THE DISPLAY

![New Reservation Form](../images/reservation-displayed-dashboard-with-table.png)

### OCCUPIED TABLE & FINISH BUTTON ON TABLE

![New Reservation Form](../images/occupied-finishButton.png)

# API Documentation

## `/reservations`

<hr>

### GET: `?date=YYYY-MM-DD`

Returns a list of reservations made for that date.

### GET: `?mobile_number={some-number}`

Returns a list of reservations when looking up the mobile number, either in part or the whole number.

<i>Shape of response.data from both requests above:</i>

### POST

- With a First name and last name.
- The mobile number and formated with dashes xxx-xxx-xxxx.
- Date formated to YYYY-MM-DD. Validated the date to be on the current day or in the future.
- Time is in 24H (HH:MM) format. The date property checks today's date and if the time must be past the time it is at the time the reservation is made.
- The party size gets checked if it more than 0 people.

Returns status 201 and the created reservation object.<br><br>

## `/reservations/:reservation_id`

<hr>

### GET

If the reservation defined in the request URL exists, it returns the reservation object.

```
{
    reservation_id: 7,
    first_name: "Courtney",
    last_name: "Shane",
    mobile_number: "777-888-9999",
    reservation_date: "2022-03-12",
    reservation_time: "11:30",
    people: 2,
    status: "booked"
}
```

### PUT

A request body is needed and returns status plus the updated reservation.<br><br>

## `/reservations/:reservation_id/status`

<hr>

### PUT

Brings in the status of "booked".

Returns status 200 and the updated reservation.
<br><br>

## `/tables`

<hr>

### GET

Returns a list of all tables in the database.

### POST

- table_name must be a string greater than one character.
- capacity cannot be 0 or a negative number.
- reservation_id handles if one is passed, or will give an error.

Returns the created table.
<br><br>

## `/tables/:table_id`

<hr>

### GET

If the table is in the request then it returns the table object.

<br>

## `/tables/:table_id/seat`

<hr>

### PUT

With a table_id & the reservation_id passed and the table is currently available, the table will be updated..<br>

When the table is updated with a reservation_id, the reservation is now seated at a table. The reservation's status will be updated to "seated" status.<br>
It returns the updated <i>reservation</i>, not the table.

### DELETE

This removes the table's reservation_id to not diplay what is inteneded to be deleted.

Returns the updated reservation object with the table updated.

<br>

# React Application

The react application for this project has three forms, one main dashboard page, and a search-by-phone page. Below, their URL's and functionality are displayed and defined.

## `/dashboard`

<hr>

The /dashboard route displays the tables and the reservations that are scheduled when on a specific date. Only those reservations that are booked or seated will not be displayed.

<br>

## `/dashboard?date=YYYY-MM-DD`

<hr>

When the /dashboard receives a date then the reservations for that date are displayed.

<br>

## `/reservations/new`

<hr>

Through new it displays a form that allows the user to create a new reservation.

After the reservation is submitted, the React application will go back to the dashboard and display the reservations belonging to the date of the newly created reservation.

<br>

## `/tables/new`

<hr>

A user can create a new table that will then display on the dashboard.

<br>

## `/reservations/:reservation_id/seat`

<hr>

A user can seat a reservation party at a table if it is free. Once a party has been seated then a finish button appears and then when the reservation is finihsed by clicking the finish button, then the table becomes free again.

<br>

## `/search`

<hr>

The Search component will allow the user to search for reservations by customer phone number. Partial matches are acceptable, and the API will return reservations for such matches. If no results are found, the page displays "No reservations found".

<br>

# Technologies Used

This app was built with PostgreSQL, Express.js, React.js, React hooks, Node.js, Bootstrap, ElephantSQL PostgreSQL to store data, Knex.js to update data, etc.

<br>

# Installation Instructions

In order to effectively install and use this application locally, you will need to either clone the repo from this [GitHub](https://github.com/CoderCourtney/PeriodicTables.git) or download the zip. You will then need to navigate to the top level of the project in your bash terminal and:

1. run `npm i`
2. `cd front-end && npm i`
3. `cd ../back-end && npm i`

Now that you have all of the scripts installed, you will need two different PostgreSQL database instances to either run the application locally or test it.

You must make a `.env` file in both the front-end and back-end directories.

Load the back-end `.env` file with two environment variables with the values of your two database URLs like so:

```
DATABASE_URL_DEVELOPMENT=development-data-base-url-goes-here
DATABASE_URL_TEST=test-data-base-url-goes-here
```

In the front-end `.env` file, enter:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

Now you will need to migrate the tables to the development database. Don't bother doing it for the test database, though. The tests are carrying that out for you each time. From the back-end folder:

1. `npx knex migrate:latest`
2. `npx knex seed:run`

Now you are ready to run the server locally. From the top level of the project, run `npm run start:dev` if you would like to run the server and application.

If you would like to test the application, you can view the `package.json` files and use the testing scripts provided there. Unfortunately, some of the provided testing scripts do not function. However, the ones that certainly do are:

1. all of those that are structured like `test:5:backend` or `test:3:frontend`
2. `test:frontend` and `test:backend`
