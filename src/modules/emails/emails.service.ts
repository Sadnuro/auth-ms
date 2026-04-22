import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { envs } from 'src/config';
import { IEmail } from 'src/modules/emails/interfaces';
import { treeifyError } from 'zod';

@Injectable()
export class EmailsService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(envs.RESEND_API_KEY);
  }

  async sendMail(data: IEmail) {
    try {
      return await this.resend.emails.send({
        from: `Earth <${data.from || envs.RESEND_FROM_MAIL!}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message || '');
    }
  }

  // Send multiple emails
  async sendBatchEmail(emails: IEmail[]) {
    try {
      if (emails.length === 0) {
        throw new InternalServerErrorException('No emails to send');
      }
      return await this.resend.batch.send(
        emails.map((email) => ({
          from: `Earth <${email.from || envs.RESEND_FROM_MAIL!}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
        })),
      );
    } catch (error: any) {
      throw new InternalServerErrorException(error.message || '');
    }
  }
}
