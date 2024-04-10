import { EmailAdapter } from "./email.adapter";
import { Injectable } from "@nestjs/common";


@Injectable()
export class EmailManager {
  constructor(private emailAdapter:EmailAdapter) {
  }

  async sendEmailConfirmationCode(email: string, code: string) {
    const subject = 'Confirm Code'
    const message = " <h1>Thanks for your registration</h1>\n" +
      " <p>To finish registration please follow the link below:\n" +
      "     <a href='https://somesite.com/confirm-email?code="+code+"'>complete registration</a>\n" +
      " </p>\n"

    return await this.emailAdapter.sendEmail(email, subject, message)
  }

  async sendEmailRecoveryCode(email: string, code: string) {
    const subject = 'Confirm Code'
    const message = " <h1>Password recovery</h1>\n" +
      "       <p>To finish password recovery please follow the link below:\n" +
      "          <a href='https://somesite.com/password-recovery?recoveryCode="+code+"'>recovery password</a>\n" +
      "      </p>\n" +
      "    "

    return await this.emailAdapter.sendEmail(email, subject, message)
  }
}