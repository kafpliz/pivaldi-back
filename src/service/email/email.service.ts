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
                pass:  process.env.SMTP_PASS!
            }
        }
        console.log(this.emailConfig);
        
        this.transporter = nodemailer.createTransport(this.emailConfig)
        console.log(this.transporter);
        
    }

    async sendVerifivicationCode(toEmail: string, code: number): Promise<SendResult> {
        try {
          
            const info = await this.transporter.sendMail({
                from: 'Pivaldi ',
                to: toEmail,
                subject: 'Код подверждения электронной почты',
                text: `Ваш код подтверждения: ${code}\n\nНикому не сообщайте этот код.`,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #333;">Подтверждение email</h2>
                    <p>Ваш код подтверждения:</p>
                    <div style="font-size: 32px; font-weight: bold; padding: 20px; background: #f5f5f5; text-align: center; letter-spacing: 5px;">
                        ${code}
                    </div>
                    <p style="color: #666; font-size: 12px;">Срок действия кода: 3 часа. Никому не сообщайте этот код.</p>
                </div>
            `

            })

            
            
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };

        }
    }

    generateCode(length: number = 6): number {
    return Math.floor(100000 + Math.random() * 900000)
}
}
