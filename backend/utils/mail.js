import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

/** Strip accidental quotes/spaces from .env (e.g. PASS= "xxxx" or EMAIL="a@b.com") */
function cleanEnvVal(value) {
  if (value == null) return ""
  let s = String(value).trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s
}

/** Read at send time so dotenv has loaded */
const gmailUser = () => cleanEnvVal(process.env.EMAIL)
/** App password: strip spaces; Gmail uses 16 chars without spaces */
const gmailPass = () => cleanEnvVal(process.env.PASS).replace(/\s/g, "")

function createGmailTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser(),
      pass: gmailPass(),
    },
  })
}

function mapSmtpError(err) {
  const msg = err?.message || String(err)
  const code = err?.responseCode
  if (code === 535 || msg.includes("535") || msg.includes("BadCredentials")) {
    return new Error(
      "Gmail rejected the login. Fix backend/.env: (1) EMAIL = your full Gmail address. " +
        "(2) PASS = a 16-character App Password from Google Account → Security → 2-Step Verification → App passwords " +
        "(create one for “Mail”; you cannot use your normal Gmail password). " +
        "(3) Paste the app password with or without spaces — spaces are stripped automatically."
    )
  }
  return err
}

async function sendWithGmail({ to, subject, html }) {
  const user = gmailUser()
  const pass = gmailPass()
  if (!user || !pass) {
    throw new Error(
      "Set EMAIL (Gmail address) and PASS (App Password) in backend/.env, or set MAIL_MODE=console for local testing."
    )
  }

  if (process.env.MAIL_MODE === "console") {
    console.info(`[MAIL_MODE=console] To: ${to} | ${subject}\n${html.replace(/<[^>]+>/g, " ")}`)
    return
  }

  const transporter = createGmailTransport()
  try {
    await transporter.sendMail({
      from: user,
      to,
      subject,
      html,
    })
  } catch (err) {
    throw mapSmtpError(err)
  }
}

export const sendOtpMail = async (to, otp) => {
  await sendWithGmail({
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  })
}

export const sendDeliveryOtpMail = async (userDoc, otp) => {
  await sendWithGmail({
    to: userDoc.email,
    subject: "Delivery OTP",
    html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  })
}
