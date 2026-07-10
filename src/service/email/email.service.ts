import { Injectable } from '@nestjs/common';
import type { Transporter } from 'nodemailer';
import { EmailConfig, SendResult } from 'src/shared/interfaces/smtp.interface';
import nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter: Transporter
    private emailConfig: EmailConfig
    constructor() {
        this.emailConfig = {
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT!),
            secure: true,
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!
            },
            
        }


        this.transporter = nodemailer.createTransport(this.emailConfig)

    }

    async send(toEmail: string, subject: string, text:string): Promise<SendResult> {
         try {
            const info = await this.transporter.sendMail({
                from: `Pivaldi App <${process.env.SMTP_USER!}>`,
                to: toEmail,
                subject: subject,
                text: text,
            })
            console.log(info);
            
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };

        }
    }


}
