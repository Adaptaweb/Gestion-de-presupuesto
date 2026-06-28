import PostalMime from 'postal-mime';

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (res.status < 500) return res;
    if (i < retries - 1) {
      const delay = 2000 * (i + 1);
      console.error(`[EmailWorker] Retry ${i + 1}/${retries} after ${delay}ms (status ${res.status})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return fetch(url, options);
}

export default {
  async email(message, env, ctx) {
    try {
      const recipient = message.to.toLowerCase();
      const match = recipient.match(/^parse\+([^@]+)@adaptaweb\.cl$/);
      if (!match) return;

      const userId = match[1];
      const parsed = await PostalMime.parse(message.raw);
      const from = message.from;
      const subject = parsed.subject || '';
      const html = parsed.html || '';
      const text = parsed.text || '';
      const messageId = parsed.messageId || message.headers.get('message-id') || '';

      const res = await fetchWithRetry(`${env.VERCEL_URL}/api/webhook/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': env.WEBHOOK_SECRET,
        },
        body: JSON.stringify({
          userId,
          from,
          subject,
          html,
          text,
          messageId,
        }),
      });

      if (!res.ok) {
        console.error(`[EmailWorker] Webhook permanently failed: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      console.error('[EmailWorker] Error:', err.message, err.stack);
    }
  },
};
