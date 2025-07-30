import nodemailer from "nodemailer";
import { translateText, translateHtml } from "./deepl";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendContactEmail(
  name: string,
  email: string,
  message: string,
  lang: "en" | "da" = "en"
): Promise<void> {
  const adminText = `You’ve received a new message:
Name: ${name}
Email: ${email}

${message}`;

  const adminHtml = `
<div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 32px 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: Arial, sans-serif; color: #333;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
    <img src="https://ny.junkerskøreskole.dk/logo-jk.webp" alt="Junkers Logo" width="180" style="display: block;" />
  </div>
  <p style="margin-bottom: 16px;">En ny kunde har udfyldt kontaktformularen på <strong>junkerskøreskole.dk</strong>.</p>
  <a href="https://ny.junkerskøreskole.dk/admin/messages" style="display: inline-block; background-color: #CC222C; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 500;">
    Se kundebesked
  </a>
  <p style="font-size: 12px; color: #888; margin-top: 32px;">Dette er en automatisk notifikation fra Junkers Køreskole.</p>
</div>`;

  const userText = `Hej ${name},

      Tak for din besked! Vi kontakter dig hurtigst muligt.

      – Junkers Køreskole`;

  const userHtml = `
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 32px 24px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); color: #333; text-align: start;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
    <img src="https://ny.junkerskøreskole.dk/logo-jk.webp" alt="Junkers Logo" width="180" style="display: block;" />
  </div>
  <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 16px;">Tak for din besked, ${name}!</h2>
  <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
    <p style="margin: 0; font-size: 16px; font-weight: 500;">
      Vi har modtaget din henvendelse og vender tilbage hurtigst muligt.
    </p>
  </div>
  <p>Imens er du velkommen til at læse mere om kørekort forløbet her:</p>
  <div style="margin: 16px 0;">
    <a href="https://ny.junkerskøreskole.dk/korekort-forlob" style="background-color: #CC222C; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
      Læs om kørekortforløbet
    </a>
  </div>
  <p style="font-size: 14px; color: #555;">Har du spørgsmål eller ønsker du at ændre noget? Du er altid velkommen til at <a href="mailto:info@junkerskøreskole.dk" style="color: #2563eb;">kontakte os direkte</a>.</p>
  <p style="margin-top: 32px;">De bedste hilsner,<br/><strong>Teamet hos Junkers Køreskole</strong></p>
</div>`;

  let adminTextTr = adminText;
  let adminHtmlTr = adminHtml;
  let userTextTr = userText;
  let userHtmlTr = userHtml;

  console.log("[sendContactEmail] selected lang=", lang);

  if (lang !== "en") {
    [adminTextTr, userTextTr] = await Promise.all([
      translateText(adminText, lang),
      translateText(userText, lang),
    ]);

    [adminHtmlTr, userHtmlTr] = await Promise.all([
      translateHtml(adminHtml, lang),
      translateHtml(userHtml, lang),
    ]);

    console.log("[sendContactEmail] adminHtmlTr=", adminHtmlTr);
  }

  // Send to admin
  await transporter.sendMail({
    from: `"Junkers Køreskole" <${process.env.FROM_EMAIL!}>`,
    to: process.env.ADMIN_EMAIL!,
    subject:
      lang === "da"
        ? `Ny kontaktbesked fra ${name}`
        : `New contact form submission from ${name}`,
    text: adminTextTr,
    html: adminHtmlTr,
  });

  // Send to user
  await transporter.sendMail({
    from: `"Junkers Køreskole" <${process.env.FROM_EMAIL!}>`,
    to: email,
    subject:
      lang === "da"
        ? `Vi har modtaget din besked, ${name}`
        : `We’ve received your message, ${name}!`,
    text: userTextTr,
    html: userHtmlTr,
  });
}
