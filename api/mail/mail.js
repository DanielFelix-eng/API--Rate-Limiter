import { verificationEmailTemplate, welcomeEmailTemplate, forgotPasswordEmailTemplate } from "../templates/emailTemplate.js"
import { sendEmail } from "../utils/sendEmail.js"

export const sendVerificationEmail = async (email, code) => {
  await sendEmail({
    to: email,
    subject: 'Verify Your Account',
    html: verificationEmailTemplate({ code, expiresIn: '1 hour' }),
  })
}

export const welcomeEmail = async (email, name) => {
  await sendEmail({
    to: email,
    subject: 'Welcome!',
    html: welcomeEmailTemplate({ name }),
  })
}

export const sendForgotPasswordEmail = async (email, name, resetLink) => {
  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html: forgotPasswordEmailTemplate({ resetLink, expiresIn: '1 hour' }),
  })
}