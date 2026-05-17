import db from "../config/db.js";

export const insertContact = (data, callback) => {
  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [data.name, data.email, data.phone, data.message],
    callback
  );
};