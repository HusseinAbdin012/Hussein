// --- pages/api/send-confirmation-email.js ---
// Backend endpoint using Nodemailer for AB Jewelery website

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, orderId, provider, items } = req.body;

  if (!email || !orderId || !items) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Configure transporter for your email service
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail", // your email service
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password or API key
      },
    });

    // Email content customized for AB Jewelery
    const mailOptions = {
      from: `${process.env.BRAND_NAME || 'AB Jewelery'} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your order <b>${orderId}</b> has been successfully placed via ${provider}.</p>
        <h3>Order Details:</h3>
        <ul>
          ${items.map(item => `<li>${item.name} - $${item.price}</li>`).join(" ")}
        </ul>
        <p>We’ll notify you once your order has shipped.</p>
        <p>Best regards,<br/>${process.env.BRAND_NAME || 'AB Jewelery'} Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Confirmation email sent" });
  } catch (err) {
    console.error("Email send failed", err);
    res.status(500).json({ error: "Email send failed" });
  }
}

// --- Deployment & Ownership Guide ---
// 1. Push your code to your GitHub account.
// 2. Sign up for Vercel and import your repo.
// 3. Add environment variables in Vercel:
//    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
//    - STRIPE_SECRET_KEY
//    - PAYPAL_CLIENT_ID
//    - EMAIL_USER
//    - EMAIL_PASS
//    - BRAND_NAME (set to 'AB Jewelery')
//    - EMAIL_SERVICE (optional, e.g., gmail, outlook)
// 4. Deploy → Vercel provides a live domain (e.g., abjewelery.vercel.app).
// 5. Purchase a custom domain and link it in Vercel settings.
// 6. Test payments in Stripe and PayPal sandbox mode.

// ✅ Tip: Customize all branding (names, colors, email templates) to fully reflect AB Jewelery.