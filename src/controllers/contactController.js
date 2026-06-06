import db from "../config/db.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const result = await db.query(
      `
      INSERT INTO contacts
      (
        name,
        email,
        phone,
        message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [
        name.trim(),
        email.trim(),
        phone.trim(),
        message.trim(),
      ]
    );

    // Send email notification
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_FROM,
      subject: "New Contact Form Submission - PKREX",
      html: `
        <h2>New Contact Enquiry</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    });

    return res.status(201).json({
      status: true,
      message: "Message sent successfully",
      contactId: result.rows[0].id,
    });

  } catch (error) {
    console.error("❌ Contact Controller Error:");
    console.error(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};