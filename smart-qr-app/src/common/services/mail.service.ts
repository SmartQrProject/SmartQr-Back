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

  async sendMail(to: string, subject: string, text: string, tipoEmail: string, reportData?: object) {
    let templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html'); // default
    let html = '';

    if (tipoEmail == 'basico') {
      templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html');
      let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      let html = htmlTemplate.replace('{{name}}', to);
      html = html.replace('{{text}}', text);
    }

    if (tipoEmail == 'order') {
      templatePath = path.join('src/common/emailTemplates/orderEmailTemplate.html');
      let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      let html = htmlTemplate.replace('{{name}}', to);
      html = html.replace('{{text}}', text);
    }

    if (tipoEmail == 'report') {
      console.log('pase por aqui:', reportData);
      html = this.generateHtmlReport(reportData);
    }

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

  private generateHtmlReport(reportData): string {
    const rows = reportData.map((p) => `<tr><td>${p.name}</td><td>${p.quantity}</td></tr>`).join('');

    return `
      <html>
        <body>
          <h2>🔝 Productos Más Vendidos</h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Producto</th>
                <th style="padding: 8px;">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  }
}
