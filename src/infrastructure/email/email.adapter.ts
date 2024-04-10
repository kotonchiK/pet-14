import * as process from "process";
import nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailAdapter {
  async sendEmail(email:string, subject:string, message:string) {
    const transport = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    })

    return !!await transport.sendMail(
      {
        from: '"kotonchiK-It." <kotonchikit@inbox.ru>',
        to: email,
        subject,
        html: message,
      })

  }

  async sendGoogleEmail(email:string, subject:string, message:string) {
    const transport = nodemailer.createTransport({ service: 'gmail', secure: true, auth: { user: process.env.MAIL_LOGIN, pass: process.env.MAIL_PASSWORD, }, })

    return await transport.sendMail(
      {
        from: '"kotonchiK-It." <kotonchikit@inbox.ru>',
        to: email,
        subject,
        html: message,
      })

  }

}