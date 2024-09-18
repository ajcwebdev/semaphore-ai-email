// send-email.js

import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function sendEmail() {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const htmlTemplate = await fs.readFile(join(__dirname, 'email-template.html'), 'utf-8')

  let mailOptions = {
    from: `"Test Email" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Weekly Update',
    html: htmlTemplate
  }

  let info = await transporter.sendMail(mailOptions)
  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

async function main() {
  while (true) {
    try {
      await sendEmail()
      console.log('Email sent successfully. Waiting 1 week before sending the next one...')
    } catch (error) {
      console.error('Failed to send email:', error)
    }
    await new Promise(resolve => setTimeout(resolve, 7 * 24 * 60 * 60 * 1000))
  }
}

main().catch(console.error)