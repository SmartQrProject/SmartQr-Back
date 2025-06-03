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

    console.log('tipo de mail:', tipoEmail);
    if (tipoEmail === 'basico') {
      templatePath = path.join('src/common/emailTemplates/generalEmailTemplate.html');
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      html = htmlTemplate.replace('{{name}}', to).replace('{{text}}', text);
    }
    if (tipoEmail === 'order') {
      templatePath = path.join('src/common/emailTemplates/orderEmailTemplate.html');
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
      html = htmlTemplate.replace('{{name}}', to).replace('{{text}}', text);
      console.log('Order email template loaded:', htmlTemplate);
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

  private generateHtmlReport(reportData: ReportsDto): string {
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
        <body>
          <!-- reporte sales Total -->
          <div style="font-family: Arial, sans-serif; margin-bottom: 30px;">
            <h2 style="color: #4CAF50; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
              🔝  Week Summary
            </h2>
            <p style="font-size: 14px; color: #333; margin-top: 10px;">
            <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Concept</th>
                <th style="padding: 8px;">Indicator</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Total Sales U$s</td><td style="text-align: right;">${salesTotal.toFixed(2)}$</td></tr>
              <tr><td>New Customers</td><td style="text-align: right;">${customersT.newCustomers}</td></tr>
              <tr><td>% of New Customers</td><td style="text-align: right;">${customersT.newPercentage.toFixed(1)}%</td></tr>
              <tr><td>Returning Customers</td><td style="text-align: right;">${customersT.returningCustomers}</td></tr>
              <tr><td>% of Returning Cust</td><td style="text-align: right;">${customersT.returningPercentage.toFixed(1)}%</td></tr>
            </tbody>
          </table>
            </p>
          </div>

          <!-- reporte productos mas vendidos -->
          <h2 style="color: #4CAF50; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            🔝 Most Sold Products in the week
          </h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Producto</th>
                <th style="padding: 8px;">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              ${rows1}
            </tbody>
          </table>

          <!-- reporte productos menos vendidos -->
          <h2 style="color: #e74c3c; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            ⬇️ Lowest-selling Products in the week
          </h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px;">Quantities</th>
              </tr>
            </thead>
            <tbody>
              ${rows2}
            </tbody>
          </table>

          <!-- categorias mas vendidas productos mas vendidos -->
          <h2 style="color: #4CAF50; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            🔝 Categories with Most Incomes in the week
          </h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Category</th>
                <th style="padding: 8px;">Total U$D</th>
                <th style="padding: 8px;">Percentage</th>
                <th style="padding: 8px;">Quantity</th>
                <th style="padding: 8px;">Avge Price U$D</th>
              </tr>
            </thead>
            <tbody>
              ${rows3}
            </tbody>
          </table>

          <!-- reporte Dias de la semana con mas ventas -->
          <h2 style="color: #4CAF50; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            🔝 Distribution of the Sales Qties by day
          </h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Week Day</th>
                <th style="padding: 8px;">Count</th>
              </tr>
            </thead>
            <tbody>
              ${rows4}
            </tbody>
          </table>

          <!-- reporte de clientes -->
          <h2 style="color: #4CAF50; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            🔝 Customers of the Week
          </h2>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">Customer Email</th>
                <th style="padding: 8px;">Customer Name</th>
                <th style="padding: 8px;">Total # Orders</th>
                <th style="padding: 8px;">Total Spent U$S</th>
                <th style="padding: 8px;">Average Spent U$S</th>
                <th style="padding: 8px;">Days from Last Visit</th>
              </tr>
            </thead>
            <tbody>
              ${rows5}
            </tbody>
          </table>

        </body>
      </html>
    `;
  }
}
