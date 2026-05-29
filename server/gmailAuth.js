import { google } from 'googleapis';
import db from './db.js';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function getOAuth2Client() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

  if (!clientId || !clientSecret) return null;

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

async function getStoredTokens(userId) {
  try {
    const row = await db.get('SELECT * FROM gmail_tokens WHERE user_id = $1', userId);
    if (!row) return null;
    return {
      access_token: row.access_token,
      refresh_token: row.refresh_token,
      scope: row.scope,
      token_type: row.token_type,
      expiry_date: row.expiry_date,
    };
  } catch {
    return null;
  }
}

async function storeTokens(userId, tokens) {
  await db.run(
    `INSERT INTO gmail_tokens (user_id, access_token, refresh_token, scope, token_type, expiry_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       access_token = EXCLUDED.access_token,
       refresh_token = COALESCE(EXCLUDED.refresh_token, gmail_tokens.refresh_token),
       scope = EXCLUDED.scope,
       token_type = EXCLUDED.token_type,
       expiry_date = EXCLUDED.expiry_date`,
    userId,
    tokens.access_token || null,
    tokens.refresh_token || null,
    tokens.scope || null,
    tokens.token_type || null,
    tokens.expiry_date || null,
  );
}

function getAuthUrl(userId) {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) throw new Error('Credenciales Gmail no configuradas');

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId,
  });
}

async function exchangeCode(code, userId) {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) throw new Error('Credenciales Gmail no configuradas');

  const { tokens } = await oAuth2Client.getToken(code);
  await storeTokens(userId, tokens);
  return tokens;
}

async function getAuthenticatedClient(userId) {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) return null;

  const storedTokens = await getStoredTokens(userId);
  if (!storedTokens) return null;

  oAuth2Client.setCredentials(storedTokens);

  oAuth2Client.on('tokens', async (newTokens) => {
    try {
      const current = await getStoredTokens(userId);
      const updated = { ...(current || {}), ...newTokens };
      await storeTokens(userId, updated);
    } catch (err) {
      console.error('[gmailAuth] Error al guardar tokens actualizados:', err.message);
    }
  });

  return oAuth2Client;
}

async function hasValidTokens(userId) {
  const tokens = await getStoredTokens(userId);
  return !!(tokens?.refresh_token);
}

export { getAuthenticatedClient, getAuthUrl, exchangeCode, hasValidTokens, getOAuth2Client };
