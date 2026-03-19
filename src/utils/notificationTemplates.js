/**
 * notificationTemplates.js
 * Pre-built message templates for WhatsApp (via Twilio/360dialog)
 * and Email notifications that ComplyRMG sends to factories.
 *
 * In production: POST these to your backend which calls the APIs.
 * The backend endpoint is: POST /api/notify { type, factoryId, payload }
 */

// ── WhatsApp templates (must match approved templates in Twilio/360dialog) ──

export const WA_TEMPLATES = {
  cert_expiry_60: (factoryName, certName, expiryDate) => `
*ComplyRMG Alert* 🔔

Hi ${factoryName},

Your *${certName}* certification expires on *${expiryDate}* — that's in 60 days.

Start your renewal process now to avoid audit failures with buyers.

👉 Log in to manage: https://complyrm.com/certifications

Reply STOP to opt out.
`.trim(),

  cert_expiry_30: (factoryName, certName, expiryDate) => `
*ComplyRMG Urgent Alert* ⚠️

Hi ${factoryName},

Your *${certName}* expires in *30 days* (${expiryDate}).

Buyers like H&M and Zara require valid certs before placing orders. A lapsed certificate can result in lost orders.

👉 Upload your renewal now: https://complyrm.com/certifications

Need help? Reply to this message.
`.trim(),

  wage_violation: (factoryName, count) => `
*ComplyRMG Wage Alert* 🚨

Hi ${factoryName},

*${count} worker(s)* in your wage register are below the legal minimum of ৳12,500/month.

This is a BSCI audit failure point. Fix this before your next buyer audit.

👉 Review wage register: https://complyrm.com/wages
`.trim(),

  invoice_sent: (factoryName, invoiceNum, amount, dueDate) => `
*ComplyRMG Invoice* 📄

Hi ${factoryName},

Invoice *${invoiceNum}* for *${amount}* is ready.
Due date: *${dueDate}*

Payment via bKash: 01700-000000

👉 View invoice: https://complyrm.com/billing

Thank you for your business.
`.trim(),

  onboarding_welcome: (factoryName, contactName) => `
*Welcome to ComplyRMG!* 🎉

Hi ${contactName},

Your factory *${factoryName}* has been set up on ComplyRMG — Bangladesh's compliance management platform built for RMG factories.

Here's how to get started:
1️⃣ Add your workers and upload NIDs
2️⃣ Upload your BSCI/WRAP certificates
3️⃣ Start your audit checklist

👉 Login now: https://complyrm.com

Your 60-day free trial has started. Questions? Reply to this message.
`.trim(),

  trial_expiry: (factoryName, daysLeft) => `
*ComplyRMG Trial Ending* ⏱

Hi ${factoryName},

Your free trial ends in *${daysLeft} days*.

To keep full access to your compliance records, worker data, and audit checklists — upgrade now.

Starter: ৳4,999/mo
Professional: ৳12,999/mo

👉 Upgrade: https://complyrm.com/billing

Questions? Reply here.
`.trim(),
}

// ── Email templates ────────────────────────────────────────────────────

export const EMAIL_TEMPLATES = {
  invoice_sent: (invoice, factory) => ({
    subject: `Invoice ${invoice.number} — ৳${invoice.items.reduce((s, i) => s + i.qty * i.unitPrice, 0).toLocaleString()} due ${invoice.dueDate}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { margin: 0; padding: 0; background: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrap { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; }
  .header { background: #0a0e0a; padding: 24px 28px; }
  .brand { color: #4ade80; font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .brand-sub { color: #5c6e5c; font-size: 11px; margin-top: 2px; letter-spacing: 0.08em; text-transform: uppercase; }
  .body { padding: 28px; }
  .inv-num { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 4px; }
  .inv-sub { font-size: 13px; color: #777; margin-bottom: 24px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f9fdf9; border-radius: 6px; padding: 16px; margin-bottom: 24px; border: 1px solid #e8f0e8; }
  .meta-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
  .meta-val { font-size: 13px; font-weight: 600; color: #111; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { font-size: 10px; text-transform: uppercase; color: #fff; background: #0a0e0a; padding: 8px 12px; text-align: left; }
  td { padding: 10px 12px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0; }
  .total-row td { font-weight: 700; font-size: 15px; color: #4ade80; background: #0a0e0a; border-bottom: none; }
  .pay-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin-bottom: 24px; }
  .pay-title { font-size: 12px; font-weight: 700; color: #15803d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .05em; }
  .pay-line { font-size: 13px; color: #166534; margin-bottom: 4px; }
  .cta { display: block; background: #4ade80; color: #0a0e0a; text-align: center; padding: 13px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none; margin-bottom: 20px; }
  .footer { background: #f9f9f9; padding: 16px 28px; border-top: 1px solid #eee; font-size: 11px; color: #999; }
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <div class="brand">ComplyRMG</div>
    <div class="brand-sub">RMG Compliance Platform · Dhaka, Bangladesh</div>
  </div>
  <div class="body">
    <div class="inv-num">${invoice.number}</div>
    <div class="inv-sub">Invoice for ${factory?.name || invoice.factoryName} · ${invoice.period}</div>
    
    <div class="meta-grid">
      <div><div class="meta-label">Issue Date</div><div class="meta-val">${invoice.issueDate}</div></div>
      <div><div class="meta-label">Due Date</div><div class="meta-val">${invoice.dueDate}</div></div>
      <div><div class="meta-label">Bill To</div><div class="meta-val">${factory?.name || invoice.factoryName}</div></div>
      <div><div class="meta-label">Status</div><div class="meta-val" style="color:#f59e0b">Payment Pending</div></div>
    </div>

    <table>
      <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>
        ${invoice.items.map(item => `<tr><td>${item.description}</td><td style="text-align:right">৳${(item.qty * item.unitPrice).toLocaleString()}</td></tr>`).join('')}
        <tr class="total-row"><td>Total Due</td><td style="text-align:right">৳${invoice.items.reduce((s, i) => s + i.qty * i.unitPrice, 0).toLocaleString()}</td></tr>
      </tbody>
    </table>

    <div class="pay-box">
      <div class="pay-title">Payment Instructions</div>
      <div class="pay-line">📱 bKash Business: <strong>01700-000000</strong></div>
      <div class="pay-line">🏦 Bank: Dutch-Bangla Bank · A/C: 1234567890</div>
      <div class="pay-line">⏰ Please pay by <strong>${invoice.dueDate}</strong></div>
    </div>

    ${invoice.notes ? `<p style="font-size:13px;color:#555;margin-bottom:20px">${invoice.notes}</p>` : ''}

    <a href="https://complyrm.com/billing" class="cta">View Invoice Online →</a>

    <p style="font-size:12px;color:#999">Questions? Reply to this email or WhatsApp us at +880 1700-000000.</p>
  </div>
  <div class="footer">
    ComplyRMG · Gulshan-2, Dhaka 1212, Bangladesh · support@complyrm.com<br>
    © ${new Date().getFullYear()} ComplyRMG. You received this because you are a registered factory.
  </div>
</div>
</body>
</html>`,
  }),

  onboarding_welcome: (factory, contactName) => ({
    subject: `Welcome to ComplyRMG — Your compliance platform is ready`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { margin: 0; padding: 0; background: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrap { max-width: 560px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; }
  .header { background: #0a0e0a; padding: 28px; text-align: center; }
  .brand { color: #4ade80; font-size: 22px; font-weight: 700; }
  .body { padding: 32px 28px; }
  h2 { font-size: 20px; color: #111; margin-bottom: 8px; }
  p { font-size: 14px; color: #444; line-height: 1.7; margin-bottom: 16px; }
  .steps { border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; margin: 24px 0; }
  .step { display: flex; align-items: flex-start; gap: 14px; padding: 14px 18px; border-bottom: 1px solid #f0f0f0; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; background: #4ade80; color: #0a0e0a; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .step-title { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 2px; }
  .step-desc { font-size: 12px; color: #777; }
  .cta { display: block; background: #4ade80; color: #0a0e0a; text-align: center; padding: 14px; border-radius: 6px; font-size: 14px; font-weight: 700; text-decoration: none; }
  .footer { background: #f9f9f9; padding: 16px 28px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
</style></head>
<body>
<div class="wrap">
  <div class="header"><div class="brand">ComplyRMG</div></div>
  <div class="body">
    <h2>Welcome, ${contactName}! 🎉</h2>
    <p><strong>${factory?.name}</strong> has been set up on ComplyRMG. Your 60-day free trial starts today.</p>
    <p>Here's how to get started in the next 7 days:</p>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div><div class="step-title">Add your workers</div><div class="step-desc">Upload NID scans and employment contracts for audit readiness</div></div></div>
      <div class="step"><div class="step-num">2</div><div><div class="step-title">Upload certifications</div><div class="step-desc">Add your BSCI, WRAP, Fire Safety, and other certs with expiry dates</div></div></div>
      <div class="step"><div class="step-num">3</div><div><div class="step-title">Start your BSCI checklist</div><div class="step-desc">See your readiness score and identify compliance gaps instantly</div></div></div>
      <div class="step"><div class="step-num">4</div><div><div class="step-title">Log your wage register</div><div class="step-desc">Ensure all workers meet the ৳12,500 minimum — flag violations early</div></div></div>
    </div>
    <a href="https://complyrm.com" class="cta">Open ComplyRMG →</a>
  </div>
  <div class="footer">ComplyRMG · support@complyrm.com · Questions? Reply to this email</div>
</div>
</body>
</html>`,
  }),
}

/**
 * sendWhatsApp(template, to)
 * In production, POST to your backend:
 * fetch('/api/notify/whatsapp', { method: 'POST', body: JSON.stringify({ to, message: template }) })
 *
 * sendEmail(template, to)
 * In production, POST to your backend (uses Resend / SendGrid):
 * fetch('/api/notify/email', { method: 'POST', body: JSON.stringify({ to, subject, html }) })
 */
