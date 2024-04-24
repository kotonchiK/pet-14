import * as process from "process";
import nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";
import { appConfig } from "../../app.settings";

@Injectable()
export class EmailAdapter {
  async sendEmail(email:string, subject:string, message:string) {
    const transport = nodemailer.createTransport({
      host: appConfig.MailHost_1,
      port: appConfig.MailPort_1,
      secure: true,
      auth: { user: appConfig.MailLogin_1, pass: appConfig.MailPass_1}
    })

    return !!await transport.sendMail(
      {
        from: appConfig.MailFrom_1,
        to: email,
        subject,
        html: message,
      })

  }

  async sendGoogleEmail(email:string, subject:string, message:string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: { user: 'eny', pass: 'eny', }, })

    return await transport.sendMail(
      {
        from: 'eny',
        to: email,
        subject,
        html: message,
      })

  }

}