import { useState, useEffect, useCallback } from 'react';

const VAPID_PUBLIC_KEY = 'BHLzyyYrvcSbxKDG6I6q8SbPeFdM3jAq5qq-wvgpCxDBUJheThqsbnwPPevQHygF0zvJvORUXh67p8jJtwFr9vc';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications(token) {
  const canNotify = 'Notification' in window;
  const hasSw = 'serviceWorker' in navigator;
  const [permission, setPermission] = useState(
    canNotify ? Notification.permission : 'denied'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSupported = canNotify && hasSw;

  useEffect(() => {
    if (token && isSupported) {
      (async () => {
        try {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.getSubscription();
          setIsSubscribed(!!sub);
        } catch {
          setIsSubscribed(false);
        }
      })();
    }
  }, [token, isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported || !token) return false;
    setLoading(true);

    try {
      if (Notification.permission === 'denied') {
        alert('Las notificaciones están bloqueadas para este sitio. Actívalas desde la configuración del navegador.');
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
      let sub;
      try {
        sub = await reg.pushManager.getSubscription();
      } catch {
        sub = null;
      }

      if (!sub) {
        if (!('PushManager' in window)) {
          alert('Las notificaciones push no están disponibles en este navegador. En iOS, agrega la app a la pantalla de inicio primero.');
          setLoading(false);
          return false;
        }
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
      let sub;
      try {
        sub = await reg.pushManager.getSubscription();
      } catch {
        sub = null;
      }

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
