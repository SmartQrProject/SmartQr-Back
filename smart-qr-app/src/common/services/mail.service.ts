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

  async sendMail(to: string, subject: string, text: string, tipoEmail: string, reportData?: ReportsDto) {
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

    if (tipoEmail == 'report' && reportData) {
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

  private generateHtmlReport(reportData: ReportsDto): string {
    const salesTotal = reportData.getSalesTotalWeek;
    const topProduct = reportData.getTopProductsWeek;
    const leastSoldP = reportData.getLeastSoldProductsWeek;
    const topCategor = reportData.getSalesByCategoryWeek;
    const salesFrequ = reportData.getSalesFrequencyWeek;
    const customersT = reportData.getCustomerTypesWeek;

    const rows1 = topProduct.map((p) => `<tr><td>${p.name}</td><td>${p.quantity}</td></tr>`).join('');
    const rows2 = leastSoldP.map((p) => `<tr><td>${p.name}</td><td>${p.quantity}</td></tr>`).join('');
    const rows3 = topCategor
      .map((p) => `<tr><td>${p.category}</td><td>${p.total.toFixed(2)}</td><td>${p.percentage.toFixed(1)}</td><td>${p.quantity}</td><td>${p.average_price.toFixed(2)}</td></tr>`)
      .join('');
    const rows4 = salesFrequ.map((p) => `<tr><td>${p.label}</td><td>${p.count}</td></tr>`).join('');
    return `
      <html>
        <body>
          <!-- reporte sales Total -->
          <div style="font-family: Arial, sans-serif; margin-bottom: 30px;">
            <h2 style="color: #4CAF50; font-size: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
              🔝  Week Summary
            </h2>
            <p style="font-size: 20px; color: #333; margin-top: 10px;">
              <strong style="color: #2c3e50;"> Total Sales U$s    :${salesTotal.toFixed(2)}</strong> USD
              <strong style="color: #2c3e50;"> New Customer       :${customersT.newCustomers}</strong>
              <strong style="color: #2c3e50;"> % of New Customers :${customersT.newPercentage.toFixed(1)}</strong>
              <strong style="color: #2c3e50;"> Returning Customers:${customersT.returningCustomers}</strong>
              <strong style="color: #2c3e50;"> % of Returning Cust:${customersT.returningPercentage.toFixed(1)}</strong>
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
                <th style="padding: 8px;">Avge Price</th>
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

        </body>
      </html>
    `;
  }
}
