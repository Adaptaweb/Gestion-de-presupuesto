// Tablero principal. Extraido de App.jsx para que la landing, el login y el
// panel de administracion dejen de arrastrarlo en el paquete inicial.

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import NavPill from './components/NavPill.jsx';
import BillingBanner from './components/BillingBanner.jsx';
import PlanesModal from './components/PlanesModal.jsx';
import ProfileSheet from './components/ProfileSheet.jsx';
import { Hoja, BotonesPie, Grupo, Seccion, Fila, FilaCampo, FilaInterruptor, Stepper, Pastilla, Segmentado, SelectorBanco, fondoDe, filtrarBancos } from './components/HojaFormulario.jsx';
import { fetchBilling } from './lib/billing.js';
import { notifyOk, notifyInfo } from './lib/notify.js';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  Ban,
  CalendarDays,
  CircleDollarSign,
  Clock,
  Hash,
  Hourglass,
  ShieldCheck,
  Tag,
  Tv,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Loader2,
  Mail,
  Moon,
  Pencil,
  PieChart,
  PiggyBank,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import Footer from './components/Footer';
import Transacciones from './Transacciones.jsx';
import ConfigModal from './components/ConfigModal.jsx';
import FilterRulesModal from './components/FilterRulesModal.jsx';
import { UserMenu } from './components/user-dropdown';
import CategoriasConfig from './components/CategoriasConfig.jsx';
import { useCategorias } from './hooks/useCategorias.js';
import { applyDarkMode, getInitialDarkMode } from './lib/theme.js';
import { notifySaving, notifySaved, notifySavedSinCambios, notifySaveError, notifySyncInfo, marcarGuardado } from './lib/notify.js';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';
import {
  BANCOS_CHILE,
  CHILE_CATEGORY_LABELS,
  CHILE_PRESET_ICONS,
  CLAVES_SINCRONIZADAS,
  CURRENT_YEAR,
  INITIAL_MONTHS,
  MONTH_NAMES,
  PRESET_ICONS,
  SUBSCRIPTION_ICONS,
  THEMES,
  THEME_COLOR_HEX,
  apiKey,
  getAhorroBankInfo,
} from './constants/dashboard.js';

// Una sola fuente para la navegacion: las tabs de escritorio y la barra
// flotante movil se generaban por separado y ya habian divergido.
const NAV_ITEMS = [
  { id: 'transacciones', icon: Mail, label: 'Transacciones', short: 'Transacciones' },
  { id: 'general', icon: ListChecks, label: 'Suscripciones y Cuotas', short: 'Cuotas' },
  { id: 'ahorros', icon: PiggyBank, label: 'Gestión de Ahorros', short: 'Ahorros' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Resumen', short: 'Resumen' },
];

// Selector de mes compartido entre Resumen, Suscripciones y Cuotas y Ahorros: antes
// cada tab tenia su propio <select> de ano ademas de este nav; ahora el ano
// se elige desde el mismo desplegable, igual que el selector de mes de
// Transacciones (flechas de mes + panel con flechas de ano y grilla de meses).
const MonthNav = ({ value, months, years, onChange }) => {
  const idx = months.indexOf(value);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => (value ? value.split(' ')[1] : years[years.length - 1]));
  const yearIdx = years.indexOf(pickerYear);

  const openPicker = () => {
    setPickerYear(value ? value.split(' ')[1] : years[years.length - 1]);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-2 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-2xl px-2 py-2">
        <button
          type="button"
          onClick={() => idx > 0 && onChange(months[idx - 1])}
          disabled={idx <= 0}
          aria-label="Mes anterior"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
          className="flex-1 text-center font-black text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-lighter rounded-xl px-2 py-1.5 transition"
        >
          {value || '—'}
        </button>
        <button
          type="button"
          onClick={() => idx >= 0 && idx < months.length - 1 && onChange(months[idx + 1])}
          disabled={idx < 0 || idx >= months.length - 1}
          aria-label="Mes siguiente"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-2xl shadow-2xl p-3 min-w-[220px]">
            <div className="flex items-center justify-between mb-2 px-1">
              <button
                type="button"
                onClick={() => yearIdx > 0 && setPickerYear(years[yearIdx - 1])}
                disabled={yearIdx <= 0}
                aria-label="Año anterior"
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{pickerYear}</span>
              <button
                type="button"
                onClick={() => yearIdx >= 0 && yearIdx < years.length - 1 && setPickerYear(years[yearIdx + 1])}
                disabled={yearIdx < 0 || yearIdx >= years.length - 1}
                aria-label="Año siguiente"
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {MONTH_NAMES.map(name => {
                const monthStr = `${name} ${pickerYear}`;
                const isCurrent = monthStr === value;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { onChange(monthStr); setIsOpen(false); }}
                    className={`px-2 py-2 rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'hover:bg-slate-100 dark:hover:bg-dark-lighter text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {name.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard = ({ user, token, onLogout, onOpenAdmin, onOpenTutorial, isPushSubscribed, isPushLoading, onToggleNotifications, isInstallable, onInstall, onDashboardReady }) => {
  const [activeTab, setActiveTab] = useState('transacciones');
  // Las pestañas entran desde el lado al que apunta el cambio (siguiente o anterior).
  const prevTabIdx = useRef(0);
  const tabDirRef = useRef('next');
  {
    const idx = NAV_ITEMS.findIndex(n => n.id === activeTab);
    if (idx !== prevTabIdx.current) {
      tabDirRef.current = idx > prevTabIdx.current ? 'next' : 'prev';
      prevTabIdx.current = idx;
    }
  }
  const tabAnim = tabDirRef.current === 'next' ? 'animate-tab-next tab-stagger' : 'animate-tab-prev tab-stagger';
  // Acciones que dispara la navegacion global pero ejecuta Transacciones, que
  // es donde vive el estado. El contador evita que dos peticiones iguales
  // seguidas se pierdan por comparacion de referencia.
  const [txAction, setTxAction] = useState(null);
  const txActionSeq = useRef(0);
  const requestTxAction = useCallback((type) => {
    setActiveTab('transacciones');
    txActionSeq.current += 1;
    setTxAction({ type, seq: txActionSeq.current });
  }, []);
  const openManualEntry = useCallback(() => requestTxAction('manual'), [requestTxAction]);
  const [isFabDialOpen, setIsFabDialOpen] = useState(false);
  useEffect(() => { setIsFabDialOpen(false); }, [activeTab]);
  const [dashboardMonth, setDashboardMonth] = useState('');
  const [resumenGastosMes, setResumenGastosMes] = useState({ total_gastos: 0, total_ingresos: 0, summary: [] });
  const [loadingResumenGastos, setLoadingResumenGastos] = useState(false);
  const [expandedGeneralItems, setExpandedGeneralItems] = useState({});
  const [expandedAhorroCuentas, setExpandedAhorroCuentas] = useState({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);

  const [months, setMonths] = useState(INITIAL_MONTHS);
  const [deudas, setDeudas] = useState([]);
  const [gastosFijos, setGastosFijos] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [sueldos, setSueldos] = useState({});
  // El presupuesto del mes (guardado como `sueldos[mes]`) vivia solo dentro de
  // la card de Suscripciones y Cuotas, asi que no se veia ni se editaba desde
  // el resto de las pestanas. Ahora es un chip del header, visible siempre.
  const [showPresupuestoModal, setShowPresupuestoModal] = useState(false);
  const [presupuestoDraft, setPresupuestoDraft] = useState('');
  const [cuentasAhorro, setCuentasAhorro] = useState([]);
  const [ahorrosData, setAhorrosData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [showCategoriasConfig, setShowCategoriasConfig] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showFilterRulesModal, setShowFilterRulesModal] = useState(false);

  const {
    categorias, gastosCats, ingresosCats,
    createCategoria, updateCategoria, deleteCategoria,
    reorderCategorias, reorderCategoriasLocal,
    getCatStyle, getCatBar, getCatIconBg, getCatIconColor, getCatText,
  } = useCategorias(token);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '', itemName: '', itemType: '', message: '', onConfirm: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'kk');
  const theme = THEMES[themeColor];

  const confirmDelete = (options) => {
    return new Promise((resolve) => {
      setDeleteModal({
        isOpen: true,
        title: options.title || '¿Eliminar elemento?',
        itemName: options.itemName || '',
        itemType: options.itemType || 'elemento',
        message: options.message || '',
        onConfirm: () => {
          setIsDeleting(true);
          Promise.resolve(options.onConfirm?.()).finally(() => {
            setIsDeleting(false);
            setDeleteModal(prev => ({ ...prev, isOpen: false }));
            resolve(true);
          });
        }
      });
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    return false;
  };

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    applyDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Version que el servidor tenia cuando cargamos. Se envia en cada guardado
  // para detectar que otra pestana o dispositivo escribio entre medias.
  const syncVersionRef = useRef(undefined);

  // Ultimo estado confirmado por el servidor, serializado por clave. Sirve para
  // enviar solo lo que cambio en vez de todo el conjunto de datos.
  const ultimoGuardadoRef = useRef({});

  const aplicarDatos = useCallback((data) => {
    if (data.months && data.months.length > 0) setMonths(expandToFullYearMonths(data.months));
    if (data.deudas && data.deudas.length > 0) setDeudas(data.deudas);
    if (data.gastosFijos && data.gastosFijos.length > 0) setGastosFijos(data.gastosFijos);
    if (data.abonos && data.abonos.length > 0) setAbonos(data.abonos);
    if (data.sueldos && Object.keys(data.sueldos).length > 0) setSueldos(data.sueldos);
    setCuentasAhorro(data.cuentasAhorro || []);
    if (data.ahorrosData && Object.keys(data.ahorrosData).length > 0) setAhorrosData(data.ahorrosData);
    if (data.suscripciones && data.suscripciones.length > 0) setSuscripciones(data.suscripciones);

    syncVersionRef.current = data.syncVersion;
    ultimoGuardadoRef.current = {};
    for (const clave of CLAVES_SINCRONIZADAS) {
      ultimoGuardadoRef.current[clave] = JSON.stringify(data[clave] ?? null);
    }
  }, []);

  useEffect(() => {
    fetch('/api/data', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        aplicarDatos(data);
        setLoadingData(false);
        onDashboardReady?.();
      })
      .catch(err => {
        console.error('Error loading DB', err);
        setLoadingData(false);
        onDashboardReady?.();
      });
  }, []);

  const toDateVal = (s) => {
    if (!s) return 0;
    const parts = s.split(' ');
    if (parts.length < 2) return 0;
    const [n, y] = parts;
    return parseInt(y) * 12 + MONTH_NAMES.indexOf(n);
  };

  const fromDateVal = (val) => {
    const year = Math.floor(val / 12);
    const monthIndex = val % 12;
    return `${MONTH_NAMES[monthIndex]} ${year}`;
  };

  // Cancelar una suscripcion la deja cancelada de ese mes en adelante, tambien
  // los meses posteriores, hasta que se reactive. Reactivar la reanuda desde el
  // mes elegido: los meses cancelados de antes siguen cancelados y los pagos
  // anteriores no se tocan. Cada periodo es { desde, hasta }; hasta vacio = abierto.
  const subPeriodos = (sub) => {
    if (Array.isArray(sub.cancelaciones) && sub.cancelaciones.length) return sub.cancelaciones;
    return sub.canceladaDesde ? [{ desde: sub.canceladaDesde, hasta: null }] : []; // formato anterior
  };
  const subPeriodoEn = (sub, mes) => {
    const v = toDateVal(mes);
    return subPeriodos(sub).find(p => v >= toDateVal(p.desde) && (!p.hasta || v < toDateVal(p.hasta)));
  };
  const subCanceladaEn = (sub, mes) => !!subPeriodoEn(sub, mes);
  const subEnRangoDesde = (sub, inicio, v) => (sub.billingCycle === 'mensual'
    ? v >= inicio && v < inicio + sub.durationYears * 12
    : Array.from({ length: sub.durationYears }, (_, i) => inicio + i * 12).includes(v));
  // El mes pertenece a la vida de la suscripcion (original o reanudada); una
  // cancelacion abierta sigue visible como cancelada en todos los meses siguientes.
  const subEnRango = (sub, mes) => {
    const v = toDateVal(mes);
    const periodos = subPeriodos(sub);
    const inicios = [toDateVal(sub.mesInicio), ...periodos.filter(p => p.hasta).map(p => toDateVal(p.hasta))];
    return inicios.some(i => subEnRangoDesde(sub, i, v)) || periodos.some(p => !p.hasta && v >= toDateVal(p.desde));
  };
  const subActivaEnMes = (sub, mes) => subEnRango(sub, mes) && !subCanceladaEn(sub, mes);

  const availableYears = useMemo(() => {
    const years = months.map(m => m.split(' ')[1]);
    return [...new Set(years)].sort((a, b) => parseInt(a) - parseInt(b));
  }, [months]);

  const [selectedYear, setSelectedYear] = useState(() => {
    const currentYear = new Date().getFullYear().toString();
    return availableYears.includes(currentYear) ? currentYear : availableYears[0] || '2026';
  });

  const filteredMonths = useMemo(() => {
    return months.filter(m => m.endsWith(selectedYear)).sort((a, b) => toDateVal(a) - toDateVal(b));
  }, [months, selectedYear]);

  // Todos los meses ordenados cronologicamente, cruzando años: alimenta las
  // flechas de MonthNav para que puedan avanzar de Diciembre a Enero sin
  // pasar por el selector de año (que ya no existe como control aparte).
  const sortedMonths = useMemo(() => {
    return [...months].sort((a, b) => toDateVal(a) - toDateVal(b));
  }, [months]);

  // selectedYear ya no lo controla un <select>: sigue al año de dashboardMonth,
  // sea cual sea el origen del cambio (flechas de mes o el panel de MonthNav).
  useEffect(() => {
    if (!dashboardMonth) return;
    const year = dashboardMonth.split(' ')[1];
    if (year && year !== selectedYear) setSelectedYear(year);
  }, [dashboardMonth]);

  useEffect(() => {
    if (filteredMonths.length > 0 && !dashboardMonth) {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthName = MONTH_NAMES[currentMonth.getMonth()];
      const currentYearStr = currentMonth.getFullYear().toString();
      const currentMonthStr = `${currentMonthName} ${currentYearStr}`;
      if (filteredMonths.includes(currentMonthStr)) {
        setDashboardMonth(currentMonthStr);
      } else {
        setDashboardMonth(filteredMonths[0]);
      }
    }
  }, [filteredMonths]);

  const [isAddingDebt, setIsAddingDebt] = useState(false);
  // Transaccion pendiente que se esta convirtiendo en cuota. Solo pasa a
  // 'en_cuotas' al guardar la cuota; si se cierra el modal sigue pendiente.
  const [cuotaDesdeTx, setCuotaDesdeTx] = useState(null);
  const [txRefreshToken, setTxRefreshToken] = useState(0);
  // Igual que cuotaDesdeTx, pero para la suscripcion creada desde un pendiente.
  const [subDesdeTx, setSubDesdeTx] = useState(null);
  // Prueba gratuita y plan: el estado lo calcula el servidor.
  const [billing, setBilling] = useState(null);
  const [showPlanes, setShowPlanes] = useState(false);
  // Hoja de perfil del movil: el menu de usuario vive en la barra de navegacion.
  const [perfilOpen, setPerfilOpen] = useState(false);
  // Nombre corto para la barra: primer nombre, con tope de 7 letras.
  const primerNombre = (user.name || 'Perfil').trim().split(/\s+/)[0];
  const nombreCorto = primerNombre.length > 8 ? `${primerNombre.slice(0, 7)}…` : primerNombre;
  const cargarBilling = useCallback(() => {
    if (!token) return Promise.resolve();
    return fetchBilling(token).then(setBilling).catch(() => {});
  }, [token]);
  useEffect(() => { cargarBilling(); }, [cargarBilling]);
  useEffect(() => {
    // Vuelta del checkout (?pago=ok) o enlace de un correo (?planes=1). El
    // webhook puede tardar unos segundos: se consulta varias veces.
    const params = new URLSearchParams(window.location.search);
    if (!params.has('pago') && !params.has('planes')) return undefined;
    const pago = params.get('pago');
    const planes = params.has('planes');
    window.history.replaceState({}, '', window.location.pathname);
    if (planes) setShowPlanes(true);
    if (!pago) return undefined;
    window.sessionStorage.setItem('kk-pago-pendiente', '1');
    notifyInfo('Confirmando tu pago…', 'Puede tardar unos segundos.');
    let n = 0;
    const id = setInterval(async () => {
      n += 1;
      await cargarBilling();
      if (n >= 6) clearInterval(id);
    }, 4000);
    return () => clearInterval(id);
  }, [cargarBilling]);
  useEffect(() => {
    let ultimo = 0;
    const alSoloLectura = () => {
      if (Date.now() - ultimo < 60000) return;
      ultimo = Date.now();
      cargarBilling();
      setShowPlanes(true);
    };
    window.addEventListener('kk:solo-lectura', alSoloLectura);
    return () => window.removeEventListener('kk:solo-lectura', alSoloLectura);
  }, [cargarBilling]);
  useEffect(() => {
    if (billing?.estado === 'activa' && window.sessionStorage.getItem('kk-pago-pendiente')) {
      window.sessionStorage.removeItem('kk-pago-pendiente');
      notifyOk('Plan activo', 'Gracias por suscribirte.');
    }
  }, [billing?.estado]);
  const [isAddingFixed, setIsAddingFixed] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [bancoSearch, setBancoSearch] = useState('');
  const [fixedBancoSearch, setFixedBancoSearch] = useState('');
  const [subBancoSearch, setSubBancoSearch] = useState('');

  const [newDebt, setNewDebt] = useState({
    descripcion: '',
    cuotasTotales: 12,
    valorCuota: 0,
    mesInicio: INITIAL_MONTHS[0],
    isContribuciones: false,
    diaPago: 1,
    facturacionAuto: false,
    banco: '',
    bancoLogo: '',
    tipoTarjeta: '',
    iconType: 'default',
    iconValue: 'layout',
    iconUrl: ''
  });

  const [newFixed, setNewFixed] = useState({
    descripcion: '',
    diaPago: 1,
    facturacionAuto: false,
    banco: '',
    bancoLogo: '',
    tipoTarjeta: '',
    iconType: 'preset',
    iconValue: 'layout',
    iconUrl: ''
  });

  const [newAccount, setNewAccount] = useState({ nombre: '', banco: '' });
  const [accountBancoSearch, setAccountBancoSearch] = useState('');
  const [debtIconSearch, setDebtIconSearch] = useState('');
  const [fixedIconSearch, setFixedIconSearch] = useState('');
  const [debtChileCat, setDebtChileCat] = useState('bancos');
  const [fixedChileCat, setFixedChileCat] = useState('agua');
  const [subChileCat, setSubChileCat] = useState('medios-pago');
  const [suscripciones, setSuscripciones] = useState([]);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSub, setNewSub] = useState({
    descripcion: '',
    valor: 0,
    billingCycle: 'mensual',
    diaPago: 1,
    mesInicio: INITIAL_MONTHS[0],
    durationYears: 1,
    facturacionAuto: false,
    banco: '',
    bancoLogo: '',
    tipoTarjeta: '',
    iconType: 'preset',
    iconValue: 'layout',
    iconUrl: ''
  });
  const [subscriptionIconSearch, setSubscriptionIconSearch] = useState('');
  const [isAddingAbono, setIsAddingAbono] = useState(false);
  const [newAbono, setNewAbono] = useState({
    descripcion: '',
    diaPago: 1,
    facturacionAuto: false,
    iconType: 'preset',
    iconValue: 'layout',
    iconUrl: ''
  });
  const [abonoIconSearch, setAbonoIconSearch] = useState('');
  const [abonoChileCat, setAbonoChileCat] = useState('agua');
  const [abonoBancoSearch, setAbonoBancoSearch] = useState('');
  const [dashSections, setDashSections] = useState({ cuotas: true, subs: true, fijos: true, abonos: true });
  const toggleDashSection = (key) => setDashSections(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredDebtIcons = useMemo(() => {
    if (!debtIconSearch.trim()) return PRESET_ICONS;
    const q = debtIconSearch.toLowerCase().trim();
    return PRESET_ICONS.filter(i => i.label.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q));
  }, [debtIconSearch]);

  const filteredFixedIcons = useMemo(() => {
    if (!fixedIconSearch.trim()) return PRESET_ICONS;
    const q = fixedIconSearch.toLowerCase().trim();
    return PRESET_ICONS.filter(i => i.label.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q));
  }, [fixedIconSearch]);

  const filteredSubscriptionIcons = useMemo(() => {
    if (!subscriptionIconSearch.trim()) return SUBSCRIPTION_ICONS;
    const q = subscriptionIconSearch.toLowerCase().trim();
    return SUBSCRIPTION_ICONS.filter(i => i.label.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q));
  }, [subscriptionIconSearch]);

  const filteredAbonoIcons = useMemo(() => {
    if (!abonoIconSearch.trim()) return PRESET_ICONS;
    const q = abonoIconSearch.toLowerCase().trim();
    return PRESET_ICONS.filter(i => i.label.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q));
  }, [abonoIconSearch]);


  useEffect(() => {
    const today = new Date();
    const diaActual = today.getDate();
    const mesActual = `${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;

    let deudasCambiadas = false;
    const deudasActualizadas = deudas.map(debt => {
      if (!debt.facturacionAuto) return debt;
      if (debt.diaPago <= diaActual && !debt.pagos?.[mesActual]) {
        deudasCambiadas = true;
        return { ...debt, pagos: { ...debt.pagos, [mesActual]: { estado: 'PAGADA' } } };
      }
      return debt;
    });

    let gastosCambiados = false;
    const gastosActualizados = gastosFijos.map(gasto => {
      if (!gasto.facturacionAuto) return gasto;
      if (gasto.diaPago <= diaActual && !gasto.pagos?.[mesActual]) {
        gastosCambiados = true;
        return { ...gasto, pagos: { ...gasto.pagos, [mesActual]: { estado: 'PAGADA' } } };
      }
      return gasto;
    });

    let abonosCambiados = false;
    const abonosActualizados = abonos.map(abono => {
      if (!abono.facturacionAuto) return abono;
      if (abono.diaPago <= diaActual && !abono.pagos?.[mesActual]) {
        abonosCambiados = true;
        return { ...abono, pagos: { ...abono.pagos, [mesActual]: { estado: 'PAGADA' } } };
      }
      return abono;
    });

    if (deudasCambiadas) setDeudas(deudasActualizadas);
    if (gastosCambiados) setGastosFijos(gastosActualizados);
    if (abonosCambiados) setAbonos(abonosActualizados);
  }, []);

  const isInitialSync = useRef(true);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    if (loadingData) { isInitialSync.current = true; return; }
    if (isInitialSync.current) {
      isInitialSync.current = false;
      return;
    }

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      const estado = { deudas, months, gastosFijos, abonos, sueldos, cuentasAhorro, ahorrosData, suscripciones };

      // Solo viaja lo que cambio desde el ultimo guardado confirmado. Antes se
      // reenviaba el conjunto completo en cada pulsacion.
      const cambios = {};
      const serializado = {};
      for (const clave of CLAVES_SINCRONIZADAS) {
        const json = JSON.stringify(estado[clave] ?? null);
        serializado[clave] = json;
        if (json !== ultimoGuardadoRef.current[clave]) cambios[clave] = estado[clave];
      }

      if (Object.keys(cambios).length === 0) { notifySavedSinCambios(); return; }
      notifySaving();
      fetch('/api/sync', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...cambios, syncVersion: syncVersionRef.current }),
      })
        .then(async res => {
          const data = await res.json().catch(() => ({}));

          // 409: otro dispositivo guardo primero. Se recarga desde el servidor
          // en vez de sobrescribir sus cambios.
          if (res.status === 409) {
            notifySyncInfo('Actualizado desde otra sesión', 'Se recargaron tus datos para no sobrescribir el otro dispositivo.');
            const recarga = await fetch('/api/data', { headers: getHeaders() }).then(r => r.json());
            aplicarDatos(recarga);
            return;
          }

          if (!res.ok || data.error) {
            console.error('[SYNC] Error del servidor:', data.error || res.status);
            notifySaveError(data.error || `El servidor respondió ${res.status}`);
            return;
          }

          syncVersionRef.current = data.syncVersion;
          Object.assign(ultimoGuardadoRef.current, serializado);
          notifySaved();
        })
        .catch(err => {
          console.error('[SYNC] Error de red:', err);
          notifySaveError('Revisa tu conexión.');
        });
    }, 1000);

    return () => { if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current); };
  }, [deudas, months, gastosFijos, abonos, sueldos, cuentasAhorro, ahorrosData, suscripciones]);

  const expandToFullYearMonths = (monthArr) => {
    // El ano en curso se agrega siempre, aunque los datos guardados no lo
    // tengan: sin el, el mes actual no existiria y el presupuesto del mes se
    // guardaria contra otro mes.
    const years = [...new Set([...monthArr.map(m => m.split(' ')[1]), CURRENT_YEAR])];
    const expanded = [];
    years.forEach(y => {
      for (let i = 0; i < 12; i++) expanded.push(`${MONTH_NAMES[i]} ${y}`);
    });
    return [...new Set(expanded)].sort((a, b) => toDateVal(a) - toDateVal(b));
  };

  const calculateEndDate = (startMonth, duration, isContribuciones = false) => {
    if (isContribuciones) {
      const [_, year] = startMonth.split(' ');
      return `Noviembre ${year}`;
    }
    let currentVal = toDateVal(startMonth);
    return fromDateVal(currentVal + (parseInt(duration) - 1));
  };

  const isMonthInRange = (month, start, end, isContribuciones = false) => {
    const mVal = toDateVal(month);
    const sVal = toDateVal(start);
    const eVal = toDateVal(end);

    if (isContribuciones) {
      const [name] = month.split(' ');
      const validMonths = ['Abril', 'Junio', 'Septiembre', 'Noviembre'];
      return validMonths.includes(name) && mVal >= sVal && mVal <= eVal;
    }
    return mVal >= sVal && mVal <= eVal;
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

  const monthInputToMonthStr = (val) => {
    if (!val) return '';
    const [y, m] = val.split('-');
    return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
  };

  const monthStrToMonthInput = (str) => {
    if (!str) return '';
    const [n, y] = str.split(' ');
    const mIndex = MONTH_NAMES.indexOf(n) + 1;
    return `${y}-${mIndex.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!dashboardMonth) return;
    const mesParam = monthStrToMonthInput(dashboardMonth);
    let cancelled = false;
    setLoadingResumenGastos(true);
    fetch(`/api/transacciones?mes=${mesParam}`, { headers: getHeaders() })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setResumenGastosMes({
          total_gastos: data.total_gastos || 0,
          total_ingresos: data.total_ingresos || 0,
          summary: (data.summary || []).filter(s => s.tipo !== 'ingreso')
        });
      })
      .catch(() => { if (!cancelled) setResumenGastosMes({ total_gastos: 0, total_ingresos: 0, summary: [] }); })
      .finally(() => { if (!cancelled) setLoadingResumenGastos(false); });
    return () => { cancelled = true; };
  }, [dashboardMonth, token]);

  const ensureMonthsRange = (startMonth, endMonth) => {
    const startVal = toDateVal(startMonth);
    const endVal = endMonth ? toDateVal(endMonth) : startVal;

    if (!months || months.length === 0) {
      const generated = [];
      for (let i = startVal; i <= endVal; i++) {
        generated.push(fromDateVal(i));
      }
      setMonths(generated);
      return;
    }

    const sortedMonths = [...months].sort((a, b) => toDateVal(a) - toDateVal(b));
    const currentMin = toDateVal(sortedMonths[0]);
    const currentMax = toDateVal(sortedMonths[sortedMonths.length - 1]);

    const newMin = Math.min(startVal, currentMin);
    const newMax = Math.max(endVal, currentMax);

    if (newMin < currentMin || newMax > currentMax) {
      const generated = [];
      for (let i = newMin; i <= newMax; i++) {
        generated.push(fromDateVal(i));
      }
      setMonths(generated);
    }
  };

  const balancesPorCuenta = useMemo(() => {
    const sortedAllMonths = [...months].sort((a, b) => toDateVal(a) - toDateVal(b));
    const res = {};

    cuentasAhorro.forEach(cuenta => {
      res[cuenta.id] = {};
      let acumulado = 0;
      sortedAllMonths.forEach(mes => {
        const deposito = ahorrosData[cuenta.id]?.[mes]?.deposito || 0;
        const gasto = ahorrosData[cuenta.id]?.[mes]?.gasto || 0;
        acumulado = acumulado + deposito - gasto;
        res[cuenta.id][mes] = { deposito, gasto, acumulado };
      });
    });
    return res;
  }, [cuentasAhorro, ahorrosData, months]);

  const totalAhorroMensual = useMemo(() => {
    const res = {};
    filteredMonths.forEach(mes => {
      let total = 0;
      cuentasAhorro.forEach(c => {
        total += balancesPorCuenta[c.id]?.[mes]?.acumulado || 0;
      });
      res[mes] = total;
    });
    return res;
  }, [cuentasAhorro, balancesPorCuenta, filteredMonths]);

  const itemsUnificados = useMemo(() => {
    const deudasProcesadas = deudas.map(d => ({
      ...d,
      tipo: 'cuota',
      mesTermino: calculateEndDate(d.mesInicio, d.cuotasTotales, d.isContribuciones)
    })).filter(d => filteredMonths.some(mes => isMonthInRange(mes, d.mesInicio, d.mesTermino, d.isContribuciones)));

    const gastosProcesados = gastosFijos.map(g => ({
      ...g,
      tipo: 'fijo'
    }));

    const getSubActiveMonths = (sub) => {
      const valores = new Set();
      const periodos = subPeriodos(sub);
      const inicios = [toDateVal(sub.mesInicio), ...periodos.filter(p => p.hasta).map(p => toDateVal(p.hasta))];
      for (const inicio of inicios) {
        if (sub.billingCycle === 'mensual') {
          for (let i = 0; i < sub.durationYears * 12; i++) valores.add(inicio + i);
        } else {
          for (let i = 0; i < sub.durationYears; i++) valores.add(inicio + i * 12);
        }
      }
      // Cancelacion abierta: se muestra cancelada en todos los meses siguientes.
      for (const p of periodos.filter(x => !x.hasta)) {
        const desde = toDateVal(p.desde);
        months.forEach(m => { const v = toDateVal(m); if (v >= desde) valores.add(v); });
      }
      return [...valores].sort((a, b) => a - b).map(fromDateVal);
    };

    const subsProcesadas = suscripciones.map(s => {
      const activeMonths = getSubActiveMonths(s);
      return {
        ...s,
        tipo: 'suscripcion',
        activeMonths,
        mesTermino: activeMonths[activeMonths.length - 1] || s.mesInicio
      };
    }).filter(s => filteredMonths.some(mes => s.activeMonths.includes(mes)));

    const abonosProcesados = abonos.map(a => ({
      ...a,
      tipo: 'abono'
    }));

    return [...deudasProcesadas, ...gastosProcesados, ...subsProcesadas, ...abonosProcesados];
  }, [deudas, gastosFijos, suscripciones, abonos, filteredMonths, months]);

  const totalesMensuales = useMemo(() => {
    const res = {};
    months.forEach(mes => {
      const totalCuotas = deudas.reduce((acc, d) => {
        const mesTermino = calculateEndDate(d.mesInicio, d.isContribuciones ? 4 : d.cuotasTotales, d.isContribuciones);
        return isMonthInRange(mes, d.mesInicio, mesTermino, d.isContribuciones) && d.pagos?.[mes]?.estado === 'PAGADA' ? acc + d.valorCuota : acc;
      }, 0);

      const totalGastos = gastosFijos.reduce((acc, g) => {
        const pago = g.pagos?.[mes];
        return (pago?.estado === 'PAGADA') ? acc + (pago.monto || 0) : acc;
      }, 0);

      const totalSubs = suscripciones.reduce((acc, s) => (
        subActivaEnMes(s, mes) && s.pagos?.[mes]?.estado === 'PAGADA' ? acc + (s.pagos[mes].monto || s.valor || 0) : acc
      ), 0);

      const totalAbonos = abonos.reduce((acc, a) => {
        const pago = a.pagos?.[mes];
        return (pago?.estado === 'PAGADA') ? acc + (pago.monto || 0) : acc;
      }, 0);

      const sueldo = sueldos[mes] || 0;
      res[mes] = { cuotas: totalCuotas, gastos: totalGastos, suscripciones: totalSubs, abonos: totalAbonos, sueldo, neto: sueldo + totalAbonos - totalCuotas - totalGastos - totalSubs };
    });
    return res;
  }, [deudas, gastosFijos, abonos, suscripciones, sueldos, months]);

  const callGemini = async (prompt, systemPrompt = "Eres un analista financiero experto. Proporciona respuestas concisas, profesionales y accionables en español.") => {
    setIsAiLoading(true);
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Gemini API Error:', response.status, errorData);
          throw new Error(`API Error: ${response.status} ${errorData.error?.message || ''}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          console.error('No text in response:', result);
          throw new Error('No response text');
        }
        setIsAiLoading(false);
        return text;
      } catch (error) {
        console.error('Gemini call error:', error);
        retries++;
        await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
      }
    }
    setIsAiLoading(false);
    return "Lo siento, no pude conectar con mi cerebro financiero en este momento. Revisa la consola (F12) para ver el error detallado.";
  };

  const generateFinancialAdvice = async () => {
    const dataSummary = {
      sueldoPromedio: Object.values(sueldos).length > 0 ? Object.values(sueldos).reduce((a, b) => a + b, 0) / Object.values(sueldos).length : 0,
      totalDeudas: deudas.length,
      compromisoMensualCuotas: deudas.reduce((acc, d) => acc + d.valorCuota, 0),
      gastosFijosCount: gastosFijos.length,
      ahorroTotal: Object.values(totalAhorroMensual).reduce((a, b) => Math.max(a, b), 0)
    };

    const prompt = `Analiza mi situación financiera actual:
    - Presupuesto promedio: ${formatCurrency(dataSummary.sueldoPromedio)}
    - Número de deudas en cuotas: ${dataSummary.totalDeudas}
    - Pago mensual total en deudas: ${formatCurrency(dataSummary.compromisoMensualCuotas)}
    - Número de gastos fijos: ${dataSummary.gastosFijosCount}
    - Mi ahorro actual total acumulado: ${formatCurrency(dataSummary.ahorroTotal)}

    Por favor, dame 3 consejos clave para mejorar mi situación este año y una breve evaluación de mi salud financiera.`;

    const advice = await callGemini(prompt);
    setAiAdvice(advice);
  };

  const getSavingsPlan = async () => {
    const currentMonth = filteredMonths[0];
    const available = totalesMensuales[currentMonth]?.neto || 0;

    const prompt = `Mi disponibilidad neta este mes (${currentMonth}) es de ${formatCurrency(available)}. 
    Sugiere un plan de distribución porcentual para este excedente entre: Fondo de Emergencia, Inversiones y Gustos Personales. Explica brevemente por qué sugieres esta división.`;

    const advice = await callGemini(prompt);
    setAiAdvice(advice);
  };

  const handleSaveDebt = (e) => {
    e.preventDefault();
    if (modalSaliendo) return;
    console.log('[DEBUG] Guardando deuda:', newDebt);
    const endMonth = calculateEndDate(newDebt.mesInicio, newDebt.cuotasTotales, newDebt.isContribuciones);
    ensureMonthsRange(newDebt.mesInicio, endMonth);
    if (editingItem) {
      setDeudas(deudas.map(d => d.id === editingItem.id ? { ...newDebt, id: d.id, pagos: d.pagos } : d));
    } else {
      setDeudas([...deudas, { ...newDebt, id: `debt-${Date.now()}`, pagos: {} }]);
    }
    marcarGuardado(editingItem ? 'Cuota actualizada' : 'Cuota creada', newDebt.descripcion);
    if (cuotaDesdeTx && !editingItem) marcarTxOrigen(cuotaDesdeTx.id, 'en_cuotas');
    salirDeModal('deuda', true, () => {
      setCuotaDesdeTx(null);
      setIsAddingDebt(false);
      setEditingItem(null);
      setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'default', iconValue: 'layout', iconUrl: '' });
      setDebtIconSearch('');
      setBancoSearch('');
    });
  };

  const handleSaveFixed = (e) => {
    e.preventDefault();
    if (modalSaliendo) return;
    console.log('[DEBUG] Guardando gasto fijo:', newFixed);
    if (editingItem) {
      setGastosFijos(gastosFijos.map(g => g.id === editingItem.id ? { ...newFixed, id: g.id, pagos: g.pagos } : g));
    } else {
      setGastosFijos([...gastosFijos, { ...newFixed, id: `fixed-${Date.now()}`, pagos: {} }]);
    }
    marcarGuardado(editingItem ? 'Gasto fijo actualizado' : 'Gasto fijo creado', newFixed.descripcion);
    salirDeModal('fijo', true, () => {
      setIsAddingFixed(false);
      setEditingItem(null);
      setNewFixed({ descripcion: '', diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' });
      setFixedIconSearch('');
      setFixedBancoSearch('');
    });
  };

  const handleSaveAbono = (e) => {
    e.preventDefault();
    if (modalSaliendo) return;
    if (editingItem) {
      setAbonos(abonos.map(a => a.id === editingItem.id ? { ...newAbono, id: a.id, pagos: a.pagos } : a));
    } else {
      setAbonos([...abonos, { ...newAbono, id: `abono-${Date.now()}`, pagos: {} }]);
    }
    marcarGuardado(editingItem ? 'Abono actualizado' : 'Abono creado', newAbono.descripcion);
    salirDeModal('abono', true, () => {
      setIsAddingAbono(false);
      setEditingItem(null);
      setNewAbono({ descripcion: '', diaPago: 1, facturacionAuto: false, iconType: 'preset', iconValue: 'layout', iconUrl: '' });
      setAbonoIconSearch('');
    });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    if (item.tipo === 'cuota') {
      setNewDebt({
        descripcion: item.descripcion || '',
        cuotasTotales: item.cuotasTotales || 12,
        valorCuota: item.valorCuota || 0,
        mesInicio: item.mesInicio || months[0],
        isContribuciones: item.isContribuciones || false,
        diaPago: item.diaPago || 1,
        facturacionAuto: item.facturacionAuto || false,
        banco: item.banco || '',
        bancoLogo: item.bancoLogo || '',
        tipoTarjeta: item.tipoTarjeta || '',
        iconType: item.iconType || 'default',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setDebtIconSearch('');
      setBancoSearch('');
      if (item.iconType === 'chile_preset' && item.iconValue) {
        const [cat] = item.iconValue.split(':');
        if (cat && CHILE_PRESET_ICONS[cat]) setDebtChileCat(cat);
      }
      setIsAddingDebt(true);
    } else if (item.tipo === 'suscripcion') {
      setNewSub({
        descripcion: item.descripcion || '',
        valor: item.valor || 0,
        billingCycle: item.billingCycle || 'mensual',
        diaPago: item.diaPago || 1,
        mesInicio: item.mesInicio || months[0],
        durationYears: item.durationYears || 1,
        facturacionAuto: item.facturacionAuto || false,
        banco: item.banco || '',
        bancoLogo: item.bancoLogo || '',
        tipoTarjeta: item.tipoTarjeta || '',
        iconType: item.iconType || 'preset',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setSubBancoSearch('');
      setSubscriptionIconSearch('');
      if (item.iconType === 'chile_preset' && item.iconValue) {
        const [cat] = item.iconValue.split(':');
        if (cat && CHILE_PRESET_ICONS[cat]) setSubChileCat(cat);
      }
      setIsAddingSub(true);
    } else if (item.tipo === 'abono') {
      setAbonoBancoSearch('');
      setNewAbono({
        descripcion: item.descripcion || '',
        diaPago: item.diaPago || 1,
        facturacionAuto: item.facturacionAuto || false,
        iconType: item.iconType || 'preset',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setAbonoIconSearch('');
      if (item.iconType === 'chile_preset' && item.iconValue) {
        const [cat] = item.iconValue.split(':');
        if (cat && CHILE_PRESET_ICONS[cat]) setAbonoChileCat(cat);
      }
      setIsAddingAbono(true);
    } else {
      setFixedBancoSearch('');
      setNewFixed({
        descripcion: item.descripcion || '',
        diaPago: item.diaPago || 1,
        facturacionAuto: item.facturacionAuto || false,
        banco: item.banco || '',
        bancoLogo: item.bancoLogo || '',
        tipoTarjeta: item.tipoTarjeta || '',
        iconType: item.iconType || 'preset',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setFixedIconSearch('');
      if (item.iconType === 'chile_preset' && item.iconValue) {
        const [cat] = item.iconValue.split(':');
        if (cat && CHILE_PRESET_ICONS[cat]) setFixedChileCat(cat);
      }
      setIsAddingFixed(true);
    }
  };

  // La transaccion pendiente sale del historial y de los totales: queda solo en Cuotas.
  const marcarTxOrigen = (id, tipo) => {
    fetch(`/api/transacciones/${id}`, {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ tipo_transaccion: tipo, tipo_gasto: null, revisado: true })
    })
      .then(() => setTxRefreshToken(t => t + 1))
      .catch(err => console.error('[pendientes] no se pudo marcar la transaccion', err));
  };

  const handleSaveSubscription = (e) => {
    e.preventDefault();
    if (modalSaliendo) return;
    if (editingItem && editingItem.tipo === 'suscripcion') {
      setSuscripciones(suscripciones.map(s => s.id === editingItem.id ? { ...newSub, id: s.id, pagos: s.pagos, ...(s.cancelaciones ? { cancelaciones: s.cancelaciones } : {}), ...(s.canceladaDesde ? { canceladaDesde: s.canceladaDesde } : {}) } : s));
    } else {
      setSuscripciones([...suscripciones, { ...newSub, id: `sub-${Date.now()}`, pagos: {} }]);
    }
    marcarGuardado(editingItem ? 'Suscripción actualizada' : 'Suscripción creada', newSub.descripcion);
    if (subDesdeTx && !editingItem) marcarTxOrigen(subDesdeTx.id, 'en_suscripcion');
    salirDeModal('suscripcion', true, () => {
      setSubDesdeTx(null);
      setIsAddingSub(false);
      setEditingItem(null);
      setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, iconType: 'preset', iconValue: 'layout', iconUrl: '' });
      setSubscriptionIconSearch('');
    });
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (modalSaliendo || !newAccount.nombre || !newAccount.banco) return;
    if (editingAccount) {
      setCuentasAhorro(cuentasAhorro.map(c => c.id === editingAccount.id ? { ...newAccount, id: c.id } : c));
    } else {
      setCuentasAhorro([...cuentasAhorro, { ...newAccount, id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }]);
    }
    marcarGuardado(editingAccount ? 'Cuenta actualizada' : 'Cuenta creada', newAccount.nombre);
    salirDeModal('cuenta', true, () => {
      setIsAddingAccount(false);
      setEditingAccount(null);
      setNewAccount({ nombre: '', banco: '' });
      setAccountBancoSearch('');
    });
  };

  const handleContribucionesChange = (e) => {
    const isContrib = e.target.checked;
    const year = newDebt.mesInicio ? newDebt.mesInicio.split(' ')[1] : new Date().getFullYear();
    setNewDebt(prev => ({
      ...prev,
      isContribuciones: isContrib,
      descripcion: isContrib ? `Contribuciones ${year}` : prev.descripcion,
      cuotasTotales: isContrib ? 4 : prev.cuotasTotales
    }));
  };

  const handleMesInicioChange = (e) => {
    const newVal = monthInputToMonthStr(e.target.value);
    const year = newVal ? newVal.split(' ')[1] : new Date().getFullYear();
    setNewDebt(prev => ({
      ...prev,
      mesInicio: newVal,
      descripcion: prev.isContribuciones ? `Contribuciones ${year}` : prev.descripcion
    }));
  };

  // Comparten toolbar de escritorio y speed-dial del FAB movil en Suscripciones y Cuotas.
  const openAddDebt = () => {
    setEditingItem(null);
    setCuotaDesdeTx(null);
    setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'default', iconValue: 'layout', iconUrl: '' });
    setDebtIconSearch('');
    setBancoSearch('');
    setIsAddingDebt(true);
  };
  // Desde "Pendientes de clasificar": abre Nueva Cuota con el total de la
  // compra y el inicio un mes despues de la fecha de la transaccion.
  const datosDesdeTx = (tx) => {
    const monto = Math.round(Number(tx.monto) || 0);
    const base = new Date(`${String(tx.fecha || '').slice(0, 10)}T12:00:00`);
    const d = isNaN(base.getTime()) ? new Date() : base;
    const dia = Math.min(31, Math.max(1, d.getDate()));
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    const mesInicio = monthInputToMonthStr(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    const banco = BANCOS_CHILE.find(b => (tx.banco || '').toLowerCase() === b.nombre.toLowerCase())
      || BANCOS_CHILE.find(b => tx.banco && b.nombre.toLowerCase().includes(String(tx.banco).toLowerCase()));
    return { monto, mesInicio, dia, banco };
  };
  const handlePasarACuotas = (tx) => {
    const { monto, mesInicio, banco } = datosDesdeTx(tx);
    const cuotas = 6;
    setEditingItem(null);
    setCuotaDesdeTx({ id: tx.id, monto, fecha: tx.fecha });
    setNewDebt({
      descripcion: tx.comercio || '', cuotasTotales: cuotas, valorCuota: Math.round(monto / cuotas), mesInicio,
      isContribuciones: false, diaPago: 1, facturacionAuto: false,
      banco: banco ? banco.nombre : (tx.banco || ''), bancoLogo: banco ? banco.logo : '',
      tipoTarjeta: banco ? (banco.tipos.includes('visa') ? 'visa' : 'mastercard') : '',
      iconType: 'default', iconValue: 'layout', iconUrl: ''
    });
    setDebtIconSearch('');
    setBancoSearch('');
    setActiveTab('general');
    setIsAddingDebt(true);
  };
  // Igual que cuotas, pero abre Nueva Suscripcion: el valor es el monto de la
  // compra, el dia de pago el de la compra y el inicio un mes despues.
  const handlePasarASuscripcion = (tx) => {
    const { monto, mesInicio, dia, banco } = datosDesdeTx(tx);
    setEditingItem(null);
    setSubDesdeTx({ id: tx.id, monto, fecha: tx.fecha });
    setNewSub({
      descripcion: tx.comercio || '', valor: monto, billingCycle: 'mensual', diaPago: dia, mesInicio, durationYears: 1,
      facturacionAuto: false,
      banco: banco ? banco.nombre : (tx.banco || ''), bancoLogo: banco ? banco.logo : '',
      tipoTarjeta: banco ? (banco.tipos.includes('visa') ? 'visa' : 'mastercard') : '',
      iconType: 'preset', iconValue: 'layout', iconUrl: ''
    });
    setSubBancoSearch('');
    setSubscriptionIconSearch('');
    setActiveTab('general');
    setIsAddingSub(true);
  };
  // Salida animada de los formularios de cuota y suscripcion. Al guardar, la
  // tarjeta da un pequeno salto y cae hacia la lista; al cerrar con la X solo
  // se encoge. El cierre real (y el reseteo del formulario) espera a que
  // termine, para que el contenido no cambie mientras se ve.
  const [modalSaliendo, setModalSaliendo] = useState(null); // { cual, guardado }
  const SALIDA_MODAL_MS = 320;
  const salirDeModal = (cual, guardado, cerrar) => {
    setModalSaliendo({ cual, guardado });
    setTimeout(() => { cerrar(); setModalSaliendo(null); }, SALIDA_MODAL_MS);
  };
  // Al llegar desde "Pendientes" el formulario completa el giro de la tarjeta
  // de revision y el fondo ya esta puesto; si no, entra con el zoom de siempre.
  const animModal = (cual, desdePendiente) => {
    const saliendo = modalSaliendo?.cual === cual;
    return {
      fondo: saliendo
        ? { animation: `kkModalScrimOut ${SALIDA_MODAL_MS}ms ease-in forwards` }
        : desdePendiente ? undefined : { animation: 'kkModalScrimIn 300ms ease-out' },
      tarjeta: saliendo
        ? { animation: `${modalSaliendo.guardado ? 'kkModalGuardado' : 'kkModalCierre'} ${SALIDA_MODAL_MS}ms cubic-bezier(0.4, 0, 0.9, 0.6) forwards` }
        : desdePendiente ? { animation: 'kkFlipIn 620ms cubic-bezier(0.3, 0.6, 0.35, 1.18) both' } : undefined,
    };
  };
  const cerrarModalFijo = () => {
    if (modalSaliendo) return;
    salirDeModal('fijo', false, () => { setIsAddingFixed(false); setEditingItem(null); setFixedBancoSearch(''); });
  };
  const cerrarModalAbono = () => {
    if (modalSaliendo) return;
    salirDeModal('abono', false, () => { setIsAddingAbono(false); setEditingItem(null); setAbonoIconSearch(''); });
  };
  const cerrarModalCuenta = () => {
    if (modalSaliendo) return;
    salirDeModal('cuenta', false, () => { setIsAddingAccount(false); setEditingAccount(null); setNewAccount({ nombre: '', banco: '' }); setAccountBancoSearch(''); });
  };
  const cerrarModalSub = () => {
    if (modalSaliendo) return;
    salirDeModal('suscripcion', false, () => {
      setIsAddingSub(false); setEditingItem(null); setSubDesdeTx(null);
      setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' });
      setSubBancoSearch(''); setSubscriptionIconSearch('');
    });
  };
  // Al llegar desde pendientes el valor de la cuota sigue al numero de cuotas.
  const cambiarCuotas = (n) => {
    const cuotas = Math.min(120, Math.max(1, n || 1));
    setNewDebt(prev => ({ ...prev, cuotasTotales: cuotas, ...(cuotaDesdeTx ? { valorCuota: Math.round(cuotaDesdeTx.monto / cuotas) } : {}) }));
  };
  const cerrarModalDeuda = () => {
    if (modalSaliendo) return;
    salirDeModal('deuda', false, () => { setIsAddingDebt(false); setEditingItem(null); setCuotaDesdeTx(null); });
  };
  const openAddFixed = () => {
    setEditingItem(null);
    setNewFixed({ descripcion: '', diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setFixedBancoSearch('');
    setIsAddingFixed(true);
  };
  const openAddAbono = () => {
    setEditingItem(null);
    setAbonoBancoSearch('');
    setNewAbono({ descripcion: '', diaPago: 1, facturacionAuto: false, iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setAbonoIconSearch('');
    setIsAddingAbono(true);
  };
  const openAddSub = () => {
    setEditingItem(null);
    setSubDesdeTx(null);
    setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setSubBancoSearch('');
    setSubscriptionIconSearch('');
    setIsAddingSub(true);
  };

  const updateSavingData = (cuentaId, mes, field, value) => {
    const val = parseInt(value) || 0;
    setAhorrosData(prev => ({
      ...prev,
      [cuentaId]: {
        ...(prev[cuentaId] || {}),
        [mes]: {
          ...(prev[cuentaId]?.[mes] || { deposito: 0, gasto: 0 }),
          [field]: val
        }
      }
    }));
  };

  const updateFixedPayment = (id, mes, field, value) => {
    setGastosFijos(prev => prev.map(g => {
      if (g.id !== id) return g;
      const current = g.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
      let newVal = value;
      if (field === 'monto') newVal = parseInt(value) || 0;
      return { ...g, pagos: { ...g.pagos, [mes]: { ...current, [field]: newVal } } };
    }));
  };

  const updateAbonoPayment = (id, mes, field, value) => {
    setAbonos(prev => prev.map(a => {
      if (a.id !== id) return a;
      const current = a.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
      let newVal = value;
      if (field === 'monto') newVal = parseInt(value) || 0;
      return { ...a, pagos: { ...a.pagos, [mes]: { ...current, [field]: newVal } } };
    }));
  };

  const renderChileIcon = (item) => {
    if (item.iconType !== 'chile_preset') return null;
    const [cat, id] = (item.iconValue || ':').split(':');
    const icon = CHILE_PRESET_ICONS[cat]?.find(i => i.id === id);
    if (icon) return <img src={icon.path} className="w-full h-full object-contain" alt={icon.label} title={icon.label} />;
    return null;
  };

  const renderFixedIcon = (item) => {
    if (item.iconType === 'url' && item.iconUrl) {
      return <img src={item.iconUrl} className="w-full h-full object-contain" alt="Icon" />;
    }
    const chileIcon = renderChileIcon(item);
    if (chileIcon) return chileIcon;
    const Preset = PRESET_ICONS.find(i => i.id === (item.iconValue || 'layout'))?.icon || LayoutDashboard;
    return <Preset size={18} />;
  };

  const renderDebtIcon = (item) => {
    if (item.iconType === 'url' && item.iconUrl) {
      return <img src={item.iconUrl} className="w-full h-full object-contain" alt="Icon" />;
    }
    if (item.iconType === 'preset') {
      const Preset = PRESET_ICONS.find(i => i.id === (item.iconValue || 'layout'))?.icon;
      if (Preset) return <Preset size={18} />;
    }
    const chileIcon = renderChileIcon(item);
    if (chileIcon) return chileIcon;
    return <CreditCard size={18} className="text-indigo-400" />;
  };

  const renderSubscriptionIcon = (item) => {
    if (item.iconType === 'url' && item.iconUrl) {
      return <img src={item.iconUrl} className="w-full h-full object-contain" alt="Icon" />;
    }
    const chileIcon = renderChileIcon(item);
    if (chileIcon) return chileIcon;
    const SubIcon = SUBSCRIPTION_ICONS.find(i => i.id === (item.iconValue || 'layout'))?.icon;
    if (SubIcon) return <SubIcon size={18} />;
    return <RefreshCw size={18} className="text-violet-400" />;
  };

  // Escape cierra el modal del presupuesto. El resto de los modales de esta
  // pantalla solo cierran con la X; aqui el input tiene el foco al abrir, asi
  // que salir con el teclado es el gesto natural.
  useEffect(() => {
    if (!showPresupuestoModal) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowPresupuestoModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPresupuestoModal]);

  const mesActual = `${MONTH_NAMES[new Date().getMonth()]} ${new Date().getFullYear()}`;
  const presupuestoMes = sueldos[dashboardMonth] || 0;
  const abrirPresupuesto = () => {
    setPresupuestoDraft(presupuestoMes ? String(presupuestoMes) : '');
    setShowPresupuestoModal(true);
  };
  const guardarPresupuesto = (e) => {
    if (e) e.preventDefault();
    const monto = parseInt(presupuestoDraft, 10) || 0;
    setSueldos({ ...sueldos, [dashboardMonth]: monto });
    setShowPresupuestoModal(false);
    marcarGuardado('Presupuesto guardado', `${dashboardMonth}: ${formatCurrency(monto)}`);
  };

  // Orden de abajo hacia arriba: la mas cercana al FAB es la mas usada.
  const fabDialActions = [
    { key: 'sub', label: 'Suscripciones', icon: RefreshCw, color: theme.btnSub, onClick: openAddSub },
    { key: 'abono', label: 'Abono', icon: TrendingUp, color: theme.btnPrimary, onClick: openAddAbono },
    { key: 'fixed', label: 'Gasto Fijo', icon: Receipt, color: theme.btnFixed, onClick: openAddFixed },
    { key: 'debt', label: 'Nueva Cuota', icon: CreditCard, color: theme.btnDebt, onClick: openAddDebt },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
	      <div className="min-h-[100dvh] bg-kk-background dark:bg-dark-darker p-1 md:p-2 pb-28 md:pb-2 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-[100%] lg:max-w-[1920px] mx-auto">

        {/* Una sola fila en todos los tamanos: en movil el logo ocupaba su
            propia linea y empujaba los controles a una segunda fila. El logo
            mide 5:1, asi que en pantallas estrechas baja a h-8 para dejar sitio. */}
        <header className="flex flex-row justify-between items-center mb-4 md:mb-6 gap-2 sm:gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <img src={isDarkMode ? '/Logo-black.svg' : '/logo.svg'} alt="Kuentas Klaras" className="h-8 sm:h-9 md:h-10 w-auto" />
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {!!dashboardMonth && (
              <button
                onClick={abrirPresupuesto}
                title={`Presupuesto de ${dashboardMonth}`}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 min-h-[40px] rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter hover:bg-slate-50 dark:hover:bg-dark-lighter transition shadow-sm active:scale-95"
              >
                <Wallet size={16} className={theme.tabText} />
                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {dashboardMonth.split(' ')[0].slice(0, 3)}
                </span>
                <span className="font-mono font-black text-xs text-slate-700 dark:text-slate-200">
                  {presupuestoMes > 0 ? formatCurrency(presupuestoMes) : 'Definir'}
                </span>
              </button>
            )}
            <button
              onClick={() => {
                const newMode = !isDarkMode
                setIsDarkMode(newMode)
                applyDarkMode(newMode, { persist: true })
              }}
              className="hidden md:flex p-2 md:p-2.5 rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter transition shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="hidden md:block">
            <UserMenu
              user={user}
              onRepetirTutorial={() => onOpenTutorial(false)}
              themeColor={themeColor}
              setThemeColor={(color) => { setThemeColor(color); localStorage.setItem('themeColor', color); }}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              onOpenAdmin={onOpenAdmin}
              onOpenCategorias={() => setShowCategoriasConfig(true)}
              onOpenConfig={() => setShowConfigModal(true)}
              onOpenFilters={() => setShowFilterRulesModal(true)}
              onRevisarCorreos={() => requestTxAction('revisar')}
              onReprocesar={() => requestTxAction('reprocesar')}
              onLogout={onLogout}
              generateFinancialAdvice={generateFinancialAdvice}
              isAiLoading={isAiLoading}
              isPushSubscribed={isPushSubscribed}
              isPushLoading={isPushLoading}
              onToggleNotifications={onToggleNotifications}
              onOpenPlanes={() => setShowPlanes(true)}
            />
            </div>
          </div>
        </header>

        <BillingBanner billing={billing} onOpen={() => setShowPlanes(true)} />

        {isInstallable && (
          <div className="mb-4 md:mb-6">
            <button
              onClick={onInstall}
              className="flex items-center gap-2 px-4 py-2.5 bg-kk text-white rounded-xl text-xs font-bold shadow-sm hover:bg-kk-dark transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Instalar App
            </button>
          </div>
        )}

        {aiAdvice && (
          <div className={`mb-4 md:mb-8 ${theme.bgLight} ${theme.bgLightDark} border-2 ${theme.badgeBg} ${theme.badgeBgDark} rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 relative animate-slide-down`}>
            <button onClick={() => setAiAdvice(null)} className={`absolute top-2 sm:top-4 right-2 sm:right-4 ${theme.iconAccent} ${theme.iconAccentDark} hover:${theme.tabText} transition-colors`}>
              <X size={18} />
            </button>
            <div className="flex gap-2 sm:gap-4">
              <div className="bg-white dark:bg-dark-normal p-2 sm:p-3 rounded-xl sm:rounded-2xl h-fit shadow-sm flex-shrink-0">
                <Sparkles className={theme.tabText} size={20} />
              </div>
              <div className="flex-1 min-w-0 pr-4 sm:pr-0">
                <h4 className={`${theme.badgeText} dark:${theme.badgeTextDark} font-black text-sm sm:text-lg mb-1 sm:mb-2`}>Consejo de tu Analista IA ✨</h4>
                <div className={`${theme.badgeText}/80 dark:${theme.badgeTextDark}/80 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium`}>
                  {aiAdvice}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center justify-center gap-2 mb-8">
          <NavPill items={NAV_ITEMS} activeId={activeTab} onSelect={setActiveTab} theme={theme} />
          <button
            onClick={openManualEntry}
            className={`flex items-center gap-2 pl-2.5 pr-5 py-2.5 rounded-full ${theme.btnPrimary} text-white text-sm font-black shadow-lg ${theme.shadowBtn} transition active:scale-95`}
          >
            <span className="grid place-items-center w-7 h-7 rounded-full bg-white/20"><Plus size={16} strokeWidth={2.75} /></span>
            Ingreso Manual
          </button>
        </div>

        {/* Scrim del speed-dial: solo existe en Suscripciones y Cuotas, con el dial abierto. */}
        {activeTab === 'general' && isFabDialOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-slate-950/35 dark:bg-black/55 animate-fade-in"
            onClick={() => setIsFabDialOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Movil: dock compacto. Cinco iconos (las cuatro secciones y el perfil);
            la opcion activa se estira y muestra su nombre. El boton + queda
            fuera de la barra, a la derecha; en Cuotas despliega el speed-dial. */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pointer-events-none"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
        >
          <div className="relative max-w-md mx-auto pointer-events-auto animate-slide-in-from-bottom">
            {activeTab === 'general' && isFabDialOpen && (
              <div className="absolute right-[0.4rem] bottom-[calc(100%+0.75rem)] w-11 flex flex-col items-center gap-2.5">
                {fabDialActions.map(({ key, label, icon: Icon, color, onClick }) => (
                  <div key={key} className="relative animate-scale-in">
                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-700 dark:text-slate-200 text-xs font-black px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                      {label}
                    </span>
                    <button
                      onClick={() => { onClick(); setIsFabDialOpen(false); }}
                      aria-label={label}
                      className={`w-11 h-11 rounded-full ${color} text-white grid place-items-center shadow-xl transition active:scale-90`}
                    >
                      <Icon size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 relative">
                <NavPill
                  items={[...NAV_ITEMS, { id: 'perfil', avatar: (user.name || '?').trim().charAt(0).toUpperCase(), label: `Perfil de ${nombreCorto}`, short: nombreCorto }]}
                  activeId={activeTab}
                  onSelect={(id) => { if (id === 'perfil') { setIsFabDialOpen(false); setPerfilOpen(true); } else { setPerfilOpen(false); setActiveTab(id); } }}
                  theme={theme}
                  tint={THEME_COLOR_HEX[themeColor]}
                  variant="dock"
                />
                {['pago_fallido', 'solo_lectura', 'suspendida'].includes(billing?.estado) || (billing?.estado === 'prueba' && billing.diasRestantes <= 7) ? (
                  <span aria-hidden="true" className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-dark-normal pointer-events-none" />
                ) : null}
              </div>
              <button
                onClick={() => { if (activeTab === 'general') setIsFabDialOpen(prev => !prev); else openManualEntry(); }}
                aria-label={activeTab === 'general' ? 'Agregar en Suscripciones y Cuotas' : 'Ingreso manual'}
                aria-expanded={activeTab === 'general' ? isFabDialOpen : undefined}
                style={{ '--kk-tint': THEME_COLOR_HEX[themeColor] }}
                className="kk-glass-tint flex-shrink-0 w-14 h-14 rounded-full text-white grid place-items-center transition active:scale-90"
              >
                <Plus size={26} strokeWidth={2.75} className={`transition-transform duration-200 ${activeTab === 'general' && isFabDialOpen ? 'rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {!showCategoriasConfig && <>
        {activeTab === 'dashboard' && !!dashboardMonth && (
          <div key="dashboard-tab" className={`space-y-4 sm:space-y-6 md:space-y-8 ${tabAnim} px-4 sm:px-6 w-full max-w-5xl mx-auto`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
                <LayoutDashboard className={theme.tabText} size={20} /> <span className="hidden sm:inline">Resumen Mensual</span><span className="sm:hidden">Resumen</span>
              </h2>
              <MonthNav value={dashboardMonth} months={sortedMonths} years={availableYears} onChange={setDashboardMonth} />
            </div>

            {(() => {
              const mes = dashboardMonth;
              const totalCuotas = totalesMensuales[mes]?.cuotas || 0;
              const totalGastos = resumenGastosMes.total_gastos || 0;
              const gastosPorCategoria = resumenGastosMes.summary || [];
              const totalSubs = totalesMensuales[mes]?.suscripciones || 0;
              const totalAbonos = totalesMensuales[mes]?.abonos || 0;
              const sueldo = totalesMensuales[mes]?.sueldo || 0;
              const disponibleExtras = sueldo + totalAbonos - (totalCuotas + totalGastos + totalSubs);
              const totalGastado = totalCuotas + totalGastos + totalSubs;
              const pctCuotas = sueldo > 0 ? (totalCuotas / sueldo) * 100 : 0;
              const pctGastos = sueldo > 0 ? (totalGastos / sueldo) * 100 : 0;
              const pctSubs = sueldo > 0 ? (totalSubs / sueldo) * 100 : 0;
              const pctGastado = sueldo > 0 ? (totalGastado / sueldo) * 100 : 0;
              const pctDisponible = sueldo > 0 ? Math.max(0, (disponibleExtras / sueldo) * 100) : 0;
              const saludColor = pctGastado < 60 ? 'text-emerald-500' : pctGastado < 80 ? 'text-amber-500' : 'text-rose-500';
              const saludLabel = pctGastado < 60 ? 'Saludable' : pctGastado < 80 ? 'Moderado' : 'Alerta';
              const saludBg = pctGastado < 60 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : pctGastado < 80 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400';

              const cuotasActivas = deudas.filter(d => {
                const mesTermino = calculateEndDate(d.mesInicio, d.isContribuciones ? 4 : d.cuotasTotales, d.isContribuciones);
                return isMonthInRange(mes, d.mesInicio, mesTermino, d.isContribuciones);
              }).sort((a, b) => (a.pagos?.[mes]?.estado === 'PAGADA' ? 1 : 0) - (b.pagos?.[mes]?.estado === 'PAGADA' ? 1 : 0));

              const cuotasPagadasMes = cuotasActivas.filter(d => d.pagos?.[mes]?.estado === 'PAGADA').length;
              const cuotasPendientesMes = cuotasActivas.length - cuotasPagadasMes;

              const subsActivas = suscripciones.filter(s => subActivaEnMes(s, mes)).sort((a, b) => (a.pagos?.[mes]?.estado === 'PAGADA' ? 1 : 0) - (b.pagos?.[mes]?.estado === 'PAGADA' ? 1 : 0));

              const proximosCobros = subsActivas.filter(s => s.pagos?.[mes]?.estado !== 'PAGADA')
                .map(s => ({ nombre: s.descripcion, monto: s.pagos?.[mes]?.monto || s.valor || 0, dia: s.diaPago || 1 }))
                .sort((a, b) => a.dia - b.dia);
              const cobrosPorDia = {};
              proximosCobros.forEach(c => { if (!cobrosPorDia[c.dia]) cobrosPorDia[c.dia] = []; cobrosPorDia[c.dia].push(c); });

              const catStyle = (catName) => {
                const cat = categorias?.find(c => c.nombre === catName);
                const val = cat ? getCatStyle(cat.color_hex) : null;
                if (!val) return { className: 'bg-slate-100 dark:bg-dark-lighter text-slate-500 dark:text-slate-400' };
                return typeof val === 'string' ? { className: val } : { style: { backgroundColor: val.backgroundColor, color: val.color } };
              };
              const catBar = (catName) => {
                const cat = categorias?.find(c => c.nombre === catName);
                const val = cat ? getCatBar(cat.color_hex) : null;
                if (!val) return { className: 'bg-slate-300 dark:bg-slate-600' };
                return typeof val === 'string' ? { className: val } : { style: { backgroundColor: val.backgroundColor } };
              };

              const donutSegments = [
                { label: 'Cuotas', value: totalCuotas, pct: pctCuotas, color: theme.bgLight.replace('/50', ''), darkColor: theme.bgLightDark },
                { label: 'Gastos', value: totalGastos, pct: pctGastos, color: 'bg-slate-400', darkColor: 'dark:bg-slate-500' },
                { label: 'Suscripciones', value: totalSubs, pct: pctSubs, color: 'bg-rose-400', darkColor: 'dark:bg-rose-400' },
                { label: 'Disponible', value: Math.max(0, disponibleExtras), pct: pctDisponible, color: 'bg-emerald-400', darkColor: 'dark:bg-emerald-400' }
              ].filter(s => s.value > 0);

              const donutColors = [
                THEME_COLOR_HEX[themeColor],
                '#94a3b8',
                '#fb7185',
                '#34d399'
              ];

              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bezel shadow-fluid shadow-fluid-hover transition-all duration-500 ease-fluid hover:-translate-y-1 animate-row-enter" style={{ animationDelay: '0ms' }}>
                      <div className="bezel-core bg-white dark:bg-dark-normal p-3 sm:p-5">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className={`p-1 sm:p-1.5 rounded-lg ${theme.bgLight} ${theme.bgLightDark}`}>
                            <CreditCard className={theme.tabText} size={14} strokeWidth={1.75} />
                          </div>
                          <span className="text-xs sm:text-xs font-black uppercase tracking-wider text-slate-400">Cuotas</span>
                        </div>
                        <div className={`text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 ${theme.tabText}`}>{formatCurrency(totalCuotas)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-xs text-slate-400">
                          <span>{cuotasPagadasMes} pagadas</span>
                          <span>·</span>
                          <span>{cuotasPendientesMes} pendientes</span>
                        </div>
                      </div>
                    </div>

                    <div className="bezel shadow-fluid shadow-fluid-hover transition-all duration-500 ease-fluid hover:-translate-y-1 animate-row-enter" style={{ animationDelay: '60ms' }}>
                      <div className="bezel-core bg-white dark:bg-dark-normal p-3 sm:p-5">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="p-1 sm:p-1.5 rounded-lg bg-slate-100 dark:bg-dark-lighter">
                            <Receipt className="text-slate-500 dark:text-slate-400" size={14} strokeWidth={1.75} />
                          </div>
                          <span className="text-xs sm:text-xs font-black uppercase tracking-wider text-slate-400">Gastos</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 text-slate-700 dark:text-slate-200">
                          {loadingResumenGastos ? <span className="inline-block w-20 h-5 rounded skeleton" /> : formatCurrency(totalGastos)}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-xs text-slate-400">
                          <span>{gastosPorCategoria.length} categorías</span>
                          {gastosPorCategoria[0] && <span>·</span>}
                          {gastosPorCategoria[0] && <span className="truncate">Top: {gastosPorCategoria[0].categoria}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bezel shadow-fluid shadow-fluid-hover transition-all duration-500 ease-fluid hover:-translate-y-1 animate-row-enter" style={{ animationDelay: '120ms' }}>
                      <div className="bezel-core bg-white dark:bg-dark-normal p-3 sm:p-5">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="p-1 sm:p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                            <RefreshCw className="text-rose-500 dark:text-rose-400" size={14} strokeWidth={1.75} />
                          </div>
                          <span className="text-xs sm:text-xs font-black uppercase tracking-wider text-slate-400">Suscripciones</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 text-rose-500 dark:text-rose-400">{formatCurrency(totalSubs)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-xs text-slate-400">
                          <span>{subsActivas.length} activas</span>
                          {proximosCobros.length > 0 && <span>·</span>}
                          {proximosCobros.length > 0 && <span>Próx: día {proximosCobros[0]?.dia}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bezel shadow-fluid shadow-fluid-hover transition-all duration-500 ease-fluid hover:-translate-y-1 animate-row-enter" style={{ animationDelay: '180ms' }}>
                      <div className="bezel-core bg-white dark:bg-dark-normal p-3 sm:p-5">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className={`p-1 sm:p-1.5 rounded-lg ${disponibleExtras >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                            <Wallet className={disponibleExtras >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} size={14} strokeWidth={1.75} />
                          </div>
                          <span className="text-xs sm:text-xs font-black uppercase tracking-wider text-slate-400">Disponible</span>
                        </div>
                        <div className={`text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 ${disponibleExtras >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>{formatCurrency(disponibleExtras)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-xs text-slate-400">
                          <span>{pctDisponible.toFixed(0)}% libre</span>
                          <span>·</span>
                          <span className="font-bold">{saludLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter overflow-hidden transition-all duration-500 ease-fluid hover:-translate-y-0.5">
                      <button onClick={() => toggleDashSection('cuotas')} className="w-full flex items-center justify-between p-3 sm:p-5 hover:bg-slate-50 dark:hover:bg-dark-lighter/50 transition-colors group/section">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-xl ${theme.bgLight} ${theme.bgLightDark}`}>
                            <CreditCard className={theme.tabText} size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Cuotas Activas</span>
                            <span className={`ml-1 sm:ml-2 text-xs sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeBgDark} ${theme.badgeText} dark:${theme.badgeTextDark}`}>{cuotasActivas.length} este mes</span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${dashSections.cuotas ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.cuotas && (
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-2 sm:space-y-3 border-t border-slate-100 dark:border-dark-lighter pt-3 sm:pt-4 animate-slide-down">
                          {cuotasActivas.map((d, i) => {
                            const mesTermino = calculateEndDate(d.mesInicio, d.isContribuciones ? 4 : d.cuotasTotales, d.isContribuciones);
                            let pagadas = 0; let cur = toDateVal(d.mesInicio); const end = toDateVal(mesTermino);
                            while (cur <= end) { const m = fromDateVal(cur); if (!d.isContribuciones || ['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(m.split(' ')[0])) { if (d.pagos?.[m]?.estado === 'PAGADA') pagadas++; } cur++; }
                            const totalD = d.isContribuciones ? 4 : d.cuotasTotales;
                            const pctD = totalD > 0 ? (pagadas / totalD) * 100 : 0;
                            return (
                              <div key={d.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-dark-lighter/30 transition-all duration-300 ease-fluid hover:bg-slate-100 dark:hover:bg-dark-lighter/50 hover:translate-x-0.5 animate-row-enter" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-300 overflow-hidden`}>
                                  <div className={theme.tabText}>{renderDebtIcon(d)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 truncate">{d.descripcion}</span>
                                    {d.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-xs font-black px-1 sm:px-1.5 py-0.5 rounded uppercase hidden sm:inline">Legal</span>}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-2 sm:h-1.5 bg-slate-100 dark:bg-dark-lighter rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition duration-500 ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pctD}%` }}></div>
                                    </div>
                                    <span className="text-xs sm:text-xs font-bold text-slate-400 whitespace-nowrap">{pagadas}/{totalD}</span>
                                  </div>
                                </div>
                                <span className="text-xs sm:text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(d.valorCuota)}</span>
                              </div>
                            );
                          })}
                          {cuotasActivas.length > 0 && (
                            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-dark-lighter">
                              <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                              <span className={`text-xs sm:text-sm font-mono font-black ${theme.tabText}`}>{formatCurrency(totalCuotas)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter overflow-hidden transition-all duration-500 ease-fluid hover:-translate-y-0.5">
                      <div className="p-3 sm:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <PieChart className="text-emerald-500 dark:text-emerald-400" size={16} />
                          </div>
                          <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Distribución</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                            <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${donutSegments.map((s, i) => {
                              return `${donutColors[i]} ${i === 0 ? '0' : donutSegments.slice(0, i).reduce((a, x) => a + x.pct, 0)}% ${donutSegments.slice(0, i + 1).reduce((a, x) => a + x.pct, 0)}%`;
                            }).join(', ')})` }}></div>
                            <div className="absolute inset-2 sm:inset-3 rounded-full bg-white dark:bg-dark-normal flex flex-col items-center justify-center shadow-inner">
                              <span className="text-xs sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Gastado</span>
                              <span className="text-sm sm:text-lg font-mono font-black text-slate-800 dark:text-slate-100">{pctGastado.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2.5 flex-1 w-full">
                            {(() => {
                              const textColors = [theme.tabText, 'text-slate-500 dark:text-slate-400', 'text-rose-500 dark:text-rose-400', 'text-emerald-500 dark:text-emerald-400'];
                              return donutSegments.map((s, i) => (
                              <div key={i} className="flex items-center justify-between group/legend hover:bg-slate-50 dark:hover:bg-dark-lighter/30 rounded-lg px-2 py-1.5 -mx-2 transition-colors">
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-800" style={{ backgroundColor: donutColors[i] }}></div>
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{s.label}</span>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs font-mono font-black ${textColors[i]}`}>{formatCurrency(s.value)}</span>
                                  <span className="text-xs sm:text-xs font-bold text-slate-400 ml-1 sm:ml-1.5">{s.pct.toFixed(0)}%</span>
                                </div>
                              </div>
                            ));
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter overflow-hidden transition-all duration-500 ease-fluid hover:-translate-y-0.5">
                      <button onClick={() => toggleDashSection('subs')} className="w-full flex items-center justify-between p-3 sm:p-5 hover:bg-slate-50 dark:hover:bg-dark-lighter/50 transition-colors group/section">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 rounded-xl bg-rose-100 dark:bg-rose-900/30">
                            <RefreshCw className="text-rose-500 dark:text-rose-400" size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Suscripciones</span>
                            <span className={`ml-1 sm:ml-2 text-xs sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300`}>{subsActivas.length} activas</span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${dashSections.subs ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.subs && (
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-2 sm:space-y-3 border-t border-slate-100 dark:border-dark-lighter pt-3 sm:pt-4 animate-slide-down">
                          {subsActivas.map((s, i) => {
                            const monto = s.pagos?.[mes]?.monto || s.valor || 0;
                            const subPagado = s.pagos?.[mes]?.estado === 'PAGADA';
                            return (
                              <div key={s.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-dark-lighter/30 transition-all duration-300 ease-fluid hover:bg-slate-100 dark:hover:bg-dark-lighter/50 hover:translate-x-0.5 animate-row-enter" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-rose-100 dark:bg-rose-900/30 overflow-hidden">
                                  <div className="text-rose-500 dark:text-rose-400">{renderSubscriptionIcon(s)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 truncate">{s.descripcion}</span>
                                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${subPagado ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-dark-lightest text-slate-500 dark:text-slate-400'}`}>{subPagado ? 'Pagado' : 'Pendiente'}</span>
                                  </div>
                                  <span className="text-xs sm:text-xs font-bold text-slate-400">Día {s.diaPago || 1} · {s.billingCycle === 'mensual' ? 'Mensual' : 'Anual'}</span>
                                </div>
                                <span className="text-xs sm:text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(monto)}</span>
                              </div>
                            );
                          })}
                          {subsActivas.length > 0 && (
                            <>
                              {Object.keys(cobrosPorDia).length > 0 && (
                                <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-dark-lighter">
                                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                    <CalendarDays size={12} className="text-slate-400" />
                                    <span className="text-xs sm:text-xs font-black text-slate-400 uppercase">Próximos cobros</span>
                                  </div>
                                  <div className="space-y-1 sm:space-y-1.5">
                                    {Object.entries(cobrosPorDia).map(([dia, cobros]) => (
                                      <div key={dia} className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs">
                                        <span className="w-full sm:w-16 font-bold text-slate-500 dark:text-slate-400">Día {dia}</span>
                                        <span className="text-slate-400 text-xs">{cobros.map(c => `${c.nombre} ${formatCurrency(c.monto)}`).join(', ')}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-dark-lighter">
                                <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                                <span className="text-xs sm:text-sm font-mono font-black text-rose-500 dark:text-rose-400">{formatCurrency(totalSubs)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter overflow-hidden transition-all duration-500 ease-fluid hover:-translate-y-0.5">
                      <button onClick={() => toggleDashSection('fijos')} className="w-full flex items-center justify-between p-3 sm:p-5 hover:bg-slate-50 dark:hover:bg-dark-lighter/50 transition-colors group/section">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-dark-lighter">
                            <Receipt className="text-slate-500 dark:text-slate-400" size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Gastos</span>
                            <span className={`ml-1 sm:ml-2 text-xs sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-slate-300`}>{gastosPorCategoria.length} categorías</span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${dashSections.fijos ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.fijos && (
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-2 sm:space-y-3 border-t border-slate-100 dark:border-dark-lighter pt-3 sm:pt-4 animate-slide-down">
                          {loadingResumenGastos ? (
                            <div className="py-4 text-center text-xs font-bold text-slate-400">Cargando movimientos...</div>
                          ) : gastosPorCategoria.length === 0 ? (
                            <div className="py-4 text-center text-xs font-bold text-slate-400">Sin gastos registrados en Transacciones este mes</div>
                          ) : (
                            <>
                              {(() => {
                                const maxTotal = Math.max(...gastosPorCategoria.map(c => c.total), 1);
                                return gastosPorCategoria.map((c, i) => (
                                  <div key={c.categoria} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-dark-lighter/30 transition-all duration-300 ease-fluid hover:bg-slate-100 dark:hover:bg-dark-lighter/50 hover:translate-x-0.5 animate-row-enter" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
                                    <span {...catStyle(c.categoria)} className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 truncate max-w-[40%] ${catStyle(c.categoria).className || ''}`}>{c.categoria}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-dark-lighter overflow-hidden">
                                      <div {...catBar(c.categoria)} className={`h-full rounded-full ${catBar(c.categoria).className || ''}`} style={{ width: `${(c.total / maxTotal) * 100}%`, ...(catBar(c.categoria).style || {}) }} />
                                    </div>
                                    <span className="text-xs sm:text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(c.total)}</span>
                                  </div>
                                ));
                              })()}
                              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-dark-lighter">
                                <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                                <span className="text-xs sm:text-sm font-mono font-black text-slate-500 dark:text-slate-400">{formatCurrency(totalGastos)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter p-3 sm:p-5 transition-all duration-500 ease-fluid hover:-translate-y-0.5 animate-fade-in">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-xl ${saludBg}`}>
                          <Activity className={saludColor} size={16} />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Salud Financiera</span>
                      </div>
                      <span className={`text-xs sm:text-xs font-black px-2 sm:px-3 py-1 rounded-full ${saludBg}`}>{saludLabel}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="h-2.5 sm:h-3 bg-slate-100 dark:bg-dark-lighter rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-emerald-400" style={{ width: '60%' }}></div>
                            <div className="h-full bg-amber-400" style={{ width: '20%' }}></div>
                            <div className="h-full bg-rose-400" style={{ width: '20%' }}></div>
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border-2 border-slate-800 rounded-full shadow-md transition duration-500" style={{ left: `calc(${Math.min(pctGastado, 100)}% - 6px)` }}></div>
                        </div>
                        <div className="flex justify-between text-xs sm:text-xs font-bold text-slate-400 mt-1">
                          <span>0%</span>
                          <span className="text-emerald-500">60%</span>
                          <span className="text-amber-500">80%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="text-right sm:min-w-[100px]">
                        <div className={`text-xl sm:text-2xl font-mono font-black ${saludColor}`}>{pctGastado.toFixed(0)}%</div>
                        <div className="text-xs sm:text-xs font-bold text-slate-400 uppercase">gastado</div>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const totalAhorroActual = cuentasAhorro.reduce((acc, c) => {
                      return acc + (balancesPorCuenta[c.id]?.[mes]?.acumulado || 0);
                    }, 0);

                    const sortedMonths = [...filteredMonths].sort((a, b) => toDateVal(a) - toDateVal(b));
                    const last6Months = sortedMonths.slice(-6);
                    const depositsByMonth = last6Months.map(m =>
                      cuentasAhorro.reduce((acc, c) => acc + (ahorrosData[c.id]?.[m]?.deposito || 0), 0)
                    );
                    const activeDeposits = depositsByMonth.filter(d => d > 0);
                    const promedioMensual = activeDeposits.length > 0 ? activeDeposits.reduce((a, b) => a + b, 0) / activeDeposits.length : 0;

                    const proyeccion3Meses = totalAhorroActual + (promedioMensual * 3);
                    const proyeccion6Meses = totalAhorroActual + (promedioMensual * 6);

                    const maxDeposit = Math.max(...depositsByMonth, 1);
                    const trendUp = depositsByMonth.length >= 2 && depositsByMonth[depositsByMonth.length - 1] > depositsByMonth[depositsByMonth.length - 2];

                    const hasNoData = totalAhorroActual === 0 && promedioMensual === 0;

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
                        <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter overflow-hidden transition-all duration-500 ease-fluid hover:-translate-y-0.5">
                          <div className="p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <PiggyBank className="text-emerald-500 dark:text-emerald-400" size={16} />
                              </div>
                              <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Resumen de Ahorros</span>
                            </div>
                            {hasNoData ? (
                              <div className="text-center py-4 sm:py-6">
                                <PiggyBank className="mx-auto text-slate-300 dark:text-slate-600 mb-2 sm:mb-3" size={28} />
                                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">Sin datos de ahorro aún</p>
                                <p className="text-xs sm:text-xs text-slate-400 dark:text-slate-500 mt-1">Ve a la pestaña <span className="font-bold text-emerald-500">Gestión de Ahorros</span> para registrar depósitos o gastos.</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                  <span className="text-xs sm:text-xs font-bold text-emerald-500/70 uppercase tracking-wider">Balance total</span>
                                  <div className="text-lg sm:text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalAhorroActual)}</div>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  {cuentasAhorro.map(c => {
                                    const saldo = balancesPorCuenta[c.id]?.[mes]?.acumulado || 0;
                                    return (
                                      <div key={c.id} className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-dark-lighter/30">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          {(() => { const bi = getAhorroBankInfo(c.banco); return bi ? <img src={bi.logo} alt={c.banco} className="w-5 h-3 sm:w-6 sm:h-4 object-contain flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} /> : null; })()}
                                          <div className="min-w-0">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block truncate">{c.nombre}</span>
                                            <span className="text-xs sm:text-xs text-slate-400">{c.banco}</span>
                                          </div>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{formatCurrency(saldo)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid shadow-fluid-hover border border-slate-200/70 dark:border-dark-lighter overflow-hidden transition-all duration-500 ease-fluid hover:-translate-y-0.5">
                          <div className="p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <TrendingUp className="text-indigo-500 dark:text-indigo-400" size={16} />
                              </div>
                              <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Proyección de Ahorro</span>
                              {promedioMensual > 0 && (
                                <span className={`ml-auto text-xs sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-dark-lighter text-slate-500'}`}>
                                  {trendUp ? 'Tendencia +' : 'Estable'}
                                </span>
                              )}
                            </div>

                            {hasNoData ? (
                              <div className="text-center py-4 sm:py-6">
                                <TrendingUp className="mx-auto text-slate-300 dark:text-slate-600 mb-2 sm:mb-3" size={28} />
                                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">Sin historial de depósitos</p>
                                <p className="text-xs sm:text-xs text-slate-400 dark:text-slate-500 mt-1">Registra depósitos en al menos un mes para ver tu proyección.</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-3 sm:mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs sm:text-xs font-bold text-slate-400 uppercase">Promedio mensual</span>
                                    <span className="text-xs font-mono font-black text-slate-600 dark:text-slate-300">{formatCurrency(promedioMensual)}</span>
                                  </div>
                                  <div className="flex gap-1 items-end h-6 sm:h-8">
                                    {depositsByMonth.map((d, i) => (
                                      <div
                                        key={i}
                                        className="flex-1 rounded-sm bg-indigo-200 dark:bg-indigo-800/50 transition hover:bg-indigo-400 dark:hover:bg-indigo-600"
                                        style={{ height: `${Math.max((d / maxDeposit) * 100, 4)}%` }}
                                        title={last6Months[i]}
                                      ></div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between text-xs sm:text-xs text-slate-400 mt-0.5">
                                    {last6Months.map((m, i) => (
                                      <span key={i} className="flex-1 text-center truncate">{m.split(' ')[0].substring(0, 3)}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                  <div className="p-2 sm:p-3 bg-slate-50 dark:bg-dark-lighter/30 rounded-xl text-center">
                                    <span className="text-xs sm:text-xs font-bold text-slate-400 uppercase">3 meses</span>
                                    <div className="text-xs sm:text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(proyeccion3Meses)}</div>
                                  </div>
                                  <div className="p-2 sm:p-3 bg-slate-50 dark:bg-dark-lighter/30 rounded-xl text-center">
                                    <span className="text-xs sm:text-xs font-bold text-slate-400 uppercase">6 meses</span>
                                    <div className="text-xs sm:text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(proyeccion6Meses)}</div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>
        )}

        {activeTab === 'general' && (
          <div key="general-tab" className={`${tabAnim} px-4 sm:px-6 w-full max-w-5xl mx-auto`}>
            <div className="hidden sm:flex flex-wrap justify-end gap-2 mb-3">
              <button onClick={openAddDebt} className={`flex items-center justify-center gap-2 ${theme.btnDebt} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition`}>
                <CreditCard size={16} /> Nueva Cuota <Plus size={16} />
              </button>
              <button onClick={openAddFixed} className={`flex items-center justify-center gap-2 ${theme.btnFixed} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition`}>
                <Receipt size={16} /> Gasto Fijo <Plus size={16} />
              </button>
              <button onClick={openAddAbono} className={`flex items-center justify-center gap-2 ${theme.btnPrimary} px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition`}>
                <TrendingUp size={16} /> Abono <Plus size={16} />
              </button>
              <button onClick={openAddSub} className={`flex items-center justify-center gap-2 ${theme.btnSub} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition`}>
                <RefreshCw size={16} /> Suscripciones <Plus size={16} />
              </button>
            </div>

            <div className="mb-4 sm:mb-5">
              <MonthNav value={dashboardMonth} months={sortedMonths} years={availableYears} onChange={setDashboardMonth} />
            </div>

            {/* Card principal de la pantalla. Reemplaza a la de sueldo: el
                presupuesto del mes se edita ahora desde el chip del header, y
                Gastos Fijos / Abonos / Disponible quedan solo en Resumen.
                A diferencia de totalesMensuales, que suma unicamente lo PAGADO,
                aqui cada mitad muestra el compromiso completo del mes. */}
            {(() => {
              const mes = dashboardMonth;
              const esPagado = (x) => x.pagos?.[mes]?.estado === 'PAGADA';

              const cuotasActivas = deudas.filter(d => {
                const mesTermino = calculateEndDate(d.mesInicio, d.isContribuciones ? 4 : d.cuotasTotales, d.isContribuciones);
                return isMonthInRange(mes, d.mesInicio, mesTermino, d.isContribuciones);
              });
              const subsActivas = suscripciones.filter(s => subActivaEnMes(s, mes));

              const montoCuota = (d) => d.valorCuota || 0;
              const montoSub = (s) => s.pagos?.[mes]?.monto || s.valor || 0;

              const totalCuotas = cuotasActivas.reduce((acc, d) => acc + montoCuota(d), 0);
              const totalSubs = subsActivas.reduce((acc, s) => acc + montoSub(s), 0);
              const pagadoCuotas = cuotasActivas.filter(esPagado).reduce((acc, d) => acc + montoCuota(d), 0);
              const pagadoSubs = subsActivas.filter(esPagado).reduce((acc, s) => acc + montoSub(s), 0);

              const total = totalCuotas + totalSubs;
              const pagado = pagadoCuotas + pagadoSubs;
              const falta = Math.max(0, total - pagado);
              const pctPagado = total > 0 ? (pagado / total) * 100 : 0;

              const cuotasPagadas = cuotasActivas.filter(esPagado).length;
              const subsPagadas = subsActivas.filter(esPagado).length;
              const proximoCobro = subsActivas
                .filter(s => !esPagado(s))
                .map(s => s.diaPago || 1)
                .sort((a, b) => a - b)[0];

              return (
                <div className="bg-white dark:bg-dark-normal rounded-kk-2xl shadow-fluid border border-slate-200/70 dark:border-dark-lighter overflow-hidden mb-4 sm:mb-5">
                  <div className="grid grid-cols-2">
                    <div className="p-3 sm:p-5 border-r border-slate-100 dark:border-dark-lighter">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <div className={`p-1 sm:p-1.5 rounded-lg ${theme.bgLight} ${theme.bgLightDark}`}>
                          <CreditCard className={theme.tabText} size={14} strokeWidth={1.75} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">Cuotas</span>
                      </div>
                      <div className={`text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 ${theme.tabText}`}>{formatCurrency(totalCuotas)}</div>
                      <div className="text-xs text-slate-400">
                        {cuotasActivas.length === 0
                          ? 'Sin cuotas este mes'
                          : `${cuotasPagadas} pagadas · ${cuotasActivas.length - cuotasPagadas} pendientes`}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <div className="p-1 sm:p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                          <RefreshCw className="text-rose-500 dark:text-rose-400" size={14} strokeWidth={1.75} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">Suscripciones</span>
                      </div>
                      <div className="text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 text-rose-500 dark:text-rose-400">{formatCurrency(totalSubs)}</div>
                      <div className="text-xs text-slate-400">
                        {subsActivas.length === 0
                          ? 'Sin suscripciones este mes'
                          : `${subsActivas.length - subsPagadas} por cobrar${proximoCobro ? ` · Próx: día ${proximoCobro}` : ''}`}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-dark-lighter bg-slate-50/70 dark:bg-dark-lighter/30 px-3 sm:px-5 py-3 sm:py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total del mes</span>
                      <span className="text-base sm:text-lg font-mono font-black text-slate-700 dark:text-slate-200">{formatCurrency(total)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-dark-lightest overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-fluid" style={{ width: `${pctPagado}%` }} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400">{formatCurrency(pagado)} pagado · {pctPagado.toFixed(0)}%</span>
                      <span className={`text-xs sm:text-sm font-black ${falta > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                        {falta > 0 ? `Falta ${formatCurrency(falta)}` : 'Todo pagado'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {itemsUnificados.length === 0 ? (
              <div className="py-16 text-center text-slate-300 dark:text-slate-600 font-bold italic">No hay registros para mostrar</div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3 mb-12">
                {itemsUnificados.map((item, itemIdx) => {
                  const mes = dashboardMonth;
                  const isCuota = item.tipo === 'cuota';
                  const isSub = item.tipo === 'suscripcion';
                  const isAbono = item.tipo === 'abono';

                  let active = true;
                  let isPagado = false;
                  let amount = 0;
                  let hasValue = true;
                  let cancelada = false;
                  let onTogglePagado = () => {};
                  let onChangeMonto = null;

                  if (isCuota) {
                    active = isMonthInRange(mes, item.mesInicio, item.mesTermino, item.isContribuciones);
                    isPagado = item.pagos?.[mes]?.estado === 'PAGADA';
                    amount = item.valorCuota;
                    onTogglePagado = () => {
                      const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                      setDeudas(deudas.map(x => x.id === item.id ? { ...x, pagos: { ...x.pagos, [mes]: { estado: next } } } : x));
                    };
                  } else if (isSub) {
                    active = item.activeMonths && item.activeMonths.includes(mes);
                    cancelada = active && subCanceladaEn(item, mes);
                    const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                    isPagado = pago.estado === 'PAGADA';
                    amount = pago.monto || item.valor;
                    hasValue = amount > 0;
                    onTogglePagado = () => {
                      if (!hasValue) return;
                      const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                      setSuscripciones(suscripciones.map(s => s.id === item.id ? { ...s, pagos: { ...s.pagos, [mes]: { ...(s.pagos?.[mes] || { monto: s.valor || 0 }), estado: next } } } : s));
                    };
                    onChangeMonto = (val) => setSuscripciones(suscripciones.map(s => s.id === item.id ? { ...s, pagos: { ...s.pagos, [mes]: { ...(s.pagos?.[mes] || { estado: 'PENDIENTE' }), monto: val } } } : s));
                  } else if (isAbono) {
                    const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                    isPagado = pago.estado === 'PAGADA';
                    amount = pago.monto;
                    hasValue = amount > 0;
                    onTogglePagado = () => { if (pago.monto > 0) updateAbonoPayment(item.id, mes, 'estado', isPagado ? 'PENDIENTE' : 'PAGADA'); };
                    onChangeMonto = (val) => updateAbonoPayment(item.id, mes, 'monto', val);
                  } else {
                    const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                    isPagado = pago.estado === 'PAGADA';
                    amount = pago.monto;
                    hasValue = amount > 0;
                    onTogglePagado = () => { if (pago.monto > 0) updateFixedPayment(item.id, mes, 'estado', isPagado ? 'PENDIENTE' : 'PAGADA'); };
                    onChangeMonto = (val) => updateFixedPayment(item.id, mes, 'monto', val);
                  }

                  let cuotaPagadas = 0;
                  let cuotaTotal = 0;
                  if (isCuota) {
                    let cur = toDateVal(item.mesInicio);
                    const end = toDateVal(item.mesTermino);
                    while (cur <= end) {
                      const mName = fromDateVal(cur);
                      if (!item.isContribuciones || ['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(mName.split(' ')[0])) {
                        if (item.pagos?.[mName]?.estado === 'PAGADA') cuotaPagadas++;
                      }
                      cur++;
                    }
                    cuotaTotal = item.cuotasTotales;
                  }

                  if (isCuota && !active && cuotaTotal > 0 && cuotaPagadas >= cuotaTotal && toDateVal(item.mesTermino) < toDateVal(mes)) {
                    return null;
                  }

                  const isExpanded = !!expandedGeneralItems[item.id];
                  const cancelarSuscripcion = () => {
                    // Si ya se pago este mes, la baja rige desde el siguiente.
                    const desde = isPagado ? fromDateVal(toDateVal(mes) + 1) : mes;
                    if (!window.confirm(`¿Cancelar "${item.descripcion}" desde ${desde}? Se conserva el historial y deja de aparecer como pendiente.`)) return;
                    setSuscripciones(suscripciones.map(s => {
                      if (s.id !== item.id) return s;
                      const { canceladaDesde, ...resto } = s;
                      return { ...resto, cancelaciones: [...subPeriodos(s), { desde, hasta: null }] };
                    }));
                    marcarGuardado('Suscripción cancelada', item.descripcion);
                  };
                  const reactivarSuscripcion = () => {
                    // Se reanuda desde el mes que se esta viendo. Si ese mes es el de
                    // la cancelacion (o anterior), la cancelacion se deshace entera.
                    setSuscripciones(suscripciones.map(s => {
                      if (s.id !== item.id) return s;
                      const { canceladaDesde, ...resto } = s;
                      const actual = subPeriodoEn(s, mes);
                      const periodos = subPeriodos(s).flatMap(p => {
                        if (p !== actual) return [p];
                        return toDateVal(mes) <= toDateVal(p.desde) ? [] : [{ desde: p.desde, hasta: mes }];
                      });
                      return { ...resto, cancelaciones: periodos };
                    }));
                    marcarGuardado('Suscripción reactivada', item.descripcion);
                  };

                  return (
                    <div key={item.id} className={`bg-white dark:bg-dark-normal border border-slate-200/70 dark:border-dark-lighter rounded-kk-2xl shadow-fluid shadow-fluid-hover p-3 sm:p-4 transition-all duration-500 ease-fluid hover:-translate-y-0.5 animate-row-enter ${cancelada ? 'opacity-70' : ''}`} style={{ animationDelay: `${Math.min(itemIdx, 10) * 35}ms` }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Sin relleno interior, igual que en el resumen: el logo
                              ocupa todo el cuadro y es su propio color el que lo
                              llena. Con p-1.5 quedaba encogido sobre un fondo
                              claro y las marcas se perdian. Los iconos de trazo
                              siguen centrados a su tamano. */}
                          <div className="relative bg-slate-100 dark:bg-slate-100 rounded-xl text-slate-500 dark:text-slate-400 overflow-hidden flex w-9 h-9 items-center justify-center flex-shrink-0">
                            {isCuota ? renderDebtIcon(item) : isSub ? renderSubscriptionIcon(item) : renderFixedIcon(item)}
                            {isCuota && item.bancoLogo && (
                              <img src={item.bancoLogo} alt={item.banco} className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 object-contain bg-white dark:bg-dark-normal rounded-full p-0.5 border border-slate-200 dark:border-dark-lightest" onError={(e) => { e.target.style.display = 'none'; }} />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => setViewingItem({ tipo: item.tipo, data: item })}>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-slate-800 dark:text-slate-200 text-sm leading-tight truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title={item.descripcion}>{item.descripcion}</span>
                              {item.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Legal</span>}
                              {isSub && <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><RefreshCw size={9} /> Sub</span>}
                              {cancelada && <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Cancelada</span>}
                              {isAbono && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">ABONO</span>}
                              {isCuota && item.tipoTarjeta && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${item.tipoTarjeta === 'visa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}`}>{item.tipoTarjeta.toUpperCase()}</span>}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight mt-0.5 truncate">
                              {isCuota ? (item.banco ? `${item.banco}` : `${item.mesInicio.split(' ')[0]}`) : isSub ? `Día ${item.diaPago || 1}` : isAbono ? 'Abono' : 'Fijo'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          {isSub && !cancelada && active && (
                            <button onClick={cancelarSuscripcion} aria-label={`Cancelar ${item.descripcion}`} title="Cancelar suscripción" className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-400 hover:text-amber-500 transition-colors"><Ban size={16} /></button>
                          )}
                          <button onClick={() => handleEditItem(item)} aria-label={`Editar ${item.descripcion}`} className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => {
                            const itemType = isCuota ? 'deuda' : isSub ? 'suscripción' : isAbono ? 'abono' : 'gasto fijo';
                            confirmDelete({
                              title: `¿Eliminar ${itemType}?`,
                              itemName: item.descripcion,
                              itemType: itemType,
                              onConfirm: async () => {
                                if (isCuota) setDeudas(deudas.filter(x => x.id !== item.id));
                                else if (isSub) setSuscripciones(suscripciones.filter(x => x.id !== item.id));
                                else if (isAbono) setAbonos(abonos.filter(x => x.id !== item.id));
                                else setGastosFijos(gastosFijos.filter(x => x.id !== item.id));
                                marcarGuardado('Eliminado', item.descripcion);
                                return Promise.resolve();
                              }
                            });
                          }} aria-label={`Eliminar ${item.descripcion}`} className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      {isCuota && (() => {
                        const pagadas = cuotaPagadas;
                        const totalCuotas = cuotaTotal;
                        const faltantes = totalCuotas - pagadas;
                        const pct = totalCuotas > 0 ? (pagadas / totalCuotas) * 100 : 0;
                        return (
                          <div className="flex items-center gap-2 mt-2.5">
                            <div className="flex-1 h-1.5 bg-slate-200/60 dark:bg-dark-lightest/60 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-slate-500 dark:text-slate-400 whitespace-nowrap">{pagadas}/{totalCuotas} · {faltantes} faltante{faltantes !== 1 ? 's' : ''}</span>
                          </div>
                        );
                      })()}

                      <div className="mt-3 rounded-xl border border-slate-100 dark:border-dark-lighter bg-slate-50/60 dark:bg-dark-lighter/20 p-2.5">
                        {cancelada ? (
                          <div className="flex items-center justify-between gap-2 py-0.5">
                            <span className="text-xs font-black text-rose-500 dark:text-rose-400">Cancelada desde {subPeriodoEn(item, mes)?.desde}</span>
                            <button type="button" onClick={reactivarSuscripcion} className="text-xs font-black uppercase tracking-tighter px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-dark-lightest text-slate-700 dark:text-slate-200 transition">Reactivar</button>
                          </div>
                        ) : !active ? (
                          <div className="text-center text-xs font-bold text-slate-300 dark:text-slate-600 py-1.5">No aplica en {mes}</div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={onTogglePagado}
                              className={`text-xs font-black uppercase tracking-tighter px-2.5 py-1.5 rounded-lg transition flex-shrink-0 ${isPagado ? 'bg-emerald-500 text-white shadow' : hasValue ? 'bg-slate-200 dark:bg-dark-lightest text-slate-700 dark:text-slate-200' : 'bg-slate-100 dark:bg-dark-normal text-slate-300 dark:text-slate-600'}`}
                            >
                              {isPagado ? 'Pagado' : 'Pendiente'}
                            </button>
                            {onChangeMonto ? (
                              <div className="relative flex-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                                <input
                                  type="text"
                                  placeholder="0"
                                  value={amount ? new Intl.NumberFormat('es-CL').format(amount) : ''}
                                  onChange={(e) => { const raw = e.target.value.replace(/[^0-9\-]/g, ''); onChangeMonto(parseInt(raw) || 0); }}
                                  className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-lg py-1.5 pl-6 pr-2 text-right font-mono font-black text-sm outline-none focus:border-indigo-400 dark:text-white transition"
                                />
                              </div>
                            ) : (
                              <span className="ml-auto font-mono font-black text-sm text-slate-700 dark:text-slate-200">{formatCurrency(amount)}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedGeneralItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 py-1.5 transition"
                      >
                        {isExpanded ? 'Ocultar año completo' : 'Ver año completo'}
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="grid grid-cols-3 gap-1.5 mt-1">
                          {filteredMonths.map(m => {
                            let mActive = true, mPagado = false, mAmount = 0;
                            if (isCuota) {
                              mActive = isMonthInRange(m, item.mesInicio, item.mesTermino, item.isContribuciones);
                              mPagado = item.pagos?.[m]?.estado === 'PAGADA';
                              mAmount = item.valorCuota;
                            } else if (isSub) {
                              mActive = item.activeMonths && item.activeMonths.includes(m) && !subCanceladaEn(item, m);
                              const pago = item.pagos?.[m] || { monto: 0, estado: 'PENDIENTE' };
                              mPagado = pago.estado === 'PAGADA';
                              mAmount = pago.monto || item.valor;
                            } else if (isAbono) {
                              const pago = item.pagos?.[m] || { monto: 0, estado: 'PENDIENTE' };
                              mPagado = pago.estado === 'PAGADA';
                              mAmount = pago.monto;
                            } else {
                              const pago = item.pagos?.[m] || { monto: 0, estado: 'PENDIENTE' };
                              mPagado = pago.estado === 'PAGADA';
                              mAmount = pago.monto;
                            }
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setDashboardMonth(m)}
                                className={`rounded-lg px-1.5 py-1.5 text-center transition ${!mActive ? 'opacity-25 bg-slate-50 dark:bg-dark-darker/20' : mPagado ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-dark-lightest text-slate-600 dark:text-slate-300'} ${m === mes ? 'ring-2 ring-indigo-400' : ''}`}
                              >
                                <div className="text-[9px] font-black uppercase opacity-70">{m.split(' ')[0].substring(0, 3)}</div>
                                <div className="text-[11px] font-mono font-black">{mActive ? formatCurrency(mAmount) : '—'}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )} {activeTab === 'ahorros' && (
          <div key="ahorros-tab" className={`space-y-8 ${tabAnim} px-4 sm:px-6 w-full max-w-5xl mx-auto`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
                  <PiggyBank className={theme.tabText} size={20} /> <span className="truncate">Cuentas de Ahorro</span>
                </h2>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={getSavingsPlan}
                  disabled={isAiLoading}
                  className={`flex items-center justify-center gap-2 flex-1 md:flex-initial ${theme.bgLight} ${theme.bgLightDark} ${theme.badgeText} dark:${theme.badgeTextDark} ${theme.borderAccent} ${theme.badgeBgDark} hover:opacity-80 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition disabled:opacity-50`}
                >
                  {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Lightbulb size={16} />}
                  <span className="hidden sm:inline">Estrategia IA</span><span className="sm:hidden">IA</span> ✨
                </button>
                <button onClick={() => setIsAddingAccount(true)} className={`flex items-center justify-center gap-2 flex-1 md:flex-initial ${theme.btnPrimary} text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg ${theme.shadowBtn} transition`}>
                  <Plus size={16} /> <span className="hidden sm:inline">Nueva Cuenta</span><span className="sm:hidden">Cuenta</span>
                </button>
              </div>
            </div>

            <MonthNav value={dashboardMonth} months={sortedMonths} years={availableYears} onChange={setDashboardMonth} />

            <div className={`${theme.btnPrimary} rounded-3xl shadow-xl p-4 sm:p-5 flex items-center justify-between gap-3`}>
              <span className="text-sm font-black uppercase tracking-wide text-white flex items-center gap-2">
                <TrendingUp size={16} /> <span className="hidden sm:inline">Ahorro Total Acumulado</span><span className="sm:hidden">Ahorro Total</span>
              </span>
              <span className="font-mono font-black text-lg text-white">{formatCurrency(totalAhorroMensual[dashboardMonth])}</span>
            </div>

            {cuentasAhorro.length === 0 ? (
              <div className="py-16 text-center text-slate-300 dark:text-slate-600 font-bold italic">Sin cuentas de ahorro</div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {cuentasAhorro.map((cuenta, cuentaIdx) => {
                  const mes = dashboardMonth;
                  const bi = getAhorroBankInfo(cuenta.banco);
                  const dep = ahorrosData[cuenta.id]?.[mes]?.deposito || 0;
                  const gas = ahorrosData[cuenta.id]?.[mes]?.gasto || 0;
                  const saldo = balancesPorCuenta[cuenta.id]?.[mes]?.acumulado;
                  const isExpanded = !!expandedAhorroCuentas[cuenta.id];
                  return (
                    <div key={cuenta.id} className="bg-white dark:bg-dark-normal border border-slate-200/70 dark:border-dark-lighter rounded-kk-2xl shadow-fluid shadow-fluid-hover p-3 sm:p-4 transition-all duration-500 ease-fluid hover:-translate-y-0.5 animate-row-enter" style={{ animationDelay: `${Math.min(cuentaIdx, 10) * 35}ms` }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {bi ? (
                            <img src={bi.logo} alt={cuenta.banco} className="w-10 h-7 object-contain flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0"><Building2 size={16} /></div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-sm truncate" style={{ color: THEME_COLOR_HEX[themeColor] || THEME_COLOR_HEX.indigo }}>{cuenta.banco} - {cuenta.nombre}</span>
                              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase">Ahorro</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          <button onClick={() => {
                            setNewAccount({ nombre: cuenta.nombre, banco: cuenta.banco });
                            setAccountBancoSearch('');
                            setEditingAccount(cuenta);
                            setIsAddingAccount(true);
                          }} aria-label={`Editar ${cuenta.nombre}`} className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-400 hover:text-emerald-500 transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => {
                            setCuentasAhorro(cuentasAhorro.filter(c => c.id !== cuenta.id));
                            const { [cuenta.id]: _, ...rest } = ahorrosData;
                            setAhorrosData(rest);
                            marcarGuardado('Cuenta eliminada', cuenta.nombre);
                          }} aria-label={`Eliminar ${cuenta.nombre}`} className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Depósito</label>
                          <div className="relative mt-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500 opacity-70">+$</span>
                            <input
                              type="text"
                              placeholder="0"
                              value={dep ? new Intl.NumberFormat('es-CL').format(dep) : ''}
                              onChange={(e) => { const raw = e.target.value.replace(/[^0-9\-]/g, ''); updateSavingData(cuenta.id, mes, 'deposito', parseInt(raw) || 0); }}
                              className="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-right font-mono font-black text-sm py-2 pl-7 pr-2.5 rounded-lg border-2 border-transparent focus:border-emerald-400 outline-none transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide flex items-center gap-1"><ArrowDownCircle size={11} /> Gasto / Retiro</label>
                          <div className="relative mt-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-rose-500 opacity-70">-$</span>
                            <input
                              type="text"
                              placeholder="0"
                              value={gas ? new Intl.NumberFormat('es-CL').format(gas) : ''}
                              onChange={(e) => { const raw = e.target.value.replace(/[^0-9\-]/g, ''); updateSavingData(cuenta.id, mes, 'gasto', parseInt(raw) || 0); }}
                              className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-right font-mono font-black text-sm py-2 pl-7 pr-2.5 rounded-lg border-2 border-transparent focus:border-rose-400 outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 px-0.5">
                        <span className="text-xs font-black uppercase text-slate-400">Saldo {mes}</span>
                        <span className="font-mono font-black text-sm text-slate-700 dark:text-slate-200">{formatCurrency(saldo)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedAhorroCuentas(prev => ({ ...prev, [cuenta.id]: !prev[cuenta.id] }))}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 py-1.5 transition"
                      >
                        {isExpanded ? 'Ocultar año completo' : 'Ver año completo'}
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="grid grid-cols-3 gap-1.5 mt-1">
                          {filteredMonths.map(m => {
                            const acc = balancesPorCuenta[cuenta.id]?.[m]?.acumulado;
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setDashboardMonth(m)}
                                className={`rounded-lg px-1.5 py-1.5 text-center transition bg-slate-100 dark:bg-dark-lightest text-slate-600 dark:text-slate-300 ${m === mes ? 'ring-2 ring-indigo-400' : ''}`}
                              >
                                <div className="text-[9px] font-black uppercase opacity-70">{m.split(' ')[0].substring(0, 3)}</div>
                                <div className="text-[11px] font-mono font-black">{formatCurrency(acc)}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className={activeTab === 'transacciones' ? tabAnim : undefined} style={{ display: activeTab === 'transacciones' ? 'block' : 'none' }}>
          <Transacciones
            user={user}
            token={token}
            theme={theme}
            isDarkMode={isDarkMode}
            categorias={categorias}
            gastosCats={gastosCats}
            ingresosCats={ingresosCats}
            onCreateCategoria={createCategoria}
            getCatStyle={getCatStyle}
            getCatBar={getCatBar}
            getCatIconBg={getCatIconBg}
            getCatIconColor={getCatIconColor}
            getCatText={getCatText}
            onOpenTutorial={onOpenTutorial}
            pendingAction={txAction}
            onActionHandled={() => setTxAction(null)}
            presupuestos={sueldos}
            onPasarACuotas={handlePasarACuotas}
            onPasarASuscripcion={handlePasarASuscripcion}
            refreshToken={txRefreshToken}
          />
        </div>

        <ProfileSheet
          open={perfilOpen}
          onClose={() => setPerfilOpen(false)}
          user={user}
          billing={billing}
          theme={theme}
          themeColor={themeColor}
          setThemeColor={(color) => { setThemeColor(color); localStorage.setItem('themeColor', color); }}
          isDarkMode={isDarkMode}
          onToggleDark={() => { const m = !isDarkMode; setIsDarkMode(m); applyDarkMode(m, { persist: true }); }}
          onOpenPlanes={() => setShowPlanes(true)}
          onOpenCategorias={() => setShowCategoriasConfig(true)}
          onRepetirTutorial={() => onOpenTutorial(false)}
          onOpenAdmin={onOpenAdmin}
          onRevisarCorreos={() => requestTxAction('revisar')}
          onReprocesar={() => requestTxAction('reprocesar')}
          onOpenFilters={() => setShowFilterRulesModal(true)}
          onOpenConfig={() => setShowConfigModal(true)}
          generateFinancialAdvice={generateFinancialAdvice}
          isAiLoading={isAiLoading}
          isPushSubscribed={isPushSubscribed}
          isPushLoading={isPushLoading}
          onToggleNotifications={onToggleNotifications}
          onLogout={onLogout}
        />

        <PlanesModal open={showPlanes} onClose={() => setShowPlanes(false)} token={token} theme={theme} billing={billing} onChanged={cargarBilling} />

        <ConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          token={token}
          theme={theme}
          onOpenTutorial={onOpenTutorial}
        />
        <FilterRulesModal
          isOpen={showFilterRulesModal}
          onClose={() => setShowFilterRulesModal(false)}
          token={token}
          theme={theme}
        /></>}

        {showCategoriasConfig && (
        <CategoriasConfig
          show={showCategoriasConfig}
          onClose={() => setShowCategoriasConfig(false)}
          categorias={categorias}
          onCreateCategoria={createCategoria}
          onUpdateCategoria={updateCategoria}
          onDeleteCategoria={deleteCategoria}
          onReorderCategorias={reorderCategorias}
          onReorderLocal={reorderCategoriasLocal}
          theme={theme}
          isDarkMode={isDarkMode}
          getCatStyle={getCatStyle}
        />
        )}

        {showPresupuestoModal && (
          <div
            className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
            onClick={() => setShowPresupuestoModal(false)}
          >
            <div
              className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-7 shadow-2xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl grid place-items-center flex-shrink-0 ${theme.bgLight} ${theme.bgLightDark}`}>
                    <Wallet className={theme.tabText} size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 leading-tight">Presupuesto del mes</h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 capitalize">{dashboardMonth}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPresupuestoModal(false)}
                  aria-label="Cerrar"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 -mr-1 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5">
                Es la plata con la que cuentas para <span className="font-bold text-slate-600 dark:text-slate-300 capitalize">{dashboardMonth}</span>.
                El Resumen parte de este monto, le suma tus abonos y le resta cuotas, gastos fijos y suscripciones
                para mostrarte cuánto te va quedando.
              </p>

              {dashboardMonth !== mesActual && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 px-3 py-2.5 mb-5">
                  <CalendarDays className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" size={15} />
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    Cada mes guarda su propio presupuesto. Estás editando <span className="capitalize">{dashboardMonth}</span>, no {mesActual.toLowerCase()}.
                  </p>
                </div>
              )}

              <form onSubmit={guardarPresupuesto}>
                <label htmlFor="presupuesto-input" className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Monto del mes
                </label>
                <div className="relative mb-5">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-black text-lg pointer-events-none">$</span>
                  <input
                    id="presupuesto-input"
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={presupuestoDraft ? new Intl.NumberFormat('es-CL').format(parseInt(presupuestoDraft, 10)) : ''}
                    onChange={(e) => setPresupuestoDraft(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 pr-4 py-3 text-right font-mono font-black text-lg text-slate-800 dark:text-slate-100 outline-none ${theme.focusBorder} transition`}
                  />
                </div>

                {(() => {
                  const mes = dashboardMonth;
                  const tot = totalesMensuales[mes] || { cuotas: 0, suscripciones: 0, abonos: 0 };
                  const gastosMes = resumenGastosMes.total_gastos || 0;
                  // Misma formula que el Disponible del Resumen: si cambia alla,
                  // esta vista previa deja de decir la verdad.
                  const comprometido = tot.cuotas + gastosMes + tot.suscripciones;
                  const monto = parseInt(presupuestoDraft, 10) || 0;
                  const restante = monto + tot.abonos - comprometido;
                  return (
                    <div className="rounded-2xl bg-slate-50 dark:bg-dark-lighter/40 border border-slate-100 dark:border-dark-lighter p-3.5 space-y-2 mb-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 dark:text-slate-500">Abonos del mes</span>
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">+{formatCurrency(tot.abonos)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400 dark:text-slate-500">Cuotas, gastos y suscripciones</span>
                        <span className="font-mono font-black text-slate-500 dark:text-slate-400">−{formatCurrency(comprometido)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-dark-lightest">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Te quedarían</span>
                        <span className={`font-mono font-black text-base ${restante >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                          {formatCurrency(restante)}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPresupuestoModal(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest transition active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`flex-[1.6] py-3 rounded-xl text-sm font-black text-white ${theme.btnPrimary} shadow-lg ${theme.shadowBtn} transition active:scale-95`}
                  >
                    Guardar presupuesto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddingDebt && (
          <Hoja
            onSubmit={handleSaveDebt}
            onClose={cerrarModalDeuda}
            icono={CreditCard}
            titulo={editingItem ? 'Editar cuota' : 'Nueva cuota'}
            subtitulo={cuotaDesdeTx ? `Desde pendientes · ${String(cuotaDesdeTx.fecha || '').slice(0, 10)}` : null}
            tono={`${theme.bgModalLight} ${theme.tabText}`}
            estiloFondo={animModal('deuda', !!cuotaDesdeTx).fondo}
            estiloTarjeta={animModal('deuda', !!cuotaDesdeTx).tarjeta}
            pie={<BotonesPie onCancel={cerrarModalDeuda} texto={editingItem ? 'Guardar cambios' : 'Guardar cuota'} clasesPrimario={`${theme.btnPrimary} ${theme.shadowBtn}`} />}
          >
            <div className={`rounded-3xl p-[18px] ${fondoDe(theme.btnPrimary)} text-white flex flex-col gap-3.5`}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-extrabold uppercase tracking-wider opacity-90">Valor de cada cuota</div>
                  <div className="text-4xl font-extrabold leading-tight mt-1 tabular-nums truncate">{formatCurrency(newDebt.valorCuota || 0)}</div>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1.5 rounded-full bg-white/20 whitespace-nowrap">{newDebt.cuotasTotales || 0} cuotas</span>
              </div>
              <div className="flex justify-between text-[13px] font-bold pt-3 border-t border-white/25">
                <span>{cuotaDesdeTx ? 'Total de la compra' : 'Total a pagar'}</span>
                <span className="tabular-nums">{formatCurrency(cuotaDesdeTx ? cuotaDesdeTx.monto : (newDebt.valorCuota || 0) * (newDebt.cuotasTotales || 0))}</span>
              </div>
            </div>

            <Grupo>
              <FilaCampo icono={Tag} etiqueta="Descripción" required value={newDebt.descripcion} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, descripcion: e.target.value })} placeholder="Ej: Notebook" />
              <div>
                <Fila icono={Hash} texto="Cuotas">
                  <Stepper
                    valor={newDebt.cuotasTotales || 0}
                    deshabilitado={newDebt.isContribuciones}
                    onMenos={() => cambiarCuotas((newDebt.cuotasTotales || 1) - 1)}
                    onMas={() => cambiarCuotas((newDebt.cuotasTotales || 0) + 1)}
                    etiquetaMenos="Una cuota menos"
                    etiquetaMas="Una cuota más"
                  />
                </Fila>
                {!newDebt.isContribuciones && (
                  <div className="flex gap-2 pl-[62px] pr-3.5 pb-3.5 -mt-1">
                    {[3, 6, 12, 24].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => cambiarCuotas(n)}
                        aria-pressed={newDebt.cuotasTotales === n}
                        className={`flex-1 h-[34px] rounded-full text-[13px] font-extrabold border transition active:scale-95 ${newDebt.cuotasTotales === n ? `${fondoDe(theme.btnPrimary)} border-transparent text-white` : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <FilaCampo icono={CircleDollarSign} etiqueta="Valor cuota" type="number" inputMode="numeric" required value={newDebt.valorCuota} onChange={e => setNewDebt({ ...newDebt, valorCuota: parseInt(e.target.value) })} />
            </Grupo>

            <Grupo>
              <Fila icono={CalendarDays} texto="Primera cuota">
                <Pastilla type="month" required value={monthStrToMonthInput(newDebt.mesInicio)} onChange={handleMesInicioChange} aria-label="Mes de la primera cuota" style={{ width: 176 }} />
              </Fila>
              <Fila icono={Clock} texto="Día de pago">
                <Pastilla type="number" inputMode="numeric" min="1" max="31" value={newDebt.diaPago} onChange={e => setNewDebt({ ...newDebt, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} aria-label="Día de pago" style={{ width: 72 }} />
              </Fila>
              <FilaInterruptor icono={RefreshCw} texto="Facturación automática" detalle="Se marca pagada cada mes" activo={!!newDebt.facturacionAuto} onChange={v => setNewDebt({ ...newDebt, facturacionAuto: v })} colorActivo={fondoDe(theme.btnPrimary)} />
              <FilaInterruptor icono={ShieldCheck} texto="Contribución legal" detalle="Solo 4 cuotas fijas al año" activo={!!newDebt.isContribuciones} onChange={v => handleContribucionesChange({ target: { checked: v } })} colorActivo={fondoDe(theme.btnPrimary)} />
            </Grupo>

            <Seccion titulo="Banco y tarjeta">
              <SelectorBanco
                bancos={filtrarBancos(BANCOS_CHILE, bancoSearch)}
                busqueda={bancoSearch}
                onBuscar={setBancoSearch}
                seleccionado={newDebt.banco}
                onElegir={b => setNewDebt({ ...newDebt, banco: b.nombre, bancoLogo: b.logo, tipoTarjeta: b.tipos.includes('visa') ? 'visa' : 'mastercard' })}
              />
              {newDebt.banco && (
                <Segmentado opciones={[{ valor: 'visa', texto: 'Visa' }, { valor: 'mastercard', texto: 'Mastercard' }]} valor={newDebt.tipoTarjeta} onChange={v => setNewDebt({ ...newDebt, tipoTarjeta: v })} />
              )}
            </Seccion>

            <Seccion titulo="Icono (opcional)">

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2">
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'default' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newDebt.iconType === 'default' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Por defecto</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newDebt.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                    <button type="button" onClick={() => { setNewDebt({ ...newDebt, iconType: 'chile_preset', iconValue: 'bancos:banco_de_chile' }); setDebtChileCat('bancos'); }} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newDebt.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newDebt.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                  </div>

                  {newDebt.iconType === 'preset' && (
                    <div>
                      <div className="relative mb-2 sm:mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          value={debtIconSearch}
                          onChange={(e) => setDebtIconSearch(e.target.value)}
                          className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`}
                          placeholder="Buscar icono..."
                        />
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredDebtIcons.length > 0 ? filteredDebtIcons.map(i => (
                          <button type="button" key={i.id} onClick={() => setNewDebt({ ...newDebt, iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition ${newDebt.iconValue === i.id ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <i.icon size={16} />
                            <span className="text-[11px] sm:text-xs font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        )) : (
                          <div className="col-span-5 sm:col-span-6 text-center py-3 sm:py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                        )}
                      </div>
                    </div>
                  )}

                  {newDebt.iconType === 'chile_preset' && (
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {['bancos', 'tarjetas'].map(cat => (
                          <button key={cat} type="button" onClick={() => setDebtChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-xs sm:text-xs font-black border-2 transition ${debtChileCat === cat ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {CHILE_PRESET_ICONS[debtChileCat]?.map(i => {
                          const val = `${debtChileCat}:${i.id}`;
                          return (
                            <button key={i.id} type="button" onClick={() => setNewDebt({ ...newDebt, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition ${newDebt.iconValue === val ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                              <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                              <span className="text-[11px] sm:text-xs font-bold leading-none truncate w-full text-center">{i.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {newDebt.iconType === 'url' && (
                    <input value={newDebt.iconUrl} onChange={e => setNewDebt({ ...newDebt, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  )}
                
            </Seccion>
          </Hoja>
        )}

        {isAddingFixed && (
          <Hoja
            onSubmit={handleSaveFixed}
            onClose={cerrarModalFijo}
            icono={Receipt}
            titulo={editingItem ? 'Editar gasto fijo' : 'Nuevo gasto fijo'}
            tono="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200"
            estiloFondo={animModal('fijo', false).fondo}
            estiloTarjeta={animModal('fijo', false).tarjeta}
            pie={<BotonesPie onCancel={cerrarModalFijo} texto={editingItem ? 'Guardar cambios' : 'Guardar gasto'} clasesPrimario={`${theme.btnFixed} ${theme.shadowBtn}`} />}
          >
            <div className={`rounded-3xl p-[18px] ${fondoDe(theme.btnFixed)} text-white flex items-center gap-3.5`}>
              <span className="w-14 h-14 rounded-[18px] bg-white/15 grid place-items-center flex-shrink-0 overflow-hidden">
                {newFixed.bancoLogo
                  ? <span className="w-10 h-10 rounded-xl bg-white grid place-items-center"><img src={newFixed.bancoLogo} alt="" className="w-8 h-8 object-contain" /></span>
                  : <Receipt size={24} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-extrabold truncate">{newFixed.descripcion || 'Nuevo gasto fijo'}</div>
                <div className="text-[13px] font-bold opacity-80 truncate">Se paga el día {newFixed.diaPago || 1}{newFixed.banco ? ` · ${newFixed.banco}` : ''}</div>
              </div>
              {newFixed.facturacionAuto && <span className="text-xs font-extrabold px-2.5 py-1.5 rounded-full bg-white/20 whitespace-nowrap">Automático</span>}
            </div>

            <Grupo>
              <FilaCampo icono={Tag} etiqueta="Descripción" required value={newFixed.descripcion} onChange={e => setNewFixed({ ...newFixed, descripcion: e.target.value })} placeholder="Ej: Luz, Internet" />
              <Fila icono={Clock} texto="Día de pago">
                <Pastilla type="number" inputMode="numeric" min="1" max="31" value={newFixed.diaPago} onChange={e => setNewFixed({ ...newFixed, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} aria-label="Día de pago" style={{ width: 72 }} />
              </Fila>
              <FilaInterruptor icono={RefreshCw} texto="Facturación automática" detalle="Se marca pagado cada mes" activo={!!newFixed.facturacionAuto} onChange={v => setNewFixed({ ...newFixed, facturacionAuto: v })} colorActivo={fondoDe(theme.btnFixed)} />
            </Grupo>

            <Seccion titulo="Banco y tarjeta">
              <SelectorBanco
                bancos={filtrarBancos(BANCOS_CHILE, fixedBancoSearch)}
                busqueda={fixedBancoSearch}
                onBuscar={setFixedBancoSearch}
                seleccionado={newFixed.banco}
                onElegir={b => setNewFixed({ ...newFixed, banco: b.nombre, bancoLogo: b.logo, tipoTarjeta: b.tipos.includes('visa') ? 'visa' : 'mastercard' })}
              />
              {newFixed.banco && (
                <Segmentado opciones={[{ valor: 'visa', texto: 'Visa' }, { valor: 'mastercard', texto: 'Mastercard' }]} valor={newFixed.tipoTarjeta} onChange={v => setNewFixed({ ...newFixed, tipoTarjeta: v })} />
              )}
            </Seccion>

            <Seccion titulo="Icono">
              <div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newFixed.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                  <button type="button" onClick={() => { setNewFixed({ ...newFixed, iconType: 'chile_preset', iconValue: 'agua:aguas_andinas' }); setFixedChileCat('agua'); }} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newFixed.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newFixed.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                </div>

                {newFixed.iconType === 'preset' && (
                  <div>
                    <div className="relative mb-2 sm:mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={fixedIconSearch}
                        onChange={(e) => setFixedIconSearch(e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`}
                        placeholder="Buscar icono..."
                      />
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredFixedIcons.length > 0 ? filteredFixedIcons.map(i => (
                        <button type="button" key={i.id} onClick={() => setNewFixed({ ...newFixed, iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition ${newFixed.iconValue === i.id ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                          <i.icon size={16} />
                          <span className="text-[11px] sm:text-xs font-bold leading-none truncate w-full text-center">{i.label}</span>
                        </button>
                      )) : (
                        <div className="col-span-5 sm:col-span-6 text-center py-3 sm:py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                      )}
                    </div>
                  </div>
                )}

                {newFixed.iconType === 'chile_preset' && (
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['agua', 'gas', 'telefonia', 'isapres', 'afp', 'tickets', 'bancos'].map(cat => (
                        <button key={cat} type="button" onClick={() => setFixedChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-xs sm:text-xs font-black border-2 transition ${fixedChileCat === cat ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {CHILE_PRESET_ICONS[fixedChileCat]?.map(i => {
                        const val = `${fixedChileCat}:${i.id}`;
                        return (
                          <button key={i.id} type="button" onClick={() => setNewFixed({ ...newFixed, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition ${newFixed.iconValue === val ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                            <span className="text-[11px] sm:text-xs font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {newFixed.iconType === 'url' && (
                  <div>
                    <label className="text-xs sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">URL del Logo (PNG/SVG)</label>
                    <input value={newFixed.iconUrl} onChange={e => setNewFixed({ ...newFixed, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  </div>
                )}
              </div>
            </Seccion>
          </Hoja>
        )}

        {isAddingAbono && (
          <Hoja
            onSubmit={handleSaveAbono}
            onClose={cerrarModalAbono}
            icono={TrendingUp}
            titulo={editingItem && editingItem.tipo === 'abono' ? 'Editar abono' : 'Nuevo abono'}
            tono={`${theme.bgModalLight} ${theme.tabText}`}
            estiloFondo={animModal('abono', false).fondo}
            estiloTarjeta={animModal('abono', false).tarjeta}
            pie={<BotonesPie onCancel={cerrarModalAbono} texto={editingItem && editingItem.tipo === 'abono' ? 'Guardar cambios' : 'Guardar abono'} clasesPrimario={`${theme.btnPrimary} ${theme.shadowBtn}`} />}
          >
            <div className={`rounded-3xl p-[18px] ${fondoDe(theme.btnPrimary)} text-white flex items-center gap-3.5`}>
              <span className="w-14 h-14 rounded-[18px] bg-white/20 grid place-items-center flex-shrink-0"><TrendingUp size={24} /></span>
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-extrabold truncate">{newAbono.descripcion || 'Nuevo abono'}</div>
                <div className="text-[13px] font-bold opacity-90">Llega el día {newAbono.diaPago || 1}</div>
              </div>
              {newAbono.facturacionAuto && <span className="text-xs font-extrabold px-2.5 py-1.5 rounded-full bg-white/20 whitespace-nowrap">Automático</span>}
            </div>

            <Grupo>
              <FilaCampo icono={Tag} etiqueta="Descripción" required value={newAbono.descripcion} onChange={e => setNewAbono({ ...newAbono, descripcion: e.target.value })} placeholder="Ej: Freelance" />
              <Fila icono={Clock} texto="Día de pago">
                <Pastilla type="number" inputMode="numeric" min="1" max="31" value={newAbono.diaPago} onChange={e => setNewAbono({ ...newAbono, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} aria-label="Día de pago" style={{ width: 72 }} />
              </Fila>
              <FilaInterruptor icono={RefreshCw} texto="Automático" detalle="Se marca recibido cada mes" activo={!!newAbono.facturacionAuto} onChange={v => setNewAbono({ ...newAbono, facturacionAuto: v })} colorActivo={fondoDe(theme.btnPrimary)} />
            </Grupo>

            <Seccion titulo="Icono">
              <div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                  <button type="button" onClick={() => setNewAbono({ ...newAbono, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newAbono.iconType === 'preset' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                  <button type="button" onClick={() => { setNewAbono({ ...newAbono, iconType: 'chile_preset', iconValue: 'agua:aguas_andinas' }); setAbonoChileCat('agua'); }} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newAbono.iconType === 'chile_preset' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                  <button type="button" onClick={() => setNewAbono({ ...newAbono, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newAbono.iconType === 'url' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                </div>

                {newAbono.iconType === 'preset' && (
                  <div>
                    <div className="relative mb-2 sm:mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={abonoIconSearch}
                        onChange={(e) => setAbonoIconSearch(e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`}
                        placeholder="Buscar icono..."
                      />
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredAbonoIcons.length > 0 ? filteredAbonoIcons.map(i => (
                        <button type="button" key={i.id} onClick={() => setNewAbono({ ...newAbono, iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition ${newAbono.iconValue === i.id ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                          <i.icon size={16} />
                          <span className="text-[11px] sm:text-xs font-bold leading-none truncate w-full text-center">{i.label}</span>
                        </button>
                      )) : (
                        <div className="col-span-5 sm:col-span-6 text-center py-3 sm:py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                      )}
                    </div>
                  </div>
                )}

                {newAbono.iconType === 'chile_preset' && (
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['agua', 'gas', 'telefonia', 'isapres', 'afp', 'tickets', 'bancos'].map(cat => (
                        <button key={cat} type="button" onClick={() => setAbonoChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-xs sm:text-xs font-black border-2 transition ${abonoChileCat === cat ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {CHILE_PRESET_ICONS[abonoChileCat]?.map(i => {
                        const val = `${abonoChileCat}:${i.id}`;
                        return (
                          <button key={i.id} type="button" onClick={() => setNewAbono({ ...newAbono, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition ${newAbono.iconValue === val ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                            <span className="text-[11px] sm:text-xs font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {newAbono.iconType === 'url' && (
                  <div>
                    <label className="text-xs sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">URL del Logo (PNG/SVG)</label>
                    <input value={newAbono.iconUrl} onChange={e => setNewAbono({ ...newAbono, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  </div>
                )}
              </div>
            </Seccion>
          </Hoja>
        )}

        {isAddingAccount && (
          <Hoja
            onSubmit={handleSaveAccount}
            onClose={cerrarModalCuenta}
            icono={PiggyBank}
            titulo={editingAccount ? 'Editar cuenta de ahorro' : 'Nueva cuenta de ahorro'}
            tono="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            estiloFondo={animModal('cuenta', false).fondo}
            estiloTarjeta={animModal('cuenta', false).tarjeta}
            pie={<BotonesPie onCancel={cerrarModalCuenta} texto={editingAccount ? 'Guardar cambios' : 'Crear cuenta'} clasesPrimario="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30" />}
          >
            <div className="rounded-3xl p-[18px] bg-emerald-600 text-white flex items-center gap-3.5">
              <span className="w-14 h-14 rounded-[18px] bg-white grid place-items-center flex-shrink-0 overflow-hidden">
                {newAccount.banco && getAhorroBankInfo(newAccount.banco)?.logo
                  ? <img src={getAhorroBankInfo(newAccount.banco).logo} alt="" className="w-10 h-10 object-contain" />
                  : <PiggyBank size={24} className="text-emerald-600" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-extrabold truncate">{newAccount.nombre || 'Nueva cuenta'}</div>
                <div className="text-[13px] font-bold opacity-90 truncate">{newAccount.banco || 'Elige la institución'}</div>
              </div>
            </div>

            <Grupo>
              <FilaCampo icono={Tag} etiqueta="Nombre" required value={newAccount.nombre} onChange={e => setNewAccount({ ...newAccount, nombre: e.target.value })} placeholder="Ej: Vacaciones" />
            </Grupo>

            <Seccion titulo="Institución financiera">
              <SelectorBanco
                bancos={filtrarBancos(BANCOS_CHILE, accountBancoSearch)}
                busqueda={accountBancoSearch}
                onBuscar={setAccountBancoSearch}
                seleccionado={newAccount.banco}
                onElegir={b => setNewAccount({ ...newAccount, banco: b.nombre })}
              />
            </Seccion>
          </Hoja>
        )}

        {isAddingSub && (
          <Hoja
            onSubmit={handleSaveSubscription}
            onClose={cerrarModalSub}
            icono={RefreshCw}
            titulo={editingItem?.tipo === 'suscripcion' ? 'Editar suscripción' : 'Nueva suscripción'}
            subtitulo={subDesdeTx ? `Desde pendientes · ${String(subDesdeTx.fecha || '').slice(0, 10)} · ${formatCurrency(subDesdeTx.monto)}` : null}
            tono={`${theme.bgModalLight} ${theme.tabText}`}
            estiloFondo={animModal('suscripcion', !!subDesdeTx).fondo}
            estiloTarjeta={animModal('suscripcion', !!subDesdeTx).tarjeta}
            pie={<BotonesPie onCancel={cerrarModalSub} texto={editingItem?.tipo === 'suscripcion' ? 'Guardar cambios' : 'Guardar suscripción'} clasesPrimario={`${theme.btnSub} ${theme.shadowBtn}`} />}
          >
            <div className={`rounded-3xl p-[18px] ${fondoDe(theme.btnSub)} text-white flex items-center gap-3.5`}>
              <span className="w-14 h-14 rounded-[18px] bg-white/20 grid place-items-center text-2xl font-extrabold flex-shrink-0">
                {(newSub.descripcion || '?').trim().charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-extrabold truncate">{newSub.descripcion || 'Nueva suscripción'}</div>
                <div className="text-[13px] font-bold opacity-90">Cobro el día {newSub.diaPago || 1}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[26px] font-extrabold leading-tight tabular-nums">{formatCurrency(newSub.valor || 0)}</div>
                <div className="text-xs font-extrabold opacity-90">{newSub.billingCycle === 'anual' ? 'al año' : 'al mes'}</div>
              </div>
            </div>

            <Segmentado opciones={[{ valor: 'mensual', texto: 'Mensual' }, { valor: 'anual', texto: 'Anual' }]} valor={newSub.billingCycle} onChange={v => setNewSub({ ...newSub, billingCycle: v })} />

            <Grupo>
              <FilaCampo icono={Tv} etiqueta="Servicio" required value={newSub.descripcion} onChange={e => setNewSub({ ...newSub, descripcion: e.target.value })} placeholder="Ej: Netflix" />
              <FilaCampo icono={CircleDollarSign} etiqueta="Valor" type="number" inputMode="numeric" required value={newSub.valor} onChange={e => setNewSub({ ...newSub, valor: parseInt(e.target.value) || 0 })} placeholder="Monto" />
              <Fila icono={CalendarDays} texto="Desde">
                <Pastilla type="month" required value={monthStrToMonthInput(newSub.mesInicio)} onChange={e => setNewSub({ ...newSub, mesInicio: monthInputToMonthStr(e.target.value) })} aria-label="Mes de inicio" style={{ width: 176 }} />
              </Fila>
              <Fila icono={Clock} texto="Día de cobro">
                <Pastilla type="number" inputMode="numeric" min="1" max="31" required value={newSub.diaPago} onChange={e => setNewSub({ ...newSub, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} aria-label="Día de cobro" style={{ width: 72 }} />
              </Fila>
              <Fila icono={Hourglass} texto="Duración">
                <Stepper
                  valor={newSub.durationYears || 1}
                  texto={`${newSub.durationYears || 1} ${(newSub.durationYears || 1) === 1 ? 'año' : 'años'}`}
                  onMenos={() => setNewSub({ ...newSub, durationYears: Math.max(1, (newSub.durationYears || 1) - 1) })}
                  onMas={() => setNewSub({ ...newSub, durationYears: Math.min(6, (newSub.durationYears || 1) + 1) })}
                  etiquetaMenos="Un año menos"
                  etiquetaMas="Un año más"
                />
              </Fila>
              <FilaInterruptor icono={RefreshCw} texto="Facturación automática" detalle="Se marca pagada en cada cobro" activo={!!newSub.facturacionAuto} onChange={v => setNewSub({ ...newSub, facturacionAuto: v })} colorActivo={fondoDe(theme.btnSub)} />
            </Grupo>

            <Seccion titulo="Se cobra en">
              <SelectorBanco
                bancos={filtrarBancos(BANCOS_CHILE, subBancoSearch)}
                busqueda={subBancoSearch}
                onBuscar={setSubBancoSearch}
                seleccionado={newSub.banco}
                onElegir={b => setNewSub({ ...newSub, banco: b.nombre, bancoLogo: b.logo, tipoTarjeta: b.tipos.includes('visa') ? 'visa' : 'mastercard' })}
              />
              {newSub.banco && (
                <Segmentado opciones={[{ valor: 'visa', texto: 'Visa' }, { valor: 'mastercard', texto: 'Mastercard' }]} valor={newSub.tipoTarjeta} onChange={v => setNewSub({ ...newSub, tipoTarjeta: v })} />
              )}
            </Seccion>

            <Seccion titulo="Icono">

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                    <button type="button" onClick={() => setNewSub({ ...newSub, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newSub.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                    <button type="button" onClick={() => { setNewSub({ ...newSub, iconType: 'chile_preset', iconValue: 'medios-pago:webpay' }); setSubChileCat('medios-pago'); }} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newSub.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                    <button type="button" onClick={() => setNewSub({ ...newSub, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs font-black border-2 transition ${newSub.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                  </div>

                  {newSub.iconType === 'preset' && (
                    <div>
                      <div className="relative mb-2 sm:mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          value={subscriptionIconSearch}
                          onChange={(e) => setSubscriptionIconSearch(e.target.value)}
                          className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200`}
                          placeholder="Buscar icono..."
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2 max-h-28 sm:max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredSubscriptionIcons.length > 0 ? filteredSubscriptionIcons.map(i => (
                          <button type="button" key={i.id} onClick={() => setNewSub({ ...newSub, iconType: 'preset', iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition ${newSub.iconValue === i.id && newSub.iconType === 'preset' ? `${theme.borderAccent} ${theme.btnSub} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <i.icon size={14} />
                            <span className="text-[11px] sm:text-[11px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        )) : (
                          <div className="col-span-5 text-center py-3 sm:py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                        )}
                      </div>
                    </div>
                  )}

                  {newSub.iconType === 'chile_preset' && (
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {['medios-pago', 'telefonia', 'tickets'].map(cat => (
                          <button key={cat} type="button" onClick={() => setSubChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-xs sm:text-xs font-black border-2 transition ${subChileCat === cat ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-28 sm:max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                        {CHILE_PRESET_ICONS[subChileCat]?.map(i => {
                          const val = `${subChileCat}:${i.id}`;
                          return (
                            <button key={i.id} type="button" onClick={() => setNewSub({ ...newSub, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition ${newSub.iconValue === val && newSub.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.btnSub} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                              <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                              <span className="text-[11px] sm:text-[11px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {newSub.iconType === 'url' && (
                    <input value={newSub.iconUrl} onChange={e => setNewSub({ ...newSub, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition dark:text-slate-200 mt-2`} placeholder="https://ejemplo.com/logo.png" />
                  )}
                
            </Seccion>
          </Hoja>
        )}

        {viewingItem && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 pb-16 md:pb-8 shadow-2xl animate-scale-in max-h-[90dvh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  {viewingItem.tipo === 'cuota' ? <CreditCard className={theme.tabText} size={20} /> : viewingItem.tipo === 'suscripcion' ? <RefreshCw className={theme.tabText} size={20} /> : viewingItem.tipo === 'abono' ? <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} /> : <Receipt className="text-slate-800 dark:text-slate-200" size={20} />}
                  Detalles
                </h3>
                <button onClick={() => setViewingItem(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-slate-100 dark:bg-slate-100 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden text-slate-500">
                    {viewingItem.tipo === 'cuota' ? (
                      viewingItem.data.bancoLogo ? <img src={viewingItem.data.bancoLogo} alt={viewingItem.data.banco} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} /> : renderDebtIcon(viewingItem.data)
                    ) : viewingItem.tipo === 'suscripcion' ? renderSubscriptionIcon(viewingItem.data) : renderFixedIcon(viewingItem.data)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.descripcion}</h4>
                    {viewingItem.data.banco && <p className="text-xs text-slate-500">{viewingItem.data.banco} {viewingItem.data.tipoTarjeta && `- ${viewingItem.data.tipoTarjeta.toUpperCase()}`}</p>}
                  </div>
                </div>

                {viewingItem.tipo === 'cuota' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Cuotas Totales</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.cuotasTotales}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Valor Cuota</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{formatCurrency(viewingItem.data.valorCuota)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Mes Inicio</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.mesInicio}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Día de Pago</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">Día {viewingItem.data.diaPago || 1}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase">Progreso</span>
                      {(() => {
                        const mesTermino = calculateEndDate(viewingItem.data.mesInicio, viewingItem.data.cuotasTotales, viewingItem.data.isContribuciones);
                        let cur = toDateVal(viewingItem.data.mesInicio);
                        const end = toDateVal(mesTermino);
                        let pagadas = 0;
                        while (cur <= end) {
                          const mName = fromDateVal(cur);
                          if (!viewingItem.data.isContribuciones || ['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(mName.split(' ')[0])) {
                            if (viewingItem.data.pagos?.[mName]?.estado === 'PAGADA') pagadas++;
                          }
                          cur++;
                        }
                        const totalCuotas = viewingItem.data.cuotasTotales;
                        const faltantes = totalCuotas - pagadas;
                        const pct = totalCuotas > 0 ? (pagadas / totalCuotas) * 100 : 0;
                        return (
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{pagadas}/{totalCuotas} pagadas</span>
                              <span className="text-xs font-bold text-slate-400">{faltantes} faltante{faltantes !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200/60 dark:bg-dark-lightest/60 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    {viewingItem.data.banco && (
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Banco / Institución</span>
                        <div className="flex items-center gap-2 mt-1">
                          {viewingItem.data.bancoLogo && <img src={viewingItem.data.bancoLogo} alt={viewingItem.data.banco} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />}
                          <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.banco} {viewingItem.data.tipoTarjeta && `- ${viewingItem.data.tipoTarjeta.toUpperCase()}`}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className={`w-11 h-6 rounded-full relative transition-colors ${viewingItem.data.facturacionAuto ? 'bg-blue-600' : 'bg-slate-300 dark:bg-dark-lightest'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${viewingItem.data.facturacionAuto ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                      </div>
                      <span className="text-xs sm:text-xs font-bold text-blue-800 dark:text-blue-200">
                        {viewingItem.data.facturacionAuto ? 'Facturación Automática Activada' : 'Sin Facturación Automática'}
                      </span>
                    </div>
                  </>
                )}

                {viewingItem.tipo === 'suscripcion' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Valor</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{formatCurrency(viewingItem.data.valor)}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Ciclo</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.billingCycle === 'mensual' ? 'Mensual' : 'Anual'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase">Día de Pago</span>
                      <p className="font-black text-slate-800 dark:text-slate-200">Día {viewingItem.data.diaPago || 1}</p>
                    </div>
                    {viewingItem.data.banco && (
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Banco / Institución</span>
                        <div className="flex items-center gap-2 mt-1">
                          {viewingItem.data.bancoLogo && <img src={viewingItem.data.bancoLogo} alt={viewingItem.data.banco} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />}
                          <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.banco} {viewingItem.data.tipoTarjeta && `- ${viewingItem.data.tipoTarjeta.toUpperCase()}`}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className={`w-11 h-6 rounded-full relative transition-colors ${viewingItem.data.facturacionAuto ? 'bg-blue-600' : 'bg-slate-300 dark:bg-dark-lightest'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${viewingItem.data.facturacionAuto ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                      </div>
                      <span className="text-xs sm:text-xs font-bold text-blue-800 dark:text-blue-200">
                        {viewingItem.data.facturacionAuto ? 'Facturación Automática Activada' : 'Sin Facturación Automática'}
                      </span>
                    </div>
                  </>
                )}

                {(viewingItem.tipo === 'fijo' || viewingItem.tipo === 'abono') && (
                  <>
                    <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase">Día de Pago</span>
                      <p className="font-black text-slate-800 dark:text-slate-200">Día {viewingItem.data.diaPago || 1}</p>
                    </div>
                    {viewingItem.data.banco && (
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase">Banco / Institución</span>
                        <div className="flex items-center gap-2 mt-1">
                          {viewingItem.data.bancoLogo && <img src={viewingItem.data.bancoLogo} alt={viewingItem.data.banco} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />}
                          <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.banco} {viewingItem.data.tipoTarjeta && `- ${viewingItem.data.tipoTarjeta.toUpperCase()}`}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <div className={`w-11 h-6 rounded-full relative transition-colors ${viewingItem.data.facturacionAuto ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-dark-lightest'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${viewingItem.data.facturacionAuto ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                      </div>
                      <span className="text-xs sm:text-xs font-bold text-emerald-800 dark:text-emerald-200">
                        {viewingItem.data.facturacionAuto ? 'Automático' : 'Manual'}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex gap-2 mt-6">
                  <button onClick={() => { setViewingItem(null); handleEditItem(viewingItem.data); }} className={`flex-1 ${theme.btnPrimary} text-white py-2.5 sm:py-3 rounded-xl font-black text-sm shadow-lg ${theme.shadowBtn} hover:opacity-90 transition`}>
                    Editar
                  </button>
                  <button onClick={() => setViewingItem(null)} className="flex-1 bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-slate-300 py-2.5 sm:py-3 rounded-xl font-black text-sm hover:bg-slate-200 dark:hover:bg-dark-lightest transition">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={deleteModal.onConfirm}
          title={deleteModal.title}
          itemName={deleteModal.itemName}
          itemType={deleteModal.itemType}
          message={deleteModal.message}
          isDeleting={isDeleting}
        />
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default Dashboard;
