import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

try {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: "YOUR_PERSONAL_EMAIL@gmail.com",
    subject: "PKREX Test Mail",
    text: "Mail working successfully",
  });

  console.log("✅ Mail Sent");
  console.log(info.messageId);
} catch (err) {
  console.error("❌ Mail Error");
  console.error(err);
}