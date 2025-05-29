import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_SERVICE, EMAIL_USER } from 'src/config/env.loader';
import * as fs from 'fs';
import * as path from 'path';
import { ReportsDto } from '../../modules/cron/dto/reportes.dto';

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

  async sendReport(to: string, subject: string, text: string, reportData: ReportsDto) {
    //const html0 = this.generateHtmlReport0(reportData.getSalesTotalWeek);
    const html = this.generateHtmlReport1(reportData.getTopProductsWeek);
    // const html2 = this.generateHtmlReport2(reportData.getLeastSoldProductsWeek);
    // const html3 = this.generateHtmlReport3(reportData.getSalesByCategoryWeek);
    // const html4 = this.generateHtmlReport4(reportData.getSalesFrequencyWeek);
    // const html5 = this.generateHtmlReport5(reportData.getCustomersReport);
    // const html6 = this.generateHtmlReport6(reportData.getCustomerTypesWeek);
    // const htmlH = `<html><body>`;
    //const htmlF = `</body></html>`;

    //const fullHtml = htmlH + html0 + html1 + html2 + html3 + html4 + html5 + html6 + htmlF;
    // console.log('===========================================');
    // console.log(fullHtml);
    // console.log('===========================================');
    try {
      const info = await this.transporter.sendMail({
        from: `"SmartQR App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('Report sent: ' + info.response + ' to: ' + to);
      return info;
    } catch (error) {
      console.error('Error sending report:', error);
      throw error;
    }
  }

  private generateHtmlReport0(data): string {
    return `
        <html><body>
          <h2>💰 Total Sales in the Week</h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Producto</th>
                <th style="padding: 8px;">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              ${data}
            </tbody>
          </table>
    `;
  }

  private generateHtmlReport1(reportData): string {
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

  private generateHtmlReport2(reportData): string {
    return 'algo';
  }

  private generateHtmlReport3(reportData): string {
    return 'algo';
  }

  private generateHtmlReport4(reportData): string {
    return 'algo';
  }

  private generateHtmlReport5(reportData): string {
    return 'algo';
  }

  private generateHtmlReport6(reportData): string {
    return 'algo';
  }
}
