import nodemailer from "nodemailer";
import {
  EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE
} from '../config/emailTemplates.js'

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "85ca55001@smtp-brevo.com", // Verify this in Brevo
    pass: "JG3KVkv8ZgDyQRqz",        // Verify this in Brevo
  },
});

export async function sendMail(senderEmail, userName) {
  if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    throw new Error("Invalid or missing senderEmail");
  }
  if (!userName || typeof userName !== "string") {
    throw new Error("Invalid or missing userName");
  }

  try {
    const info = await transporter.sendMail({
      from: "danishrao299@gmail.com", // Match Brevo credentials
      to: senderEmail,
      subject: "Rao's Group ✔",
      text: `
Dear ${userName},

Welcome to Rao's Group! We are thrilled to have you on board.

Your journey with us starts today, and we're excited to help you unlock all the amazing benefits and features of our platform. Whether you're here for our services, products, or community, we aim to make your experience smooth, enjoyable, and rewarding.

As a member of Rao's Group, you'll have access to:
- Exclusive offers and updates
- A supportive community
- Premium content and more!

Feel free to explore your profile, set up your preferences, and begin your adventure with us. If you have any questions or need assistance, our team is just an email away.

Thank you for choosing Rao's Group. We're happy to have you with us!

Best regards,
The Rao's Group Team
[https://danishrao.com]
[danishrao299@gmail.com]
      `,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendOtpMail(senderEmail, otp) {
  if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    throw new Error("Invalid or missing senderEmail");
  }

  try {
    const info = await transporter.sendMail({
      from: "danishrao299@gmail.com",
      to: senderEmail,
      subject: "Rao's Group ✔",
      // text: `${otp}`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",senderEmail)
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}



export async function sendPassOtpMail(senderEmail, otp) {
  if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    throw new Error("Invalid or missing senderEmail");
  }

  try {
    const info = await transporter.sendMail({
      from: "danishrao299@gmail.com",
      to: senderEmail,
      subject: "Rao's Group ✔",
      // text: `${otp}`,
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",senderEmail)
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}
