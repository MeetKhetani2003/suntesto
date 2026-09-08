import nodemailer from "nodemailer";

export async function sendLowStockEmail(productName: string, currentStock: number) {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.warn("SMTP credentials not configured. Skipping low stock email alert.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Sustento System" <${SMTP_USER}>`,
      to: SMTP_USER, // Sending to the same configured user, or ADMIN_EMAIL if preferred
      subject: `⚠️ Low Stock Alert: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #dc2626;">Low Stock Alert</h2>
          <p>The following product has reached a low stock threshold (10 or fewer items remaining):</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Current Stock:</strong> <span style="color: #dc2626; font-weight: bold;">${currentStock}</span></p>
          </div>
          <p>Please restock this item soon to avoid stockouts.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Low stock email sent for ${productName} (Stock: ${currentStock})`);
  } catch (error) {
    console.error("Failed to send low stock email:", error);
  }
}
