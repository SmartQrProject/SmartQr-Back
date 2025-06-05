import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_SERVICE, EMAIL_USER, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from 'src/config/env.loader';
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
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, tipoEmail: string, reportData?: ReportsDto) {
    let templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html'); // default
    let html = '';

    // console.log('tipo de mail:', tipoEmail);
    if (tipoEmail === 'basico') {
      templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html');
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      html = htmlTemplate.replace('{{name}}', to).replace('{{text}}', text);
    }
    if (tipoEmail === 'order') {
      templatePath = path.join('src/common/emailTemplates/orderEmailTemplate.html');
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      html = htmlTemplate.replace('{{name}}', to).replace('{{text}}', text);
      //console.log('Order email template loaded:', htmlTemplate);
    }

    if (tipoEmail === 'report' && reportData) {
      html = this.generateHtmlReport(reportData);
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"SmartQR App" <${SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  public generateHtmlReport(reportData: ReportsDto): string {
    const salesTotal = reportData.getSalesTotalWeek;
    const topProduct = reportData.getTopProductsWeek;
    const leastSoldP = reportData.getLeastSoldProductsWeek;
    const topCategor = reportData.getSalesByCategoryWeek;
    const salesFrequ = reportData.getSalesFrequencyWeek;
    const customersT = reportData.getCustomerTypesWeek;
    const customersR = reportData.getCustomersReport;

    const rows1 = topProduct.map((p) => `<tr><td>${p.name}</td><td style="text-align: right;">${p.quantity}</td></tr>`).join('');
    const rows2 = leastSoldP.map((p) => `<tr><td>${p.name}</td><td style="text-align: right;">${p.quantity}</td></tr>`).join('');
    const rows3 = topCategor
      .map(
        (p) =>
          `<tr><td>${p.category}</td><td style="text-align: right;">${p.total.toFixed(2)}</td><td style="text-align: right;">${p.percentage.toFixed(1)}%</td><td style="text-align: right;">${p.quantity}</td><td style="text-align: right;">${p.average_price.toFixed(2)}</td></tr>`,
      )
      .join('');

    const rows4 = salesFrequ.map((p) => `<tr><td>${p.label}</td><td style="text-align: right;">${p.count}</td></tr>`).join('');
    const rows5 = customersR.data
      .map(
        (p) =>
          `<tr>
                <td>${p.email}</td><td>${p.name}</td><td style="text-align: right;">${p.orders}</td>
                <td style="text-align: right;">${p.totalSpent.toFixed(2)}</td>
                <td style="text-align: right;">${p.averageOrder.toFixed(2)}</td>
                <td style="text-align: right;">${p.daysSince}</td>
            </tr>`,
      )
      .join('');

    return `
<html>
  <body style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; color: #333; padding: 0; margin: 0;">
    <div style="padding: 40px;">

      <h1 style="text-align: center; color: #2c3e50;">📊 Weekly Report</h1>

      <!-- 🔝 Week Summary -->
      <div style="margin-top: 40px;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 15px; border-radius: 6px; font-size: 18px;">
          🔝 Week Summary
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc;">Concept</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Indicator</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #eee;">Total Sales U$S</td><td style="padding: 10px; text-align: right;">${salesTotal.toFixed(2)}$</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee;">New Customers</td><td style="padding: 10px; text-align: right;">${customersT.newCustomers}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee;">% of New Customers</td><td style="padding: 10px; text-align: right;">${customersT.newPercentage.toFixed(1)}%</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee;">Returning Customers</td><td style="padding: 10px; text-align: right;">${customersT.returningCustomers}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee;">% of Returning Cust</td><td style="padding: 10px; text-align: right;">${customersT.returningPercentage.toFixed(1)}%</td></tr>
          </tbody>
        </table>
      </div>

      <!-- 🔥 Most Sold Products -->
      <div style="margin-top: 40px; break-inside: avoid; page-break-inside: avoid;">
        <div style="background-color: #2196F3; color: white; padding: 10px 15px; border-radius: 6px; font-size: 18px;">
          🔥 Most Sold Products
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc;">Product</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Quantity</th>
            </tr>
          </thead>
          <tbody>${rows1}</tbody>
        </table>
      </div>

      <!-- 📉 Lowest-selling Products -->
      <div style="margin-top: 40px; break-inside: avoid; page-break-inside: avoid;">
        <div style="background-color: #e74c3c; color: white; padding: 10px 15px; border-radius: 6px; font-size: 18px;">
          📉 Lowest-selling Products
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc;">Product</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Quantity</th>
            </tr>
          </thead>
          <tbody>${rows2}</tbody>
        </table>
      </div>

      <!-- 🏷️ Top Categories -->
      <div style="margin-top: 40px; break-inside: avoid; page-break-inside: avoid;">
        <div style="background-color: #9C27B0; color: white; padding: 10px 15px; border-radius: 6px; font-size: 18px;">
          🏷️ Top Categories by Revenue
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc;">Category</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Total U$D</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Percentage</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Quantity</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Avg Price</th>
            </tr>
          </thead>
          <tbody>${rows3}</tbody>
        </table>
      </div>

      <!-- 📆 Sales by Day -->
      <div style="margin-top: 40px; break-inside: avoid; page-break-inside: avoid;">
        <div style="background-color: #FF9800; color: white; padding: 10px 15px; border-radius: 6px; font-size: 18px;">
          📆 Sales by Day
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc;">Day</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Sales Count</th>
            </tr>
          </thead>
          <tbody>${rows4}</tbody>
        </table>
      </div>

      <!-- 👥 Top Customers -->
      <div style="margin-top: 40px; break-inside: avoid; page-break-inside: avoid;">
  <div style="background-color: #607D8B; color: white; padding: 10px 15px; border-radius: 6px; font-size: 18px;">
    👥 Top Customers
  </div>
<table style="width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: avoid;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc;">Email</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Name</th>
              <th style="padding: 10px; border: 1px solid #ccc;"># Orders</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Total Spent</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Avg. Order</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Days Since Last Visit</th>
            </tr>
          </thead>
          <tbody>${rows5}</tbody>
        </table>
      </div>

      <!-- Footer -->
      <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #999;">
        Report generated automatically by <strong>Smart-QR</strong>
      </p>
    </div>
  </body>
</html>
`;
  }

  async sendMailWithAttachment(to: string, subject: string, text: string, html: string, attachment: { filename: string; content: Buffer }) {
    await this.transporter.sendMail({
      from: `"Smart-QR" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
      attachments: [attachment],
    });
  }

  public generateHtmlReportWithCover(reportData: ReportsDto, restaurantName: string, fromStr: string, toStr: string): string {
    const htmlContent = this.generateHtmlReport(reportData);

    return `
  <html>
   <head>
    <style>
      table, tr, td, th {
        page-break-inside: avoid !important;
        word-break: break-word;
      }

      div {
        page-break-inside: avoid;
      }
    </style>
  </head>
    <body style="font-family: 'Segoe UI', sans-serif; color: #333;">
      <div style="max-width: 800px; margin: auto; padding: 40px;">
        <!-- Portada -->
        <!-- Portada centrada sin página en blanco -->
<div style="display: flex; justify-content: center; align-items: center; text-align: center; height: 400px; flex-direction: column;">
  <img src="https://res.cloudinary.com/dsrcokjsp/image/upload/v1748937749/y33ykcfyqlzebprecoep.png" alt="SmartQR Logo" style="max-height: 80px; margin-bottom: 20px;" />
  <h1 style="font-size: 32px; color: #2c3e50; margin: 0;">Weekly Performance Report</h1>
  <h2 style="font-size: 20px; color: #4CAF50; margin: 10px 0;">${restaurantName}</h2>
  <p style="font-size: 16px; margin: 0;">From ${fromStr.split('T')[0]} to ${toStr.split('T')[0]}</p>
  <hr style="width: 60%; margin-top: 30px; border: none; border-top: 1px solid #ccc;" />
</div>



       </div>

  ${htmlContent}

    </body>
  </html>
  `;
  }
}
