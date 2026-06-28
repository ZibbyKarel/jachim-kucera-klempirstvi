import { Resend } from 'resend'

export const runtime = 'nodejs'

const PHONE_RE = /^(\+|00)?\d[\d\s/-]{7,15}$/

const FROM = 'web@jachim-kucera-tesarstvi.cz'
const TO = 'info@jachim-kucera-tesarstvi.cz'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const service = String(body.service ?? '').trim()
  const message = String(body.message ?? '').trim()
  const honeypot = String(body.website ?? '').trim()

  // Honeypot — bot vyplnil skryté pole. Tváříme se úspěšně, ale nic neposíláme.
  if (honeypot) {
    return Response.json({ success: true })
  }

  // Serverová validace.
  if (!name) {
    return Response.json({ error: 'name_required' }, { status: 422 })
  }
  if (!phone || !PHONE_RE.test(phone)) {
    return Response.json({ error: 'phone_invalid' }, { status: 422 })
  }
  if (!service) {
    return Response.json({ error: 'service_required' }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // V developmentu bez klíče zalogujeme a vrátíme úspěch, ať jde UI otestovat.
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] RESEND_API_KEY chybí — poptávka:', {
        name,
        phone,
        service,
        message,
      })
      return Response.json({ success: true, dev: true })
    }
    return Response.json({ error: 'not_configured' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a1410;">
      <h2 style="margin: 0 0 16px;">Nová poptávka z webu</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 16px 4px 0; color: #8B5E3C;">Jméno</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #8B5E3C;">Telefon</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #8B5E3C;">Služba</td><td>${escapeHtml(service)}</td></tr>
      </table>
      ${
        message
          ? `<p style="margin-top: 16px; color: #8B5E3C;">Zpráva</p><p style="white-space: pre-wrap;">${escapeHtml(message)}</p>`
          : ''
      }
    </div>`

  try {
    const { error } = await resend.emails.send({
      from: `Web — Jáchim & Kučera <${FROM}>`,
      to: TO,
      replyTo: undefined,
      subject: `Nová poptávka — ${service} — ${name}`,
      html,
      text: `Nová poptávka\nJméno: ${name}\nTelefon: ${phone}\nSlužba: ${service}\nZpráva: ${message || '—'}`,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return Response.json({ error: 'send_failed' }, { status: 502 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return Response.json({ error: 'send_failed' }, { status: 502 })
  }
}
