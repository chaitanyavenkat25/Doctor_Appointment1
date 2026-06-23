const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"DocBook" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

exports.sendAppointmentConfirmation = (to, name, doctor, date, time) =>
  sendEmail({
    to,
    subject: "Appointment Booked Successfully",
    html: `<h2>Hi ${name},</h2><p>Your appointment with <strong>Dr. ${doctor}</strong> is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.</p>`,
  });

exports.sendAppointmentStatus = (to, name, status, doctor, date) =>
  sendEmail({
    to,
    subject: `Appointment ${status}`,
    html: `<h2>Hi ${name},</h2><p>Your appointment with <strong>Dr. ${doctor}</strong> on <strong>${date}</strong> has been <strong>${status}</strong>.</p>`,
  });

exports.sendDoctorApproval = (to, name, status) =>
  sendEmail({
    to,
    subject: `Doctor Account ${status}`,
    html: `<h2>Hi Dr. ${name},</h2><p>Your account registration has been <strong>${status}</strong> by the admin.</p>`,
  });
