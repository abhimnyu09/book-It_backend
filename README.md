# 🚀 BookIt: Experiences (Backend)

This is the backend API server for the **BookIt** application. It's a Node.js and Express server written in TypeScript that connects to a MongoDB database.

This API is responsible for serving experience data, managing bookings, preventing double-bookings, and validating promo codes.

## ✨ Features

* Serves all experience data from a MongoDB database.
* Provides detailed information for a single experience.
* Provides real-time booking availability for any given experience.
* Saves new user bookings to the database.
* **Prevents Double Bookings:** Rejects any new booking for a slot that is already taken.
* Validates promo codes.

## 💻 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express
* **Language:** TypeScript
* **Database:** MongoDB (using `mongodb` driver)
* **Middleware:** CORS, Dotenv

---

## 🔧 How to Run Locally

Follow these instructions to get the server running on your local machine.

### Prerequisites

* Node.js (v18.x or higher)
* npm
* A **MongoDB Atlas** account (or a local MongoDB instance).

### Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abhimnyu09/book-It_backend
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd book-It_backend
    ```

3.  **Install all dependencies:**
    ```bash
    npm install
    ```

4.  **Create your Environment File:**
    You must create a file named `.env` in the root of this project.
    ```bash
    touch .env
    ```

5.  **Add your MongoDB Connection String to `.env`:**
    Open the `.env` file and add your MongoDB Atlas connection string. Make sure to include your database name (e.g., `booklt`) in the string.
    ```
    MONGO_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/booklt?retryWrites=true&w=majority
    ```
    *(Remember to URL-encode special characters in your password, like replacing `@` with `%40`)*

6.  **Run the development server:**
    The server will automatically connect to your database and populate it with sample data if the collections are empty.
    ```bash
    npm run dev
    ```

The server will start on **`http://localhost:4000`**.

## 📖 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/experiences` | Returns a list of all experiences. |
| `GET` | `/experiences/:id` | Returns the details for a single experience by its `id`. |
| `GET` | `/experiences/:id/availability` | Returns a list of booked slots (date/time) for a single experience. |
| `POST` | `/bookings` | Creates a new booking. Expects booking data in the request body. |
| `POST` | `/promo/validate` | Validates a promo code. Expects `{"promoCode": "CODE"}` in the request body. |
