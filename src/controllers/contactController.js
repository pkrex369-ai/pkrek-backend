import { insertContact } from "../models/contactModel.js";

export const createContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.json({
      status: false,
      message: "All fields required"
    });
  }

  insertContact({ name, email, phone, message }, (err) => {
    if (err) {
      return res.json({
        status: false,
        message: "DB Error"
      });
    }

    res.json({
      status: true,
      message: "Message sent successfully"
    });
  });
};