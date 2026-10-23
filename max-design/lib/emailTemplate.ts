// lib/emailTemplate.ts : ONE look for every email the website sends (contact, start a project, booking).
//
// Email programs (Gmail, Outlook, Apple Mail) are old and strict, so this uses tables and inline styles
// only (no CSS files, no flex, no SVG, no web fonts). It looks the same everywhere.
// The logo is a PNG at public/images/email-logo.png, loaded from your live site, so the address must be a full link.
// Optional: NEXT_PUBLIC_SITE_URL=https://www.maxdesign.agency (this is also the default).
//
// emailLayout() is backwards compatible: the old call  emailLayout({ heading, intro, rows, note })  still works
// (your booking route did not change). The new options only ADD things:
//   eyebrow    small red label above the heading            e.g. "Project request"
//   preheader  the grey preview text next to the subject in the inbox
//   summary    title above the label/value box              e.g. "Your request"
//   steps      a numbered "what happens next" list
//   cta        one big red button  { label, href }
//   signoff    "Warm regards, Team MAX design" at the end
//   footerNote small grey line in the footer ("You are receiving this because...")

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.maxdesign.agency").replace(/\/$/, "");

const RED = "#E71117";
const FONT = "Arial,Helvetica,sans-serif";

/** make visitor text safe to put inside HTML */
export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

type Row = [label: string, value: string];
type Step = { title: string; text: string };

export function emailLayout({
  heading,
  intro,
  rows = [],
  note,
  eyebrow,
  preheader,
  summary,
  steps,
  stepsTitle = "What happens next",
  cta,
  signoff = false,
  footerNote,
}: {
  heading: string;
  /** a short line under the heading (plain text) */
  intro?: string;
  /** label / value lines, empty values are skipped */
  rows?: Row[];
  /** a closing line (plain text) */
  note?: string;
  eyebrow?: string;
  preheader?: string;
  summary?: string;
  steps?: Step[];
  stepsTitle?: string;
  cta?: { label: string; href: string };
  signoff?: boolean;
  footerNote?: string;
}) {
  const lines = rows.filter(([, v]) => v);

  /* ───────── pieces ───────── */
  const hidden = preheader
    ? `<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(preheader)}${"&nbsp;&zwnj;".repeat(40)}</div>`
    : "";

  const header = `
        <tr>
          <td style="background:#000000;padding:22px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="vertical-align:middle;"><img src="${SITE}/images/email-logo.png" width="44" height="44" alt="MAX design" style="display:block;border:0;border-radius:10px;"></td>
                  <td style="vertical-align:middle;padding-left:12px;font-family:${FONT};font-size:20px;letter-spacing:-0.5px;color:#ffffff;"><b>max</b>design</td>
                </tr></table>
              </td>
              ${
                eyebrow
                  ? `<td align="right" style="vertical-align:middle;font-family:${FONT};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#9a9a9a;">${esc(eyebrow)}</td>`
                  : ""
              }
            </tr></table>
          </td>
        </tr>
        <tr><td style="height:4px;background:${RED};font-size:0;line-height:0;">&nbsp;</td></tr>`;

  const hero = `
        <tr>
          <td style="padding:40px 32px 8px;font-family:${FONT};">
            <h1 style="margin:0 0 14px;font-family:${FONT};font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-0.6px;color:#111111;">${esc(heading)}</h1>
            ${intro ? `<p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.65;color:#4a4a4a;">${esc(intro)}</p>` : ""}
          </td>
        </tr>`;

  const summaryBox = lines.length
    ? `
        <tr>
          <td style="padding:24px 32px 8px;">
            ${summary ? `<p style="margin:0 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#8a8a8a;">${esc(summary)}</p>` : ""}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;border:1px solid #ececec;border-radius:12px;">
              ${lines
                .map(
                  ([k, v], i) => `<tr><td style="padding:14px 20px;${i < lines.length - 1 ? "border-bottom:1px solid #ececec;" : ""}">
                <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8a8a8a;padding-bottom:4px;">${esc(k)}</div>
                <div style="font-family:${FONT};font-size:15px;line-height:1.55;color:#111111;white-space:pre-wrap;word-break:break-word;">${esc(v)}</div>
              </td></tr>`,
                )
                .join("")}
            </table>
          </td>
        </tr>`
    : "";

  const stepsBox = steps?.length
    ? `
        <tr>
          <td style="padding:28px 32px 4px;">
            <p style="margin:0 0 14px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#8a8a8a;">${esc(stepsTitle)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${steps
                .map(
                  (s, i) => `<tr>
                <td width="40" style="vertical-align:top;padding:0 0 16px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" style="width:28px;height:28px;border-radius:14px;background:${RED};font-family:${FONT};font-size:13px;font-weight:700;line-height:28px;color:#ffffff;">${i + 1}</td></tr></table>
                </td>
                <td style="vertical-align:top;padding:0 0 16px;font-family:${FONT};">
                  <div style="font-size:15px;font-weight:700;line-height:1.4;color:#111111;">${esc(s.title)}</div>
                  <div style="font-size:14px;line-height:1.6;color:#5a5a5a;padding-top:2px;">${esc(s.text)}</div>
                </td>
              </tr>`,
                )
                .join("")}
            </table>
          </td>
        </tr>`
    : "";

  const button = cta
    ? `
        <tr>
          <td style="padding:12px 32px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td align="center" bgcolor="${RED}" style="border-radius:999px;background:${RED};">
                <a href="${esc(cta.href)}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:15px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:999px;">${esc(cta.label)}</a>
              </td>
            </tr></table>
          </td>
        </tr>`
    : "";

  const noteRow = note
    ? `<tr><td style="padding:18px 32px 0;font-family:${FONT};font-size:15px;line-height:1.65;color:#4a4a4a;">${esc(note)}</td></tr>`
    : "";

  const sign = signoff
    ? `<tr><td style="padding:26px 32px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:#4a4a4a;">Warm regards,<br><b style="color:#111111;">Team MAX design</b></td></tr>`
    : "";

  const footer = `
        <tr>
          <td style="padding:30px 32px 0;"><div style="height:1px;background:#ececec;line-height:1px;font-size:0;">&nbsp;</div></td>
        </tr>
        <tr>
          <td style="padding:20px 32px 30px;font-family:${FONT};font-size:12px;line-height:1.7;color:#9a9a9a;">
            <b style="color:#111111;">max</b>design &middot; <a href="${SITE}" style="color:${RED};text-decoration:none;">${esc(SITE.replace(/^https?:\/\//, ""))}</a>
            ${footerNote ? `<br>${esc(footerNote)}` : ""}
          </td>
        </tr>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;-webkit-text-size-adjust:100%;">
  ${hidden}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">${header}${hero}${summaryBox}${stepsBox}${button}${noteRow}${sign}${footer}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}