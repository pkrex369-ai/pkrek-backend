import db from "../config/db.js";

export const insertContact = async (data) => {
  try {

    const sql = `
      INSERT INTO contacts
      (
        name,
        email,
        phone,
        message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const values = [
      data.name,
      data.email,
      data.phone,
      data.message,
    ];

    const result = await db.query(sql, values);

    return result.rows[0];

  } catch (error) {

    console.error("❌ Contact Insert Error:");
    console.error(error);

    throw error;
  }
};