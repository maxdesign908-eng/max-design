// lib/emailTemplate.ts : one look for every email the website sends (logo on top, brand colours).
//
// Email programs are old and strict, so this uses tables and inline styles (no CSS files, no flex, no SVG).
// The logo is a PNG at public/images/email-logo.png, loaded from your live site, so the address must be the full link.
// Optional: NEXT_PUBLIC_SITE_URL=https://www.maxdesign.agency (this is also the default).

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.maxdesign.agency").replace(/\/$/, "");

/** make visitor text safe to put inside HTML */
export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

type Row = [label: string, value: string];

export function emailLayout({
  heading,
  intro,
  rows = [],
  note,
}: {
  heading: string;
  /** a short line under the heading (plain text) */
  intro?: string;
  /** label / value lines, empty values are skipped */
  rows?: Row[];
  /** a closing line (plain text) */
  note?: string;
}) {
  const lines = rows.filter(([, v]) => v);

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f2f2f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#111111;">
        <tr>
          <td style="background:#000000;padding:20px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;"><img src="${SITE}/images/email-logo.png" width="48" height="48" alt="MAX design" style="display:block;border:0;border-radius:10px;"></td>
              <td style="vertical-align:middle;padding-left:14px;font-size:20px;letter-spacing:-0.5px;color:#ffffff;"><b>max</b>design</td>
            </tr></table>
          </td>
        </tr>
        <tr><td style="height:4px;background:#E71117;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:32px 28px 8px;">
            <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:700;color:#111111;">${esc(heading)}</h1>
            ${intro ? `<p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#444444;">${esc(intro)}</p>` : ""}
          </td>
        </tr>
        ${
          lines.length
            ? `<tr><td style="padding:8px 28px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e8e8;">
            ${lines
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:12px 16px 12px 0;border-bottom:1px solid #e8e8e8;width:140px;vertical-align:top;font-size:13px;color:#777777;">${esc(k)}</td><td style="padding:12px 0;border-bottom:1px solid #e8e8e8;vertical-align:top;font-size:15px;line-height:1.5;color:#111111;white-space:pre-wrap;">${esc(v)}</td></tr>`,
              )
              .join("")}
          </table>
        </td></tr>`
            : ""
        }
        ${note ? `<tr><td style="padding:16px 28px 8px;font-size:15px;line-height:1.6;color:#444444;">${esc(note)}</td></tr>` : ""}
        <tr>
          <td style="padding:24px 28px 28px;font-size:12px;line-height:1.6;color:#999999;">
            <b style="color:#111111;">max</b>design &middot; <a href="${SITE}" style="color:#E71117;text-decoration:none;">${esc(SITE.replace(/^https?:\/\//, ""))}</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
