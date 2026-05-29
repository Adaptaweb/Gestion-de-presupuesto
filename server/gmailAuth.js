import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'gmail-token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'gmail-credentials.json');

function getOAuth2Client() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

  if (!clientId || !clientSecret) {
    if (fs.existsSync(CREDENTIALS_PATH)) {
      const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      return new google.auth.OAuth2(creds.web?.client_id || creds.installed?.client_id, creds.web?.client_secret || creds.installed?.client_secret, creds.web?.redirect_uris?.[0] || creds.installed?.redirect_uris?.[0] || redirectUri);
    }
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function getStoredTokens() {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    }
  } catch (e) {}
  return null;
}

function storeTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

function getAuthUrl() {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) throw new Error('Credenciales Gmail no configuradas. Crea gmail-credentials.json o define GMAIL_CLIENT_ID y GMAIL_CLIENT_SECRET en .env');

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

async function exchangeCode(code) {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) throw new Error('Credenciales Gmail no configuradas');

  const { tokens } = await oAuth2Client.getToken(code);
  storeTokens(tokens);
  return tokens;
}

async function getAuthenticatedClient() {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) return null;

  const storedTokens = getStoredTokens();
  if (!storedTokens) return null;

  oAuth2Client.setCredentials(storedTokens);

  oAuth2Client.on('tokens', (newTokens) => {
    const current = getStoredTokens() || {};
    const updated = { ...current, ...newTokens };
    storeTokens(updated);
  });

  return oAuth2Client;
}

function hasValidTokens() {
  const tokens = getStoredTokens();
  if (!tokens?.refresh_token) return false;
  return true;
}

// CLI Auth flow — run directly: node server/gmailAuth.js
async function cliAuth() {
  const authUrl = getAuthUrl();
  console.log('\n=== AUTENTICACIÓN GMAIL ===');
  console.log('1. Abre esta URL en tu navegador:');
  console.log(authUrl);
  console.log('\n2. Inicia sesión con tu cuenta de Gmail.');
  console.log('3. Autoriza la aplicación.');
  console.log('4. Serás redirigido a una URL. Copia el código "code" de la URL.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise((resolve) => {
    rl.question('Pega el código de autorización aquí: ', (answer) => {
      resolve(answer.trim());
      rl.close();
    });
  });

  if (!code) {
    console.error('No se ingresó ningún código.');
    process.exit(1);
  }

  try {
    const tokens = await exchangeCode(code);
    console.log('\n✅ Autenticación exitosa. Token guardado en server/gmail-token.json');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error al intercambiar código:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cliAuth();
}

export { getAuthenticatedClient, getAuthUrl, exchangeCode, hasValidTokens, getStoredTokens, storeTokens, getOAuth2Client };
