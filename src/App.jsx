import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  X,
  CreditCard,
  Droplets,
  Zap,
  Wifi,
  Wallet,
  ArrowUpCircle,
  LayoutDashboard,
  Receipt,
  Pencil,
  FileText,
  PiggyBank,
  ArrowDownCircle,
  Building2,
  ListChecks,
  Settings2,
  ImageIcon,
  Sparkles,
  BrainCircuit,
  Lightbulb,
  Loader2,
  ChevronRight,
  TrendingUp,
  MinusCircle,
  Moon,
  Sun,
  LogOut,
  Users,
  User,
  Search,
  Car,
  Phone,
  Shield,
  Heart,
  GraduationCap,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Coffee,
  Home,
  Monitor,
  Smartphone,
  Tv,
  Gamepad2,
  Plane,
  Dumbbell,
  Stethoscope,
  Baby,
  Gift,
  Scissors,
  Fuel,
  ParkingCircle,
  Bus,
  Train,
  Landmark,
  CreditCard as CreditCardIcon,
  DollarSign,
  Coins,
  Banknote,
  Percent,
  Calculator,
  ClipboardList,
  ClipboardCheck,
  BookOpen,
  BookMarked,
  Laptop,
  Printer,
  Key,
  Lock,
  Mail,
  Send,
  Package,
  Box,
  Truck,
  Store,
  Tag,
  Gift as GiftTag,
  Music,
  Film,
  Camera,
  Palette,
  PenTool,
  Briefcase,
  Hammer,
  Wrench,
  Ruler,
  Paintbrush,
  Flame,
  Wind,
  Thermometer,
  Cloud,
  Sun as SunIcon,
  Trees,
  Leaf,
  Pizza,
  CakeSlice,
  Beer,
  Wine,
  Candy,
  IceCream,
  Apple,
  Salad,
  Sandwich,
  Soup
} from 'lucide-react';
import Login from './Login.jsx';
import Register from './Register.jsx';
import AdminPanel from './AdminPanel.jsx';

const apiKey = "";

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const INITIAL_MONTHS = [
  'Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026',
  'Julio 2026', 'Agosto 2026', 'Septiembre 2026', 'Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'
];

const PRESET_ICONS = [
  { id: 'zap', icon: Zap, label: 'Luz', keywords: 'luz electricidad energia luz' },
  { id: 'droplets', icon: Droplets, label: 'Agua', keywords: 'agua gas agua' },
  { id: 'wifi', icon: Wifi, label: 'Internet', keywords: 'internet wifi red conexion' },
  { id: 'receipt', icon: Receipt, label: 'Gastos', keywords: 'gastos recibo factura' },
  { id: 'building', icon: Building2, label: 'GC', keywords: 'gastos comunes edificio condominio gc' },
  { id: 'layout', icon: LayoutDashboard, label: 'Otro', keywords: 'otro general varios' },
  { id: 'car', icon: Car, label: 'Auto', keywords: 'auto auto vehiculo transporte' },
  { id: 'phone', icon: Phone, label: 'Telefono', keywords: 'telefono celular movil' },
  { id: 'shield', icon: Shield, label: 'Seguro', keywords: 'seguro seguro proteccion' },
  { id: 'heart', icon: Heart, label: 'Salud', keywords: 'salud medico doctor salud' },
  { id: 'graduation-cap', icon: GraduationCap, label: 'Educacion', keywords: 'educacion estudio colegio universidad' },
  { id: 'shopping-bag', icon: ShoppingBag, label: 'Compras', keywords: 'compras tienda compras ropa' },
  { id: 'shopping-cart', icon: ShoppingCart, label: 'Supermercado', keywords: 'supermercado compras mercado' },
  { id: 'utensils', icon: Utensils, label: 'Restaurante', keywords: 'restaurante comida comer restaurante' },
  { id: 'coffee', icon: Coffee, label: 'Cafe', keywords: 'cafe desayuno cafe' },
  { id: 'home', icon: Home, label: 'Casa', keywords: 'casa hogar vivienda arriendo' },
  { id: 'monitor', icon: Monitor, label: 'Computador', keywords: 'computador pc monitor tecnologia' },
  { id: 'smartphone', icon: Smartphone, label: 'Celular', keywords: 'celular smartphone telefono' },
  { id: 'tv', icon: Tv, label: 'TV Cable', keywords: 'tv television cable streaming' },
  { id: 'gamepad-2', icon: Gamepad2, label: 'Gaming', keywords: 'gaming juegos entretenimiento' },
  { id: 'plane', icon: Plane, label: 'Viaje', keywords: 'viaje viaje vacaciones vuelo' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Gym', keywords: 'gym ejercicio deporte gimnasio' },
  { id: 'stethoscope', icon: Stethoscope, label: 'Medico', keywords: 'medico doctor salud hospital' },
  { id: 'baby', icon: Baby, label: 'Bebe', keywords: 'bebe hijo nino guagua' },
  { id: 'gift', icon: Gift, label: 'Regalos', keywords: 'regalos regalo cumpleaños' },
  { id: 'scissors', icon: Scissors, label: 'Peluqueria', keywords: 'peluqueria corte pelo' },
  { id: 'fuel', icon: Fuel, label: 'Combustible', keywords: 'combustible bencina gasolina' },
  { id: 'parking-circle', icon: ParkingCircle, label: 'Estacionamiento', keywords: 'estacionamiento parking estacionar' },
  { id: 'bus', icon: Bus, label: 'Transporte', keywords: 'transporte bus micro transporte publico' },
  { id: 'train', icon: Train, label: 'Tren', keywords: 'tren metro ferrocarril' },
  { id: 'landmark', icon: Landmark, label: 'Banco', keywords: 'banco banco credito financiera' },
  { id: 'credit-card', icon: CreditCardIcon, label: 'Tarjeta', keywords: 'tarjeta credito debito' },
  { id: 'dollar-sign', icon: DollarSign, label: 'Dinero', keywords: 'dinero plata dinero' },
  { id: 'coins', icon: Coins, label: 'Monedas', keywords: 'monedas ahorro monedas' },
  { id: 'percent', icon: Percent, label: 'Impuestos', keywords: 'impuestos tasa interes porcentaje' },
  { id: 'calculator', icon: Calculator, label: 'Contabilidad', keywords: 'contabilidad calcular calculo' },
  { id: 'clipboard-list', icon: ClipboardList, label: 'Lista', keywords: 'lista tareas pendientes' },
  { id: 'book-open', icon: BookOpen, label: 'Libro', keywords: 'libro lectura curso libro' },
  { id: 'laptop', icon: Laptop, label: 'Notebook', keywords: 'notebook laptop computador portatil' },
  { id: 'printer', icon: Printer, label: 'Impresora', keywords: 'impresora imprimir' },
  { id: 'key', icon: Key, label: 'Llave', keywords: 'llave acceso' },
  { id: 'lock', icon: Lock, label: 'Candado', keywords: 'candado seguridad' },
  { id: 'mail', icon: Mail, label: 'Correo', keywords: 'correo email' },
  { id: 'package', icon: Package, label: 'Paquete', keywords: 'paquete envio delivery' },
  { id: 'truck', icon: Truck, label: 'Despacho', keywords: 'despacho envio camion' },
  { id: 'store', icon: Store, label: 'Tienda', keywords: 'tienda negocio comercio' },
  { id: 'music', icon: Music, label: 'Musica', keywords: 'musica spotify audio' },
  { id: 'film', icon: Film, label: 'Pelicula', keywords: 'pelicula netflix video cine' },
  { id: 'palette', icon: Palette, label: 'Arte', keywords: 'arte pintura disenio' },
  { id: 'briefcase', icon: Briefcase, label: 'Trabajo', keywords: 'trabajo oficina empleo' },
  { id: 'hammer', icon: Hammer, label: 'Herramienta', keywords: 'herramienta reparacion construccion' },
  { id: 'flame', icon: Flame, label: 'Gas', keywords: 'gas calefaccion fuego' },
  { id: 'pizza', icon: Pizza, label: 'Pizza', keywords: 'pizza comida rapida' },
  { id: 'candy', icon: Candy, label: 'Dulces', keywords: 'dulces snacks golosinas' },
  { id: 'beer', icon: Beer, label: 'Cerveza', keywords: 'cerveza bar bebida alcohol' },
  { id: 'salad', icon: Salad, label: 'Verduras', keywords: 'verduras saludable ensalada' }
];

const Dashboard = ({ user, token, onLogout, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);

  const [months, setMonths] = useState(INITIAL_MONTHS);
  const [deudas, setDeudas] = useState([]);
  const [gastosFijos, setGastosFijos] = useState([]);
  const [sueldos, setSueldos] = useState({});
  const [cuentasAhorro, setCuentasAhorro] = useState([]);
  const [ahorrosData, setAhorrosData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetch('/api/data', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.months && data.months.length > 0) setMonths(data.months);
        if (data.deudas && data.deudas.length > 0) setDeudas(data.deudas);
        if (data.gastosFijos && data.gastosFijos.length > 0) setGastosFijos(data.gastosFijos);
        if (data.sueldos && Object.keys(data.sueldos).length > 0) setSueldos(data.sueldos);
        if (data.cuentasAhorro && data.cuentasAhorro.length > 0) {
          setCuentasAhorro(data.cuentasAhorro);
        } else {
          setCuentasAhorro([{ id: `acc-${Date.now()}`, nombre: 'Ahorro Principal', banco: 'Banco Estado' }]);
        }
        if (data.ahorrosData && Object.keys(data.ahorrosData).length > 0) setAhorrosData(data.ahorrosData);
        setLoadingData(false);
      })
      .catch(err => {
        console.error('Error loading DB', err);
        setLoadingData(false);
      });
  }, []);

  const availableYears = useMemo(() => {
    const years = months.map(m => m.split(' ')[1]);
    return [...new Set(years)].sort((a, b) => parseInt(a) - parseInt(b));
  }, [months]);

  const [selectedYear, setSelectedYear] = useState(() => {
    const currentYear = new Date().getFullYear().toString();
    return availableYears.includes(currentYear) ? currentYear : availableYears[0] || '2026';
  });

  const filteredMonths = useMemo(() => {
    return months.filter(m => m.endsWith(selectedYear));
  }, [months, selectedYear]);

  const [isAddingDebt, setIsAddingDebt] = useState(false);
  const [isAddingFixed, setIsAddingFixed] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newDebt, setNewDebt] = useState({
    descripcion: '',
    cuotasTotales: 12,
    valorCuota: 0,
    mesInicio: INITIAL_MONTHS[0],
    isContribuciones: false,
    iconType: 'default',
    iconValue: 'layout',
    iconUrl: ''
  });

  const [newFixed, setNewFixed] = useState({
    descripcion: '',
    iconType: 'preset',
    iconValue: 'layout',
    iconUrl: ''
  });

  const [newAccount, setNewAccount] = useState({ nombre: '', banco: '' });
  const [debtIconSearch, setDebtIconSearch] = useState('');
  const [fixedIconSearch, setFixedIconSearch] = useState('');

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

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (loadingData) return;

    fetch('/api/sync', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        deudas,
        months,
        gastosFijos,
        sueldos,
        cuentasAhorro,
        ahorrosData
      })
    }).catch(err => console.error('Sync error:', err));

  }, [deudas, months, gastosFijos, sueldos, cuentasAhorro, ahorrosData, loadingData]);

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

  const getNextMonthStr = (monthStr) => fromDateVal(toDateVal(monthStr) + 1);

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

    return [...deudasProcesadas, ...gastosProcesados];
  }, [deudas, gastosFijos, filteredMonths]);

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
      const sueldo = sueldos[mes] || 0;
      res[mes] = { cuotas: totalCuotas, gastos: totalGastos, sueldo, neto: sueldo - totalCuotas - totalGastos };
    });
    return res;
  }, [deudas, gastosFijos, sueldos, months]);

  const callGemini = async (prompt, systemPrompt = "Eres un analista financiero experto. Proporciona respuestas concisas, profesionales y accionables en español.") => {
    setIsAiLoading(true);
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) throw new Error('API Error');

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        setIsAiLoading(false);
        return text;
      } catch (error) {
        retries++;
        await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
      }
    }
    setIsAiLoading(false);
    return "Lo siento, no pude conectar con mi cerebro financiero en este momento. Inténtalo de nuevo más tarde.";
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
    - Sueldo promedio: ${formatCurrency(dataSummary.sueldoPromedio)}
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
    const endMonth = calculateEndDate(newDebt.mesInicio, newDebt.cuotasTotales, newDebt.isContribuciones);
    ensureMonthsRange(newDebt.mesInicio, endMonth);
    if (editingItem) {
      setDeudas(deudas.map(d => d.id === editingItem.id ? { ...newDebt, id: d.id, pagos: d.pagos } : d));
    } else {
      setDeudas([...deudas, { ...newDebt, id: `debt-${Date.now()}`, pagos: {} }]);
    }
    setIsAddingDebt(false);
    setEditingItem(null);
    setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, iconType: 'default', iconValue: 'layout', iconUrl: '' });
    setDebtIconSearch('');
  };

  const handleSaveFixed = (e) => {
    e.preventDefault();
    if (editingItem) {
      setGastosFijos(gastosFijos.map(g => g.id === editingItem.id ? { ...newFixed, id: g.id, pagos: g.pagos } : g));
    } else {
      setGastosFijos([...gastosFijos, { ...newFixed, id: `fixed-${Date.now()}`, pagos: {} }]);
    }
    setIsAddingFixed(false);
    setEditingItem(null);
    setNewFixed({ descripcion: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setFixedIconSearch('');
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
        iconType: item.iconType || 'default',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setDebtIconSearch('');
      setIsAddingDebt(true);
    } else {
      setNewFixed({
        descripcion: item.descripcion || '',
        iconType: item.iconType || 'preset',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setFixedIconSearch('');
      setIsAddingFixed(true);
    }
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!newAccount.nombre || !newAccount.banco) return;
    setCuentasAhorro([...cuentasAhorro, { ...newAccount, id: `acc-${Date.now()}` }]);
    setIsAddingAccount(false);
    setNewAccount({ nombre: '', banco: '' });
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

  const renderFixedIcon = (item) => {
    if (item.iconType === 'url' && item.iconUrl) {
      return <img src={item.iconUrl} className="w-4 h-4 rounded-full object-cover" alt="Icon" />;
    }
    const Preset = PRESET_ICONS.find(i => i.id === (item.iconValue || 'layout'))?.icon || LayoutDashboard;
    return <Preset size={16} />;
  };

  const renderDebtIcon = (item) => {
    if (item.iconType === 'url' && item.iconUrl) {
      return <img src={item.iconUrl} className="w-4 h-4 rounded-full object-cover" alt="Icon" />;
    }
    if (item.iconType === 'preset') {
      const Preset = PRESET_ICONS.find(i => i.id === (item.iconValue || 'layout'))?.icon;
      if (Preset) return <Preset size={16} />;
    }
    return <CreditCard size={16} className="text-indigo-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
              <TrendingDown className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Finance Master</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Gestión Inteligente de Egresos</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-sm">
              <User size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.name}</span>
              {user.role === 'admin' && (
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Admin</span>
              )}
            </div>

            {user.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                <Users size={18} /> Usuarios
              </button>
            )}

            <button
              onClick={generateFinancialAdvice}
              disabled={isAiLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
              Consultar IA ✨
            </button>

            <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${selectedYear === year ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  {year}
                </button>
              ))}
            </div>
            <button onClick={() => setMonths([...months, getNextMonthStr(months[months.length - 1])])} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              <Calendar size={18} /> +1 Mes
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all shadow-sm"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {aiAdvice && (
          <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-[2rem] p-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
            <button onClick={() => setAiAdvice(null)} className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <X size={20} />
            </button>
            <div className="flex gap-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl h-fit shadow-sm">
                <Sparkles className="text-indigo-600" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-indigo-900 dark:text-indigo-200 font-black text-lg mb-2">Consejo de tu Analista IA ✨</h4>
                <div className="text-indigo-800/80 dark:text-indigo-300/80 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {aiAdvice}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-[1.5rem] w-fit">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'general' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
          >
            <ListChecks size={18} /> Detalle General
          </button>
          <button
            onClick={() => setActiveTab('ahorros')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'ahorros' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
          >
            <PiggyBank size={18} /> Gestión de Ahorros
          </button>
        </div>

        {activeTab === 'general' ? (
          <>
            <div className="flex justify-end gap-2 mb-4">
              <button onClick={() => { setEditingItem(null); setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, iconType: 'default', iconValue: 'layout', iconUrl: '' }); setDebtIconSearch(''); setIsAddingDebt(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                <Plus size={18} /> Nueva Cuota
              </button>
              <button onClick={() => { setEditingItem(null); setNewFixed({ descripcion: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setIsAddingFixed(true); }} className="flex items-center gap-2 bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                <Plus size={18} /> Gasto Fijo
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                      <th className="p-6 font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest sticky left-0 bg-white dark:bg-slate-800 z-20 border-r border-slate-100 dark:border-slate-700 min-w-[320px]">
                        Detalle de Gastos
                      </th>
                      {filteredMonths.map(mes => (
                        <th key={mes} className="p-4 border-l border-slate-100 dark:border-slate-700 min-w-[150px] text-center">
                          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{mes.split(' ')[1]}</div>
                          <div className="text-sm font-black text-slate-800 dark:text-slate-200">{mes.split(' ')[0]}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {itemsUnificados.length > 0 ? (
                      itemsUnificados.map(item => (
                        <tr key={item.id} className="border-b border-slate-50 dark:border-slate-700/50 group hover:bg-slate-50/30 dark:hover:bg-slate-700/20">
                          <td className="p-5 sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 z-10 border-r border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 overflow-hidden w-9 h-9 flex items-center justify-center">
                                  {item.tipo === 'cuota' ? renderDebtIcon(item) : renderFixedIcon(item)}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-800 dark:text-slate-200 text-sm leading-tight">{item.descripcion}</span>
                                    {item.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Legal</span>}
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                    {item.tipo === 'cuota' ? `${item.mesInicio} — ${item.mesTermino}` : 'Gasto Fijo Recurrente'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEditItem(item)} className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => {
                                  if (item.tipo === 'cuota') setDeudas(deudas.filter(x => x.id !== item.id));
                                  else setGastosFijos(gastosFijos.filter(x => x.id !== item.id));
                                }} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </td>
                          {filteredMonths.map(mes => {
                            if (item.tipo === 'cuota') {
                              const inRange = isMonthInRange(mes, item.mesInicio, item.mesTermino, item.isContribuciones);
                              const isPagado = item.pagos?.[mes]?.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-4 border-l border-slate-50 dark:border-slate-700/50 text-center ${!inRange && 'bg-slate-50/40 dark:bg-slate-900/20 opacity-20'}`}>
                                  {inRange && (
                                    <button
                                      onClick={() => {
                                        const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                                        setDeudas(deudas.map(x => x.id === item.id ? { ...x, pagos: { ...x.pagos, [mes]: { estado: next } } } : x));
                                      }}
                                      className={`w-full py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${isPagado ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-700 border-2 border-dashed border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-indigo-300'}`}
                                    >
                                      <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{isPagado ? 'Pagado' : 'Pendiente'}</span>
                                      <span className="text-xs font-mono font-black">{isPagado ? formatCurrency(item.valorCuota) : '$ 0'}</span>
                                    </button>
                                  )}
                                </td>
                              );
                            } else {
                              const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                              const isPagado = pago.estado === 'PAGADA';
                              return (
                                <td key={mes} className="p-4 border-l border-slate-50 dark:border-slate-700/50">
                                  <div className="space-y-1.5">
                                    <div className="relative group/input">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 dark:text-slate-600">$</span>
                                      <input
                                        type="number"
                                        placeholder="0"
                                        value={pago.monto || ''}
                                        onChange={(e) => updateFixedPayment(item.id, mes, 'monto', e.target.value)}
                                        className="w-full bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border-2 border-transparent focus:border-indigo-500 text-center font-mono font-black text-xs outline-none py-1.5 pl-4 dark:text-slate-200"
                                      />
                                    </div>
                                    <button
                                      disabled={!(pago.monto > 0)}
                                      onClick={() => updateFixedPayment(item.id, mes, 'estado', isPagado ? 'PENDIENTE' : 'PAGADA')}
                                      className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${!(pago.monto > 0) ? 'bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 border-slate-100 dark:border-slate-700' : isPagado ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600 hover:border-indigo-200'}`}
                                    >
                                      {isPagado ? 'Pagado' : 'Pendiente'}
                                    </button>
                                  </div>
                                </td>
                              );
                            }
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={filteredMonths.length + 1} className="p-24 text-center text-slate-300 font-bold italic">No hay registros para mostrar</td></tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-black">
                    <tr className="border-t-4 border-indigo-500 divide-x divide-slate-800">
                      <td className="p-6 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <ArrowUpCircle size={20} />
                          <span className="uppercase text-xs tracking-widest">Sueldo del Mes</span>
                        </div>
                      </td>
                      {filteredMonths.map(mes => (
                        <td key={mes} className="p-4">
                          <input
                            type="number"
                            value={sueldos[mes] || ''}
                            onChange={(e) => setSueldos({ ...sueldos, [mes]: parseInt(e.target.value) || 0 })}
                            placeholder="Monto"
                            className="w-full bg-slate-800 rounded-xl py-2 px-3 text-center text-emerald-400 font-mono outline-none border border-slate-700 focus:border-emerald-500 transition-all placeholder:text-slate-700"
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800 bg-slate-950">
                      <td className="p-6 sticky left-0 bg-slate-950 z-30 border-r border-slate-800 flex items-center gap-3">
                        <Wallet className="text-emerald-400" size={24} />
                        <span className="uppercase text-sm">Disponibilidad Neta</span>
                      </td>
                      {filteredMonths.map(mes => (
                        <td key={mes} className="p-4 text-center">
                          <div className={`text-lg font-mono ${totalesMensuales[mes].neto >= 0 ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                            {formatCurrency(totalesMensuales[mes].neto)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <PiggyBank className="text-emerald-500" /> Mis Cuentas de Ahorro
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={getSavingsPlan}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-4 py-2 rounded-xl text-sm font-black transition-all disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Lightbulb size={18} />}
                  Estrategia IA ✨
                </button>
                <button onClick={() => setIsAddingAccount(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                  <Plus size={18} /> Nueva Cuenta
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                      <th className="p-6 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest sticky left-0 bg-slate-50 dark:bg-slate-800 z-20 min-w-[300px]">Cuentas / Bancos</th>
                      {filteredMonths.map(mes => (
                        <th key={mes} className="p-4 text-center min-w-[160px] border-l border-slate-100 dark:border-slate-700">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{mes.split(' ')[1]}</div>
                          <div className="text-sm font-black text-slate-800 dark:text-slate-200">{mes.split(' ')[0]}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cuentasAhorro.map(cuenta => (
                      <React.Fragment key={cuenta.id}>
                        <tr className="bg-slate-50/30 dark:bg-slate-800/30">
                          <td className="p-4 sticky left-0 bg-white dark:bg-slate-800 z-10 border-r border-slate-100 dark:border-slate-700 font-black text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-widest">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-2">
                                <Building2 size={14} /> {cuenta.banco} - {cuenta.nombre}
                              </div>
                              <button onClick={() => setCuentasAhorro(cuentasAhorro.filter(c => c.id !== cuenta.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                          {filteredMonths.map(mes => (
                            <td key={mes} className="p-4 border-l border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                              <div className="grid grid-cols-2 gap-1">
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[8px] font-black text-emerald-500 uppercase">Ahorro</label>
                                  <input
                                    type="number"
                                    placeholder="+$"
                                    value={ahorrosData[cuenta.id]?.[mes]?.deposito || ''}
                                    onChange={(e) => updateSavingData(cuenta.id, mes, 'deposito', e.target.value)}
                                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-center font-mono font-black text-xs p-1 rounded-md border-transparent border-2 focus:border-emerald-300 outline-none"
                                  />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[8px] font-black text-rose-500 uppercase">Gasto</label>
                                  <input
                                    type="number"
                                    placeholder="-$"
                                    value={ahorrosData[cuenta.id]?.[mes]?.gasto || ''}
                                    onChange={(e) => updateSavingData(cuenta.id, mes, 'gasto', e.target.value)}
                                    className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-center font-mono font-black text-xs p-1 rounded-md border-transparent border-2 focus:border-rose-300 outline-none"
                                  />
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-slate-700">
                          <td className="p-2 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 border-r border-slate-100 dark:border-slate-700 text-right pr-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Saldo Acumulado {cuenta.nombre}</span>
                          </td>
                          {filteredMonths.map(mes => (
                            <td key={mes} className="p-2 border-l border-slate-100 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-800/50">
                              <div className="text-xs font-mono font-black text-slate-600 dark:text-slate-400">
                                {formatCurrency(balancesPorCuenta[cuenta.id]?.[mes]?.acumulado)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                  <tfoot className="bg-emerald-600 text-white font-black">
                    <tr>
                      <td className="p-6 sticky left-0 bg-emerald-600 z-30 flex items-center gap-3">
                        <TrendingUp size={24} />
                        <span className="uppercase text-sm">Ahorro Total Acumulado</span>
                      </td>
                      {filteredMonths.map(mes => (
                        <td key={mes} className="p-4 text-center text-lg font-mono">
                          {formatCurrency(totalAhorroMensual[mes])}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {isAddingDebt && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <CreditCard className="text-indigo-600" /> {editingItem ? 'Editar Cuota' : 'Nueva Cuota'}
                </h3>
                <button onClick={() => { setIsAddingDebt(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X /></button>
              </div>
              <form onSubmit={handleSaveDebt} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Descripción</label>
                  <input required value={newDebt.descripcion} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all ${newDebt.isContribuciones ? 'text-slate-500 cursor-not-allowed' : ''} dark:text-slate-200`} placeholder="Ej: Notebook, Vacaciones..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Cuotas Totales</label>
                    <input type="number" required value={newDebt.cuotasTotales} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, cuotasTotales: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all ${newDebt.isContribuciones ? 'text-slate-500 cursor-not-allowed' : ''} dark:text-slate-200`} />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Valor Cuota</label>
                    <input type="number" required value={newDebt.valorCuota} onChange={e => setNewDebt({ ...newDebt, valorCuota: parseInt(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Mes de Inicio</label>
                  <input
                    type="month"
                    required
                    value={monthStrToMonthInput(newDebt.mesInicio)}
                    onChange={handleMesInicioChange}
                    className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200"
                  />
                </div>
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
                  <input type="checkbox" id="contrib" checked={newDebt.isContribuciones} onChange={handleContribucionesChange} className="w-5 h-5 rounded-md accent-amber-600" />
                  <label htmlFor="contrib" className="text-xs font-bold text-amber-800 dark:text-amber-200">Es Contribución Legal (Solo 4 cuotas fijas al año)</label>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Icono (opcional)</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'default' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newDebt.iconType === 'default' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Por defecto</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'preset' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newDebt.iconType === 'preset' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Iconos</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'url' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newDebt.iconType === 'url' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>URL</button>
                  </div>

                  {newDebt.iconType === 'preset' && (
                    <div>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={debtIconSearch}
                          onChange={(e) => setDebtIconSearch(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200"
                          placeholder="Buscar icono..."
                        />
                      </div>
                      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredDebtIcons.length > 0 ? filteredDebtIcons.map(i => (
                          <button type="button" key={i.id} onClick={() => setNewDebt({ ...newDebt, iconValue: i.id })} className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newDebt.iconValue === i.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                            <i.icon size={18} />
                            <span className="text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        )) : (
                          <div className="col-span-6 text-center py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                        )}
                      </div>
                    </div>
                  )}

                  {newDebt.iconType === 'url' && (
                    <input value={newDebt.iconUrl} onChange={e => setNewDebt({ ...newDebt, iconUrl: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200" placeholder="https://ejemplo.com/logo.png" />
                  )}
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 hover:bg-indigo-700 transition-all mt-4">Guardar Registro</button>
              </form>
            </div>
          </div>
        )}

        {isAddingFixed && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Receipt className="text-slate-800 dark:text-slate-200" /> {editingItem ? 'Editar Gasto' : 'Nuevo Gasto Fijo'}
                </h3>
                <button onClick={() => { setIsAddingFixed(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X /></button>
              </div>
              <form onSubmit={handleSaveFixed} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Descripción</label>
                  <input required value={newFixed.descripcion} onChange={e => setNewFixed({ ...newFixed, descripcion: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-slate-800 dark:focus:border-slate-400 transition-all dark:text-slate-200" placeholder="Ej: Gastos Comunes, Luz, Internet..." />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'preset' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newFixed.iconType === 'preset' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Iconos Predefinidos</button>
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'url' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newFixed.iconType === 'url' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>URL Imagen</button>
                </div>

                {newFixed.iconType === 'preset' ? (
                  <div>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={fixedIconSearch}
                        onChange={(e) => setFixedIconSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200"
                        placeholder="Buscar icono..."
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredFixedIcons.length > 0 ? filteredFixedIcons.map(i => (
                        <button type="button" key={i.id} onClick={() => setNewFixed({ ...newFixed, iconValue: i.id })} className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newFixed.iconValue === i.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                          <i.icon size={18} />
                          <span className="text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                        </button>
                      )) : (
                        <div className="col-span-6 text-center py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">URL del Logo (PNG/SVG)</label>
                    <input value={newFixed.iconUrl} onChange={e => setNewFixed({ ...newFixed, iconUrl: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200" placeholder="https://ejemplo.com/logo.png" />
                  </div>
                )}

                <button type="submit" className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-2xl font-black shadow-lg shadow-slate-100 dark:shadow-slate-950 hover:bg-slate-800 dark:hover:bg-white transition-all mt-4">Registrar Gasto</button>
              </form>
            </div>
          </div>
        )}

        {isAddingAccount && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <PiggyBank className="text-emerald-600" /> Nueva Cuenta de Ahorro
                </h3>
                <button onClick={() => setIsAddingAccount(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X /></button>
              </div>
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Nombre de la Cuenta</label>
                  <input required value={newAccount.nombre} onChange={e => setNewAccount({ ...newAccount, nombre: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all dark:text-slate-200" placeholder="Ej: Fondo de Emergencia, Vacaciones..." />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Institución Financiera</label>
                  <input required value={newAccount.banco} onChange={e => setNewAccount({ ...newAccount, banco: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all dark:text-slate-200" placeholder="Ej: Banco de Chile, MACH, Fintual..." />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 hover:bg-emerald-700 transition-all mt-4">Crear Cuenta</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('loading');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Invalid token');
        })
        .then(data => {
          setUser(data.user);
          setToken(storedToken);
          setCurrentView('dashboard');
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentView('login');
        });
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setToken(localStorage.getItem('token'));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setCurrentView('login');
  };

  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-sans transition-colors duration-300">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() => setCurrentView('register')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <Register
        onRegister={handleLogin}
        onGoToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminPanel
        token={token}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      token={token}
      onLogout={handleLogout}
      onOpenAdmin={() => setCurrentView('admin')}
    />
  );
};

export default App;
