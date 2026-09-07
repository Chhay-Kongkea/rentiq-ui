import type { BookingResponse } from "@/lib/types/vendor.types";

export type BookingDocumentType = "invoice" | "receipt";

export interface BookingDocumentParty {
  name: string;
  email?: string;
}

export interface BookingDocumentItem {
  title: string;
  locationText?: string;
}

function formatMoney(amount = 0, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatLabel(value?: string) {
  if (!value) return "";
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);
}

function isPaid(booking: BookingResponse) {
  return booking.paymentStatus === "HELD_IN_ESCROW" || booking.paymentStatus === "RELEASED_TO_VENDOR";
}

export function buildBookingDocumentHtml(
  type: BookingDocumentType,
  booking: BookingResponse,
  item: BookingDocumentItem,
  renter: BookingDocumentParty,
  owner: BookingDocumentParty,
): string {
  const isInvoice = type === "invoice";
  const docLabel = isInvoice ? "Invoice" : "Receipt";
  const docNumber = `${isInvoice ? "INV" : "RCT"}-${(booking.bookingRef || booking.id).toString().slice(0, 8).toUpperCase()}`;
  const issueDate = formatDate(booking.createdAt);
  const currency = booking.currency || "USD";
  const paid = isPaid(booking);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const logoUrl = `${origin}/img/Rentiq.png`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Rentiq ${docLabel} ${docNumber}</title>
<style>
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #1a2340;
    background: #eef0f4;
    margin: 0;
    padding: 40px 16px;
    -webkit-font-smoothing: antialiased;
  }
  .print-bar { max-width: 820px; margin: 0 auto 16px; display: flex; justify-content: flex-end; }
  .print-btn {
    background: #1a2340; color: #fff; border: none; border-radius: 10px; padding: 10px 22px;
    font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: 0.01em;
  }
  .print-btn:hover { background: #F73030; }

  .sheet {
    max-width: 820px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
    overflow: hidden;
  }
  .accent-bar { height: 6px; background: linear-gradient(90deg, #F73030 0%, #253C95 100%); }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 40px 48px 32px;
  }
  .logo { height: 34px; width: auto; display: block; }
  .company-line { margin-top: 10px; font-size: 11px; color: #9aa1b4; line-height: 1.6; max-width: 240px; }
  .doc-meta { text-align: right; }
  .doc-title { font-size: 26px; font-weight: 800; letter-spacing: 0.02em; color: #1a2340; }
  .doc-number { margin-top: 6px; font-size: 12.5px; color: #6b7280; font-weight: 600; }
  .doc-status { margin-top: 10px; }

  .status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 13px; border-radius: 999px; font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .status-pill.paid { background: #dcfce7; color: #15803d; }
  .status-pill.due { background: #fef3c7; color: #b45309; }
  .status-dot { width: 6px; height: 6px; border-radius: 999px; background: currentColor; }

  .divider { height: 1px; background: #eef0f4; margin: 0 48px; }

  .meta-row {
    display: flex; justify-content: space-between; gap: 24px;
    padding: 28px 48px 0;
  }
  .party { flex: 1; }
  .party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #9aa1b4; margin-bottom: 8px; }
  .party-name { font-size: 14.5px; font-weight: 700; color: #1a2340; }
  .party-sub { font-size: 12px; color: #6b7280; margin-top: 3px; line-height: 1.5; }
  .party.align-right { text-align: right; }

  .dates-strip {
    display: flex; gap: 32px;
    margin: 28px 48px 0; padding: 16px 20px;
    background: #f8fafc; border-radius: 10px;
  }
  .dates-strip .field { flex: 1; }
  .dates-strip .field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9aa1b4; }
  .dates-strip .field-value { margin-top: 4px; font-size: 13px; font-weight: 700; color: #1a2340; }

  .items { padding: 28px 48px 0; }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: #9aa1b4; padding: 0 0 10px; border-bottom: 1.5px solid #1a2340;
  }
  thead th.num, tbody td.num { text-align: right; }
  tbody td { padding: 16px 0; border-bottom: 1px solid #f1f2f6; font-size: 13.5px; color: #1a2340; vertical-align: top; }
  tbody td.desc-title { font-weight: 700; }
  tbody td.desc-sub { font-size: 11.5px; color: #9aa1b4; font-weight: 400; margin-top: 3px; }

  .totals-wrap { display: flex; justify-content: flex-end; padding: 20px 48px 0; }
  .totals { width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; color: #6b7280; }
  .totals-row .value { font-weight: 600; color: #1a2340; }
  .totals-row.grand {
    margin-top: 10px; padding: 14px 16px; border-radius: 10px;
    background: #1a2340; color: #fff;
  }
  .totals-row.grand .label { font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
  .totals-row.grand .value { font-size: 19px; font-weight: 800; color: #fff; }

  .notes { padding: 28px 48px 0; }
  .notes-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9aa1b4; margin-bottom: 6px; }
  .notes p { margin: 0; font-size: 12px; color: #6b7280; line-height: 1.7; }

  .footer { margin-top: 32px; padding: 22px 48px 36px; border-top: 1px solid #eef0f4; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
  .footer .thanks { font-size: 13px; font-weight: 700; color: #1a2340; }
  .footer .fine { margin-top: 4px; font-size: 11px; color: #9aa1b4; }
  .footer .generated { font-size: 10.5px; color: #c3c8d4; text-align: right; white-space: nowrap; }

  @media print {
    body { background: #fff; padding: 0; }
    .sheet { box-shadow: none; border-radius: 0; max-width: 100%; }
    .print-bar { display: none; }
  }
</style>
</head>
<body>
  <div class="print-bar"><button class="print-btn" onclick="window.print()">Print / Save as PDF</button></div>
  <div class="sheet">
    <div class="accent-bar"></div>

    <div class="header">
      <div>
        <img class="logo" src="${logoUrl}" alt="Rentiq" />
        <div class="company-line">Rentiq — peer-to-peer rental marketplace<br />support@rentiq.site &nbsp;·&nbsp; rentiq.site</div>
      </div>
      <div class="doc-meta">
        <div class="doc-title">${docLabel}</div>
        <div class="doc-number">${escapeHtml(docNumber)}</div>
        <div class="doc-status">
          ${paid
            ? '<span class="status-pill paid"><span class="status-dot"></span>Paid</span>'
            : `<span class="status-pill due"><span class="status-dot"></span>${escapeHtml(formatLabel(booking.paymentStatus) || "Unpaid")}</span>`}
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="meta-row">
      <div class="party">
        <div class="party-label">From</div>
        <div class="party-name">Rentiq</div>
        <div class="party-sub">On behalf of ${escapeHtml(owner.name)}${item.locationText ? `<br />${escapeHtml(item.locationText)}` : ""}</div>
      </div>
      <div class="party align-right">
        <div class="party-label">Billed to</div>
        <div class="party-name">${escapeHtml(renter.name)}</div>
        ${renter.email ? `<div class="party-sub">${escapeHtml(renter.email)}</div>` : ""}
      </div>
    </div>

    <div class="dates-strip">
      <div class="field"><div class="field-label">Issue date</div><div class="field-value">${issueDate}</div></div>
      <div class="field"><div class="field-label">Rental period</div><div class="field-value">${formatDate(booking.rentalStart)} &ndash; ${formatDate(booking.rentalEnd)}</div></div>
      <div class="field"><div class="field-label">Booking status</div><div class="field-value">${formatLabel(booking.status)}</div></div>
    </div>

    <div class="items">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="num">Days</th>
            <th class="num">Rate</th>
            <th class="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="desc-title">${escapeHtml(item.title)}</div>
              <div class="desc-sub">Booking ref ${escapeHtml((booking.bookingRef || booking.id).toString())}</div>
            </td>
            <td class="num">${booking.rentalDays ?? "-"}</td>
            <td class="num">${formatMoney(booking.bookedPricePerDay, currency)}</td>
            <td class="num">${formatMoney(booking.subtotal, currency)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="totals-wrap">
      <div class="totals">
        <div class="totals-row"><div class="label">Subtotal</div><div class="value">${formatMoney(booking.subtotal, currency)}</div></div>
        <div class="totals-row"><div class="label">Security deposit (refundable)</div><div class="value">${formatMoney(booking.securityDeposit, currency)}</div></div>
        <div class="totals-row grand"><div class="label">${isInvoice ? "Total due" : "Total paid"}</div><div class="value">${formatMoney(booking.totalAmount, currency)}</div></div>
      </div>
    </div>

    <div class="notes">
      <div class="notes-title">Notes</div>
      <p>Security deposits are held in escrow and refunded after a successful return inspection, minus any documented damage. This ${docLabel.toLowerCase()} was issued electronically by Rentiq and is valid without a signature.</p>
    </div>

    <div class="footer">
      <div>
        <div class="thanks">Thank you for renting with Rentiq.</div>
        <div class="fine">Questions about this ${docLabel.toLowerCase()}? Contact support through your Rentiq account.</div>
      </div>
      <div class="generated">Generated ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}</div>
    </div>
  </div>
</body>
</html>`;
}

export function openBookingDocument(
  type: BookingDocumentType,
  booking: BookingResponse,
  item: BookingDocumentItem,
  renter: BookingDocumentParty,
  owner: BookingDocumentParty,
) {
  const html = buildBookingDocumentHtml(type, booking, item, renter, owner);
  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}
