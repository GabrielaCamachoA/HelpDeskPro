import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "false", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.log("[mailer] SMTP no configurado — se omitirá envío (dev).");
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "HelpDeskPro <hello@demomailtrap.co>",
    to,
    subject,
    html
  });
}
