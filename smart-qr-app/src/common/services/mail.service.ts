import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from 'src/config/env.loader';
import * as fs from 'fs';
import * as path from 'path';

const userGmail = EMAIL_USER;
const passAppGmail = EMAIL_PASS;

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, tipoEmail: string) {
    const templatePath = path.join(
      'src/common/emailTemplates/generalEmailTemplate.html',
    );
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Reemplazamos la variable {{nombre}} en el HTML
    let html = htmlTemplate.replace('{{name}}', to);
    html = html.replace('{{text}}', text);
    try {
      const info = await this.transporter.sendMail({
        from: `"SmartQR App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('Email sent: ' + info.response + ' to: ' + to);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
