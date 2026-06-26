import webPush from 'web-push';
import db from './db.js';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:admin@kuentasklaras.cl';

if (publicKey && privateKey) {
  try {
    webPush.setVapidDetails(subject, publicKey, privateKey);
    console.log('[Push] VAPID configured');
  } catch (e) {
    console.error('[Push] Invalid VAPID keys:', e.message);
  }
}

export async function saveSubscription(userId, subscription) {
  const { endpoint, keys } = subscription;
  await db.run(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (endpoint) DO UPDATE SET
       p256dh = EXCLUDED.p256dh,
       auth = EXCLUDED.auth,
       updated_at = NOW()`,
    userId, endpoint, keys.p256dh, keys.auth
  );
}

export async function removeSubscription(endpoint) {
  await db.run('DELETE FROM push_subscriptions WHERE endpoint = $1', endpoint);
}

export async function removeSubscriptionByUserId(userId) {
  await db.run('DELETE FROM push_subscriptions WHERE user_id = $1', userId);
}

export async function sendPushToUser(userId, title, body, url = '/') {
  try {
    const subs = await db.all(
      'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1',
      userId
    );

    if (subs.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    for (const sub of subs) {
      const subscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };

      try {
        await webPush.sendNotification(subscription, payload);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await db.run('DELETE FROM push_subscriptions WHERE endpoint = $1', sub.endpoint);
        }
      }
    }
  } catch (err) {
    console.error('[Push] Error sending notification:', err.message);
  }
}
