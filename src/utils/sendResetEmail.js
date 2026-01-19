import nodemailer from "nodemailer";

export async function sendResetEmail(email, newPassword) {
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,   //"Tarun.m@preneurs.in",
      pass: process.env.EMAIL_PASS,   //"Waynerooney123#",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: '"Tarun M" <Tarun.m@preneurs.in>',
    to: email,
    subject: "Your Password Has Been Reset",
    html: `
      <p>Your password has been reset successfully.</p>
      <p><strong>New Password:</strong> ${newPassword}</p>
      <p>Please log in and change it immediately.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent successfully");
    return { success: true };
  } catch (err) {
    console.error("Failed to send reset password email:", err);
    return { success: false, error: err.message };
  }
}