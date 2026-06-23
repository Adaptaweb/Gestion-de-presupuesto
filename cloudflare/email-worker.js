import PostalMime from 'postal-mime';

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

      const res = await fetch(`${env.VERCEL_URL}/api/webhook/email`, {
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
        console.error(`[EmailWorker] Webhook failed: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      console.error('[EmailWorker] Error:', err.message);
    }
  },
};
