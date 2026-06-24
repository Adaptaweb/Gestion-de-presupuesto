import { useState, useEffect, useCallback, useMemo } from 'react';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getBadgeStyle(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lum = getLuminance(r, g, b);
  const alpha = 0.15;
  const textColor = lum > 0.5 ? '#1e293b' : hex;
  return {
    backgroundColor: `rgba(${r},${g},${b},${alpha})`,
    color: textColor,
    borderColor: `rgba(${r},${g},${b},0.3)`,
  };
}

function getBarColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},0.7)`;
}

function getIconBg(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},0.15)`;
}

function getIconColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lum = getLuminance(r, g, b);
  return lum > 0.5 ? `rgba(${r},${g},${b},0.9)` : hex;
}

function getTextStyle(hex, isDark) {
  const { r, g, b } = hexToRgb(hex);
  const alpha = isDark ? 0.3 : 0.15;
  return {
    backgroundColor: isDark ? `rgba(${r},${g},${b},0.15)` : `rgba(${r},${g},${b},0.12)`,
    color: hex,
  };
}

export function useCategorias(token) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categorias', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) setCategorias(data.categorias || []);
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    if (token) fetchCategorias();
  }, [token, fetchCategorias]);

  const createCategoria = useCallback(async ({ nombre, color_hex, emoji, tipo }) => {
    const res = await fetch('/api/categorias', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nombre, color_hex, emoji, tipo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear');
    setCategorias(prev => [...prev, data.categoria]);
    return data.categoria;
  }, [getHeaders]);

  const updateCategoria = useCallback(async (id, updates) => {
    const res = await fetch(`/api/categorias/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al actualizar');
    setCategorias(prev => prev.map(c => c.id === id ? data.categoria : c));
    return data.categoria;
  }, [getHeaders]);

  const deleteCategoria = useCallback(async (id) => {
    const res = await fetch(`/api/categorias/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al eliminar');
    setCategorias(prev => prev.filter(c => c.id !== id));
    return data;
  }, [getHeaders]);

  const reorderCategorias = useCallback(async (orderedIds) => {
    await fetch('/api/categorias/reorder', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    await fetchCategorias();
  }, [getHeaders, fetchCategorias]);

  const reorderCategoriasLocal = useCallback((orderedIds) => {
    setCategorias(prev => {
      const orderMap = {};
      orderedIds.forEach((id, i) => { orderMap[id] = i; });
      return prev.map(c => ({
        ...c,
        orden: orderMap[c.id] !== undefined ? orderMap[c.id] : c.orden,
      }));
    });
  }, []);

  const gastosCats = useMemo(
    () => categorias.filter(c => c.tipo === 'gasto' || c.tipo === 'ambos'),
    [categorias]
  );
  const ingresosCats = useMemo(
    () => categorias.filter(c => c.tipo === 'ingreso' || c.tipo === 'ambos'),
    [categorias]
  );

  const getCatStyle = useCallback((hex) => getBadgeStyle(hex), []);
  const getCatBar = useCallback((hex) => getBarColor(hex), []);
  const getCatIconBg = useCallback((hex) => getIconBg(hex), []);
  const getCatIconColor = useCallback((hex) => getIconColor(hex), []);
  const getCatText = useCallback((hex, isDark) => getTextStyle(hex, isDark), []);

  return {
    categorias,
    gastosCats,
    ingresosCats,
    loading,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    reorderCategorias,
    reorderCategoriasLocal,
    getCatStyle,
    getCatBar,
    getCatIconBg,
    getCatIconColor,
    getCatText,
  };
}
