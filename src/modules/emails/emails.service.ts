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
  async sendBatchEmail() {}
}
