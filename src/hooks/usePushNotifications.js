import { useState, useEffect, useCallback } from 'react';

const VAPID_PUBLIC_KEY = 'BBCs0z3Sl5Vvvqu1IVOIb9yy_Y95H7XC4XUtG8TZJ9f4Q0rRFnpqkQ4IoPY7JpmcIC9xJnIC-I4K3Giwtsvf_18';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications(token) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const updateSubscriptionStatus = useCallback(async () => {
    try {
      if (!isSupported) return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    } catch {
      setIsSubscribed(false);
    }
  }, [isSupported]);

  useEffect(() => {
    if (token && isSupported) {
      updateSubscriptionStatus();
    }
  }, [token, isSupported, updateSubscriptionStatus]);

  const subscribe = useCallback(async () => {
    if (!isSupported || !token) return false;
    setLoading(true);

    try {
      if (Notification.permission === 'denied') {
        setLoading(false);
        return false;
      }

      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result !== 'granted') {
          setLoading(false);
          return false;
        }
      }

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sub.toJSON()),
      });

      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch {
      setIsSubscribed(false);
      setLoading(false);
      return false;
    }
  }, [isSupported, token]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported || !token) return;
    setLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        await sub.unsubscribe();
      }

      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint: sub ? sub.endpoint : '' }),
      });

      setIsSubscribed(false);
    } catch {
      setIsSubscribed(false);
    }

    setLoading(false);
  }, [isSupported, token]);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
  };
}
