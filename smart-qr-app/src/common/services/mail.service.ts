import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_SERVICE, EMAIL_USER } from 'src/config/env.loader';
import * as fs from 'fs';
import * as path from 'path';

// const mailService = EMAIL_SERVICE;
// const mailHost = EMAIL_HOST;
// const mailPort = EMAIL_PORT;
// const emailUser = EMAIL_USER;
// const emailPass = EMAIL_PASS;

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
        user: 'amigogabrielernesto@gmail.com',
        pass: 'mulp eoxz ebin kcuz',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, tipoEmail: string) {
    let templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html'); // default
    if (tipoEmail == 'basico') {
      templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html');
    }
    if (tipoEmail == 'order') {
      templatePath = path.join('src/common/emailTemplates/orderEmailTemplate.html');
    }

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
