// app/api/email/route.js

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { subject, type, submissionData, to } = await req.json();

    // ✅ Default recipient if `to` not provided
    const recipient = to || 'hello@questpodai.com';

    if (!subject || !type || !submissionData) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,   //"Tarun.m@preneurs.in",
        pass: process.env.EMAIL_PASS,   //"Waynerooney123#",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // ✅ Prepare attachment if exists
    let attachments = [];
    if (submissionData.attachmentUrl) {
      if (submissionData.attachmentUrl.startsWith("data:")) {
        // Handle Data URI
        attachments.push({
          path: submissionData.attachmentUrl,
          filename: submissionData.attachmentName || "attachment.bin"
        });
      } else {
        // Handle Legacy File Path (Only if it exists locally, which might fail on Vercel)
        // Or if it is a remote URL, nodemailer can fetch it if we use 'path' with a URL?
        // Actually, nodemailer 'path' supports URLs too.
        // But the previous code was reading from FS using the URL pathname.
        try {
          const urlPath = new URL(submissionData.attachmentUrl);
          const relativePath = urlPath.pathname.replace(/^\/+/, ''); // remove leading slash
          const filePath = path.join(process.cwd(), 'public', relativePath);

          if (fs.existsSync(filePath)) {
            try {
              const fileContent = fs.readFileSync(filePath);
              attachments.push({
                filename: path.basename(filePath),
                content: fileContent,
              });
            } catch (fileReadError) {
              console.error("Error reading attachment file:", fileReadError);
            }
          } else {
            console.warn("Attachment file not found:", filePath);
          }
        } catch (e) {
          console.warn("Error parsing attachment URL:", e);
        }
      }
    }
    delete submissionData.attachmentUrl;
    delete submissionData.attachmentName;


    // ✅ Format HTML table dynamically
    const htmlTable = `
      <p>Hi Tharun,</p>
      <p>We have received a new <strong>${type}</strong> from QuestpodAI.</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        ${Object.entries(submissionData)
        .map(
          ([key, value]) =>
            `<tr><td><strong>${key}</strong></td><td>${value || '-'}</td></tr>`
        )
        .join("")}
      </table>
      <p>Thanks!</p>
    `;

    const mailOptions = {
      from: '<hello@questpodai.com>',
      to: recipient,
      subject: subject,
      html: htmlTable,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
