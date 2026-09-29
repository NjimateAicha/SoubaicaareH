// Supabase Edge Function: send-reservation-email
//
// Invoked by the frontend (DataService.createReservation, in src/lib/supabase.ts)
// AFTER a reservation has already been successfully inserted into the
// `reservations` table. This function's only job is to notify the business
// by email — it must never be what determines whether the booking itself
// succeeded. If sending fails, the reservation the customer already
// completed remains saved; this function just logs the failure.
//
// Sends via SMTP (denomailer), server-side only. No credentials ever live in
// the React frontend or in VITE_* env vars.
//
// Required secrets (set via `supabase secrets set NAME=value`, never
// committed to the repo):
//   SMTP_HOST
//   SMTP_PORT
//   SMTP_USER
//   SMTP_PASS
//   SMTP_FROM   — the "From" address, e.g. "SOUBAICAR <Contact@soubaicar.com>"
//
// Recipients (fixed, not user input):
//   Contact@soubaicar.com (primary)
//   soubaimed@yahoo.es (copy)

import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const PRIMARY_RECIPIENT = 'Contact@soubaicar.com';
const COPY_RECIPIENT = 'soubaimed@yahoo.es';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ReservationPayload {
  id: string;
  customer_name: string;
  email?: string;
  phone: string;
  country?: string;
  vehicle_name?: string;
  location_name?: string;
  pickup_date: string;
  return_date: string;
  message?: string;
  language?: string;
  created_at: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildWhatsAppLink(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}`;
}

function buildEmailHtml(r: ReservationPayload): string {
  // Built as a single unindented string on purpose: multi-line template
  // literals with leading whitespace per line produced runs of pure-space
  // characters that, once quoted-printable encoded for SMTP transport,
  // rendered as literal "=20 =20 =20 ..." at the top of the email instead
  // of being decoded back into whitespace. No leading indentation/blank
  // lines here avoids that entirely, regardless of the transfer encoding
  // the SMTP layer picks.
  const row = (label: string, value: string) =>
    '<tr><td style="padding:6px 12px;color:#667085;font-size:13px;white-space:nowrap;">' +
    escapeHtml(label) +
    '</td><td style="padding:6px 12px;color:#15265A;font-size:13px;font-weight:600;">' +
    escapeHtml(value || '—') +
    '</td></tr>';

  const receivedAt = new Date(r.created_at).toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' });
  const whatsappHref = buildWhatsAppLink(r.phone);

  const rows = [
    row('Dossier', r.id),
    row('Nom du client', r.customer_name),
    row('Téléphone / WhatsApp', r.phone),
    row('Email', r.email || ''),
    row('Pays de résidence', r.country || ''),
    row('Véhicule', r.vehicle_name || ''),
    row('Agence', r.location_name || ''),
    row('Date de début', r.pickup_date),
    row('Date de fin', r.return_date),
    row('Demande particulière / message', r.message || ''),
    row('Date de réception', receivedAt),
  ].join('');

  return (
    '<!doctype html><html><head><meta charset="utf-8"></head>' +
    '<body style="margin:0;padding:0;">' +
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">' +
    '<div style="background:#15265A;padding:20px 24px;border-radius:12px 12px 0 0;">' +
    '<span style="color:#ffffff;font-size:16px;font-weight:bold;">Nouvelle demande de réservation</span>' +
    '</div>' +
    '<div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:16px 8px;">' +
    '<table style="width:100%;border-collapse:collapse;">' + rows + '</table>' +
    '<div style="padding:16px 12px 4px;">' +
    '<a href="' + whatsappHref + '" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:bold;font-size:13px;padding:10px 18px;border-radius:8px;">' +
    'Contacter le client sur WhatsApp' +
    '</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</body></html>'
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const host = Deno.env.get('SMTP_HOST');
  const portRaw = Deno.env.get('SMTP_PORT');
  const user = Deno.env.get('SMTP_USER');
  const pass = Deno.env.get('SMTP_PASS');
  const from = Deno.env.get('SMTP_FROM');

  if (!host || !portRaw || !user || !pass || !from) {
    console.error('SMTP secrets are not fully configured for send-reservation-email');
    return new Response(JSON.stringify({ error: 'Email provider not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const port = Number(portRaw);
  // Port 465 = implicit TLS from connection start. Port 587 (and most others)
  // = plaintext connection that upgrades via STARTTLS, which denomailer
  // negotiates automatically when `tls` is left false.
  const useImplicitTls = port === 465;

  let reservation: ReservationPayload;
  try {
    reservation = (await req.json()) as ReservationPayload;
  } catch (err) {
    console.error('SEND_RESERVATION_EMAIL_INVALID_BODY', err);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: useImplicitTls,
      auth: { username: user, password: pass },
    },
  });

  try {
    await client.send({
      from,
      to: [PRIMARY_RECIPIENT],
      cc: [COPY_RECIPIENT],
      subject: 'Nouvelle demande de réservation — SOUBAICAR',
      html: buildEmailHtml(reservation),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('SMTP_SEND_ERROR', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } finally {
    try {
      await client.close();
    } catch (closeErr) {
      console.error('SMTP_CLIENT_CLOSE_ERROR', closeErr);
    }
  }
});
