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
  Palette,
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
  Check,
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
  Soup,
  RefreshCw,
  Star,
  Globe,
  Radio,
  Headphones,
  PieChart,
  CalendarDays,
  Activity
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

const THEMES = {
  indigo: {
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-700',
    shadowBtn: 'shadow-indigo-100 dark:shadow-indigo-900/30',
    focusBorder: 'focus:border-indigo-500',
    hoverBorder: 'hover:border-indigo-300',
    iconAccent: 'text-indigo-400',
    iconAccentDark: 'dark:text-indigo-300',
    bgLight: 'bg-indigo-50/50',
    bgLightDark: 'dark:bg-indigo-900/20',
    badgeBg: 'bg-indigo-100',
    badgeBgDark: 'dark:bg-indigo-900/30',
    badgeText: 'text-indigo-700',
    badgeTextDark: 'dark:text-indigo-300',
    tabText: 'text-indigo-600',
    headerIcon: 'bg-indigo-600',
    headerIconShadow: 'shadow-indigo-200 dark:shadow-indigo-900/30',
    btnDebt: 'bg-indigo-600 hover:bg-indigo-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-indigo-600 hover:bg-indigo-700',
    borderAccent: 'border-indigo-600',
    bgModalLight: 'bg-indigo-50 dark:bg-indigo-900/30',
    inputBg: 'bg-indigo-50/50 dark:bg-indigo-900/20',
  },
  blue: {
    btnPrimary: 'bg-blue-600 hover:bg-blue-700',
    shadowBtn: 'shadow-blue-100 dark:shadow-blue-900/30',
    focusBorder: 'focus:border-blue-500',
    hoverBorder: 'hover:border-blue-300',
    iconAccent: 'text-blue-400',
    iconAccentDark: 'dark:text-blue-300',
    bgLight: 'bg-blue-50/50',
    bgLightDark: 'dark:bg-blue-900/20',
    badgeBg: 'bg-blue-100',
    badgeBgDark: 'dark:bg-blue-900/30',
    badgeText: 'text-blue-700',
    badgeTextDark: 'dark:text-blue-300',
    tabText: 'text-blue-600',
    headerIcon: 'bg-blue-600',
    headerIconShadow: 'shadow-blue-200 dark:shadow-blue-900/30',
    btnDebt: 'bg-blue-600 hover:bg-blue-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-blue-600 hover:bg-blue-700',
    borderAccent: 'border-blue-600',
    bgModalLight: 'bg-blue-50 dark:bg-blue-900/30',
    inputBg: 'bg-blue-50/50 dark:bg-blue-900/20',
  },
  emerald: {
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700',
    shadowBtn: 'shadow-emerald-100 dark:shadow-emerald-900/30',
    focusBorder: 'focus:border-emerald-500',
    hoverBorder: 'hover:border-emerald-300',
    iconAccent: 'text-emerald-400',
    iconAccentDark: 'dark:text-emerald-300',
    bgLight: 'bg-emerald-50/50',
    bgLightDark: 'dark:bg-emerald-900/20',
    badgeBg: 'bg-emerald-100',
    badgeBgDark: 'dark:bg-emerald-900/30',
    badgeText: 'text-emerald-700',
    badgeTextDark: 'dark:text-emerald-300',
    tabText: 'text-emerald-600',
    headerIcon: 'bg-emerald-600',
    headerIconShadow: 'shadow-emerald-200 dark:shadow-emerald-900/30',
    btnDebt: 'bg-emerald-600 hover:bg-emerald-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-emerald-600 hover:bg-emerald-700',
    borderAccent: 'border-emerald-600',
    bgModalLight: 'bg-emerald-50 dark:bg-emerald-900/30',
    inputBg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
  },
  purple: {
    btnPrimary: 'bg-purple-600 hover:bg-purple-700',
    shadowBtn: 'shadow-purple-100 dark:shadow-purple-900/30',
    focusBorder: 'focus:border-purple-500',
    hoverBorder: 'hover:border-purple-300',
    iconAccent: 'text-purple-400',
    iconAccentDark: 'dark:text-purple-300',
    bgLight: 'bg-purple-50/50',
    bgLightDark: 'dark:bg-purple-900/20',
    badgeBg: 'bg-purple-100',
    badgeBgDark: 'dark:bg-purple-900/30',
    badgeText: 'text-purple-700',
    badgeTextDark: 'dark:text-purple-300',
    tabText: 'text-purple-600',
    headerIcon: 'bg-purple-600',
    headerIconShadow: 'shadow-purple-200 dark:shadow-purple-900/30',
    btnDebt: 'bg-purple-600 hover:bg-purple-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-purple-600 hover:bg-purple-700',
    borderAccent: 'border-purple-600',
    bgModalLight: 'bg-purple-50 dark:bg-purple-900/30',
    inputBg: 'bg-purple-50/50 dark:bg-purple-900/20',
  },
  rose: {
    btnPrimary: 'bg-rose-600 hover:bg-rose-700',
    shadowBtn: 'shadow-rose-100 dark:shadow-rose-900/30',
    focusBorder: 'focus:border-rose-500',
    hoverBorder: 'hover:border-rose-300',
    iconAccent: 'text-rose-400',
    iconAccentDark: 'dark:text-rose-300',
    bgLight: 'bg-rose-50/50',
    bgLightDark: 'dark:bg-rose-900/20',
    badgeBg: 'bg-rose-100',
    badgeBgDark: 'dark:bg-rose-900/30',
    badgeText: 'text-rose-700',
    badgeTextDark: 'dark:text-rose-300',
    tabText: 'text-rose-600',
    headerIcon: 'bg-rose-600',
    headerIconShadow: 'shadow-rose-200 dark:shadow-rose-900/30',
    btnDebt: 'bg-rose-600 hover:bg-rose-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-rose-600 hover:bg-rose-700',
    borderAccent: 'border-rose-600',
    bgModalLight: 'bg-rose-50 dark:bg-rose-900/30',
    inputBg: 'bg-rose-50/50 dark:bg-rose-900/20',
  },
  amber: {
    btnPrimary: 'bg-amber-600 hover:bg-amber-700',
    shadowBtn: 'shadow-amber-100 dark:shadow-amber-900/30',
    focusBorder: 'focus:border-amber-500',
    hoverBorder: 'hover:border-amber-300',
    iconAccent: 'text-amber-400',
    iconAccentDark: 'dark:text-amber-300',
    bgLight: 'bg-amber-50/50',
    bgLightDark: 'dark:bg-amber-900/20',
    badgeBg: 'bg-amber-100',
    badgeBgDark: 'dark:bg-amber-900/30',
    badgeText: 'text-amber-700',
    badgeTextDark: 'dark:text-amber-300',
    tabText: 'text-amber-600',
    headerIcon: 'bg-amber-600',
    headerIconShadow: 'shadow-amber-200 dark:shadow-amber-900/30',
    btnDebt: 'bg-amber-600 hover:bg-amber-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-amber-600 hover:bg-amber-700',
    borderAccent: 'border-amber-600',
    bgModalLight: 'bg-amber-50 dark:bg-amber-900/30',
    inputBg: 'bg-amber-50/50 dark:bg-amber-900/20',
  },
  teal: {
    btnPrimary: 'bg-teal-600 hover:bg-teal-700',
    shadowBtn: 'shadow-teal-100 dark:shadow-teal-900/30',
    focusBorder: 'focus:border-teal-500',
    hoverBorder: 'hover:border-teal-300',
    iconAccent: 'text-teal-400',
    iconAccentDark: 'dark:text-teal-300',
    bgLight: 'bg-teal-50/50',
    bgLightDark: 'dark:bg-teal-900/20',
    badgeBg: 'bg-teal-100',
    badgeBgDark: 'dark:bg-teal-900/30',
    badgeText: 'text-teal-700',
    badgeTextDark: 'dark:text-teal-300',
    tabText: 'text-teal-600',
    headerIcon: 'bg-teal-600',
    headerIconShadow: 'shadow-teal-200 dark:shadow-teal-900/30',
    btnDebt: 'bg-teal-600 hover:bg-teal-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-teal-600 hover:bg-teal-700',
    borderAccent: 'border-teal-600',
    bgModalLight: 'bg-teal-50 dark:bg-teal-900/30',
    inputBg: 'bg-teal-50/50 dark:bg-teal-900/20',
  },
  slate: {
    btnPrimary: 'bg-slate-600 hover:bg-slate-700',
    shadowBtn: 'shadow-slate-100 dark:shadow-slate-900/30',
    focusBorder: 'focus:border-slate-500',
    hoverBorder: 'hover:border-slate-300',
    iconAccent: 'text-slate-400',
    iconAccentDark: 'dark:text-slate-300',
    bgLight: 'bg-slate-50/50',
    bgLightDark: 'dark:bg-slate-900/20',
    badgeBg: 'bg-slate-100',
    badgeBgDark: 'dark:bg-slate-900/30',
    badgeText: 'text-slate-700',
    badgeTextDark: 'dark:text-slate-300',
    tabText: 'text-slate-600',
    headerIcon: 'bg-slate-600',
    headerIconShadow: 'shadow-slate-200 dark:shadow-slate-900/30',
    btnDebt: 'bg-slate-600 hover:bg-slate-700',
    btnFixed: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-slate-600 hover:bg-slate-700',
    borderAccent: 'border-slate-600',
    bgModalLight: 'bg-slate-50 dark:bg-slate-900/30',
    inputBg: 'bg-slate-50/50 dark:bg-slate-900/20',
  },
};

const THEME_COLORS = ['indigo', 'blue', 'emerald', 'purple', 'rose', 'amber', 'teal', 'slate'];
const THEME_COLOR_HEX = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  emerald: '#059669',
  purple: '#9333ea',
  rose: '#e11d48',
  amber: '#d97706',
  teal: '#0d9488',
  slate: '#475569',
};

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

const SUBSCRIPTION_ICONS = [
  { id: 'film', icon: Film, label: 'Netflix', keywords: 'netflix cine peliculas streaming video' },
  { id: 'tv', icon: Tv, label: 'TV Cable', keywords: 'tv cable television' },
  { id: 'monitor', icon: Monitor, label: 'YouTube', keywords: 'youtube video google' },
  { id: 'music', icon: Music, label: 'Spotify', keywords: 'spotify musica audio streaming' },
  { id: 'headphones', icon: Headphones, label: 'Apple Music', keywords: 'apple music musica audio streaming' },
  { id: 'gamepad-2', icon: Gamepad2, label: 'Twitch', keywords: 'twitch gaming streaming juegos' },
  { id: 'star', icon: Star, label: 'Disney+', keywords: 'disney plus streaming peliculas' },
  { id: 'globe', icon: Globe, label: 'HBO Max', keywords: 'hbo max streaming peliculas series' },
  { id: 'refresh-cw', icon: RefreshCw, label: 'Amazon Prime', keywords: 'amazon prime video compras' },
  { id: 'radio', icon: Radio, label: 'Podcast', keywords: 'podcast radio audio' },
  { id: 'zap', icon: Zap, label: 'Luz', keywords: 'luz electricidad energia' },
  { id: 'droplets', icon: Droplets, label: 'Agua', keywords: 'agua gas' },
  { id: 'wifi', icon: Wifi, label: 'Internet', keywords: 'internet wifi red conexion' },
  { id: 'smartphone', icon: Smartphone, label: 'Celular', keywords: 'celular smartphone telefono' },
  { id: 'shield', icon: Shield, label: 'Seguro', keywords: 'seguro seguro proteccion' },
  { id: 'heart', icon: Heart, label: 'Salud', keywords: 'salud medico doctor' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Gym', keywords: 'gym ejercicio deporte' },
  { id: 'cloud', icon: Cloud, label: 'Cloud', keywords: 'cloud almacenamiento nube icloud google drive' },
  { id: 'layout', icon: LayoutDashboard, label: 'Otro', keywords: 'otro general varios' }
];

const Dashboard = ({ user, token, onLogout, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardMonth, setDashboardMonth] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');

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
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'indigo');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const theme = THEMES[themeColor];

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
          console.log('[LOAD] cuentasAhorro:', data.cuentasAhorro);
        } else {
          setCuentasAhorro([]);
          console.log('[LOAD] No cuentasAhorro in DB');
        }
        if (data.ahorrosData && Object.keys(data.ahorrosData).length > 0) {
          setAhorrosData(data.ahorrosData);
          console.log('[LOAD] ahorrosData loaded:', JSON.stringify(data.ahorrosData));
        } else {
          console.log('[LOAD] No ahorrosData in DB');
        }
        if (data.suscripciones && data.suscripciones.length > 0) setSuscripciones(data.suscripciones);
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

  useEffect(() => {
    if (filteredMonths.length > 0 && !dashboardMonth) {
      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthName = MONTH_NAMES[prevMonth.getMonth()];
      const prevYearStr = prevMonth.getFullYear().toString();
      const prevMonthStr = `${prevMonthName} ${prevYearStr}`;
      if (filteredMonths.includes(prevMonthStr)) {
        setDashboardMonth(prevMonthStr);
      } else {
        setDashboardMonth(filteredMonths[0]);
      }
    }
  }, [filteredMonths]);

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
  const [suscripciones, setSuscripciones] = useState([]);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSub, setNewSub] = useState({
    descripcion: '',
    valor: 0,
    billingCycle: 'mensual',
    diaPago: 1,
    mesInicio: INITIAL_MONTHS[0],
    durationYears: 1,
    iconType: 'preset',
    iconValue: 'layout',
    iconUrl: ''
  });
  const [subscriptionIconSearch, setSubscriptionIconSearch] = useState('');
  const [dashSections, setDashSections] = useState({ cuotas: true, subs: true, fijos: true });
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

  const isInitialMount = useRef(true);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (loadingData) return;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      const syncPayload = {
        deudas,
        months,
        gastosFijos,
        sueldos,
        cuentasAhorro,
        ahorrosData,
        suscripciones
      };

      console.log('[SYNC] Sending payload:', JSON.stringify({
        deudasCount: deudas.length,
        monthsCount: months.length,
        gastosFijosCount: gastosFijos.length,
        sueldosKeys: Object.keys(sueldos).length,
        cuentasAhorroCount: cuentasAhorro.length,
        ahorrosDataKeys: Object.keys(ahorrosData).length,
        suscripcionesCount: suscripciones.length
      }));

      setSyncStatus('saving');
      fetch('/api/sync', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(syncPayload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('[SYNC] Server error:', data.error);
            setSyncStatus('error');
          } else {
            console.log('[SYNC] Success:', data);
            setSyncStatus('saved');
          }
          setTimeout(() => setSyncStatus('idle'), 2000);
        })
        .catch(err => {
          console.error('[SYNC] Network error:', err);
          setSyncStatus('error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        });
    }, 1000);

    return () => { if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current); };
  }, [deudas, months, gastosFijos, sueldos, cuentasAhorro, ahorrosData, suscripciones]);

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

    const getSubActiveMonths = (sub) => {
      const startVal = toDateVal(sub.mesInicio);
      const totalMonths = sub.durationYears * 12;
      const activeMonths = [];
      if (sub.billingCycle === 'mensual') {
        for (let i = 0; i < totalMonths; i++) {
          activeMonths.push(fromDateVal(startVal + i));
        }
      } else {
        for (let i = 0; i < sub.durationYears; i++) {
          activeMonths.push(fromDateVal(startVal + i * 12));
        }
      }
      return activeMonths;
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

    return [...deudasProcesadas, ...gastosProcesados, ...subsProcesadas];
  }, [deudas, gastosFijos, suscripciones, filteredMonths]);

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

      const totalSubs = suscripciones.reduce((acc, s) => {
        const startVal = toDateVal(s.mesInicio);
        const totalMonths = s.durationYears * 12;
        let isActive = false;
        if (s.billingCycle === 'mensual') {
          const mesVal = toDateVal(mes);
          isActive = mesVal >= startVal && mesVal < startVal + totalMonths;
        } else {
          const mesVal = toDateVal(mes);
          for (let i = 0; i < s.durationYears; i++) {
            if (mesVal === startVal + i * 12) {
              isActive = true;
              break;
            }
          }
        }
        return isActive && s.pagos?.[mes]?.estado === 'PAGADA' ? acc + (s.valor || 0) : acc;
      }, 0);

      const sueldo = sueldos[mes] || 0;
      res[mes] = { cuotas: totalCuotas, gastos: totalGastos, suscripciones: totalSubs, sueldo, neto: sueldo - totalCuotas - totalGastos - totalSubs };
    });
    return res;
  }, [deudas, gastosFijos, suscripciones, sueldos, months]);

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
    } else if (item.tipo === 'suscripcion') {
      setNewSub({
        descripcion: item.descripcion || '',
        valor: item.valor || 0,
        billingCycle: item.billingCycle || 'mensual',
        diaPago: item.diaPago || 1,
        mesInicio: item.mesInicio || months[0],
        durationYears: item.durationYears || 1,
        iconType: item.iconType || 'preset',
        iconValue: item.iconValue || 'layout',
        iconUrl: item.iconUrl || ''
      });
      setSubscriptionIconSearch('');
      setIsAddingSub(true);
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

  const handleSaveSubscription = (e) => {
    e.preventDefault();
    if (editingItem && editingItem.tipo === 'suscripcion') {
      setSuscripciones(suscripciones.map(s => s.id === editingItem.id ? { ...newSub, id: s.id, pagos: s.pagos } : s));
    } else {
      setSuscripciones([...suscripciones, { ...newSub, id: `sub-${Date.now()}`, pagos: {} }]);
    }
    setIsAddingSub(false);
    setEditingItem(null);
    setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setSubscriptionIconSearch('');
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!newAccount.nombre || !newAccount.banco) return;
    setCuentasAhorro([...cuentasAhorro, { ...newAccount, id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }]);
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
      return <img src={item.iconUrl} className="w-full h-full object-contain" alt="Icon" />;
    }
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
    return <CreditCard size={18} className="text-indigo-400" />;
  };

  const renderSubscriptionIcon = (item) => {
    if (item.iconType === 'url' && item.iconUrl) {
      return <img src={item.iconUrl} className="w-full h-full object-contain" alt="Icon" />;
    }
    const SubIcon = SUBSCRIPTION_ICONS.find(i => i.id === (item.iconValue || 'layout'))?.icon;
    if (SubIcon) return <SubIcon size={18} />;
    return <RefreshCw size={18} className="text-violet-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-2 md:p-4 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-[98%] mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className={`${theme.headerIcon} p-3 rounded-2xl shadow-lg ${theme.headerIconShadow}`}>
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

            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                title="Cambiar color del tema"
              >
                <Palette size={18} />
              </button>
              {showColorPicker && (
                <div className="fixed right-4 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-[100] w-72 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Color del tema</p>
                    <button onClick={() => setShowColorPicker(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {THEME_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => { setThemeColor(color); setShowColorPicker(false); localStorage.setItem('themeColor', color); }}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <div
                          className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${themeColor === color ? 'ring-[3px] ring-offset-2 ring-slate-400 dark:ring-offset-slate-800 scale-110' : 'hover:scale-110 group-hover:shadow-lg'}`}
                          style={{ backgroundColor: THEME_COLOR_HEX[color] }}
                        >
                          {themeColor === color && (
                            <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors capitalize">{color === 'indigo' ? 'Índigo' : color === 'blue' ? 'Azul' : color === 'emerald' ? 'Esmeralda' : color === 'purple' ? 'Púrpura' : color === 'rose' ? 'Rosa' : color === 'amber' ? 'Ámbar' : color === 'teal' ? 'Cian' : 'Gris'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={generateFinancialAdvice}
              disabled={isAiLoading}
              className={`flex items-center gap-2 ${theme.btnPrimary} text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg ${theme.shadowBtn} transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100`}
            >
              {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
              Consultar IA ✨
            </button>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 pr-8 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer shadow-sm"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button onClick={() => setMonths([...months, getNextMonthStr(months[months.length - 1])])} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              <Calendar size={18} /> +1 Mes
            </button>
            {syncStatus !== 'idle' && (
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${syncStatus === 'saving' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : syncStatus === 'saved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>
                {syncStatus === 'saving' ? <Loader2 size={14} className="animate-spin" /> : syncStatus === 'saved' ? <ClipboardCheck size={14} /> : <X size={14} />}
                {syncStatus === 'saving' ? 'Guardando...' : syncStatus === 'saved' ? 'Guardado' : 'Error'}
              </div>
            )}
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
          <div className={`mb-8 ${theme.bgLight} ${theme.bgLightDark} border-2 ${theme.badgeBg} ${theme.badgeBgDark} rounded-[2rem] p-6 relative animate-in fade-in slide-in-from-top-4 duration-500`}>
            <button onClick={() => setAiAdvice(null)} className={`absolute top-4 right-4 ${theme.iconAccent} ${theme.iconAccentDark} hover:${theme.tabText} transition-colors`}>
              <X size={20} />
            </button>
            <div className="flex gap-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl h-fit shadow-sm">
                <Sparkles className={theme.tabText} size={24} />
              </div>
              <div className="flex-1">
                <h4 className={`${theme.badgeText} dark:${theme.badgeTextDark} font-black text-lg mb-2`}>Consejo de tu Analista IA ✨</h4>
                <div className={`${theme.badgeText}/80 dark:${theme.badgeTextDark}/80 text-sm leading-relaxed whitespace-pre-wrap font-medium`}>
                  {aiAdvice}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-[1.5rem] w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'dashboard' ? `bg-white dark:bg-slate-700 ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'general' ? `bg-white dark:bg-slate-700 ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
          >
            <ListChecks size={18} /> Detalle General
          </button>
          <button
            onClick={() => setActiveTab('ahorros')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'ahorros' ? `bg-white dark:bg-slate-700 ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
          >
            <PiggyBank size={18} /> Gestión de Ahorros
          </button>
        </div>

        {activeTab === 'dashboard' && !!dashboardMonth && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <LayoutDashboard className={theme.tabText} /> Resumen Mensual
              </h2>
              <div className="relative">
                <select
                  value={dashboardMonth}
                  onChange={(e) => setDashboardMonth(e.target.value)}
                  className={`appearance-none bg-white dark:bg-slate-800 border-2 ${theme.borderAccent} rounded-xl px-4 py-2 pr-10 font-bold text-sm outline-none cursor-pointer ${theme.tabText}`}
                >
                  {filteredMonths.map(mes => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {(() => {
              const mes = dashboardMonth;
              const totalCuotas = totalesMensuales[mes]?.cuotas || 0;
              const totalGastos = totalesMensuales[mes]?.gastos || 0;
              const totalSubs = totalesMensuales[mes]?.suscripciones || 0;
              const sueldo = totalesMensuales[mes]?.sueldo || 0;
              const disponibleExtras = sueldo - (totalCuotas + totalGastos + totalSubs);
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

              const subsActivas = suscripciones.filter(s => {
                const startVal = toDateVal(s.mesInicio);
                const mesVal = toDateVal(mes);
                if (s.billingCycle === 'mensual') return mesVal >= startVal && mesVal < startVal + s.durationYears * 12;
                for (let i = 0; i < s.durationYears; i++) { if (mesVal === startVal + i * 12) return true; }
                return false;
              }).sort((a, b) => (a.pagos?.[mes]?.estado === 'PAGADA' ? 1 : 0) - (b.pagos?.[mes]?.estado === 'PAGADA' ? 1 : 0));

              const proximosCobros = subsActivas.map(s => ({ nombre: s.descripcion, monto: s.pagos?.[mes]?.monto || s.valor || 0, dia: s.diaPago || 1 }))
                .sort((a, b) => a.dia - b.dia);
              const cobrosPorDia = {};
              proximosCobros.forEach(c => { if (!cobrosPorDia[c.dia]) cobrosPorDia[c.dia] = []; cobrosPorDia[c.dia].push(c); });

              const gastosFijosList = gastosFijos.map(g => ({ ...g, pagado: g.pagos?.[mes]?.estado === 'PAGADA', monto: g.pagos?.[mes]?.monto || 0 }))
                .sort((a, b) => (a.pagado ? 1 : 0) - (b.pagado ? 1 : 0));
              const gastosPagados = gastosFijosList.filter(g => g.pagado).length;

              const donutSegments = [
                { label: 'Cuotas', value: totalCuotas, pct: pctCuotas, color: theme.bgLight.replace('/50', ''), darkColor: theme.bgLightDark },
                { label: 'G. Fijos', value: totalGastos, pct: pctGastos, color: 'bg-slate-400', darkColor: 'dark:bg-slate-500' },
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`rounded-2xl p-5 shadow-lg text-white ${theme.btnPrimary.replace('hover:bg-', 'bg-').replace('hover:bg-', '')} relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card`}>
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-4 -translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <CreditCard className="text-white/90" size={16} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider opacity-90">Cuotas</span>
                        </div>
                        <div className="text-2xl font-mono font-black mb-1.5">{formatCurrency(totalCuotas)}</div>
                        <div className="flex items-center gap-2 text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{cuotasPagadasMes} pagadas</span>
                          <span>·</span>
                          <span>{cuotasPendientesMes} pendientes</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl p-5 shadow-lg text-white bg-slate-600 dark:bg-slate-700 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-4 -translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Receipt className="text-white/90" size={16} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider opacity-90">Gastos Fijos</span>
                        </div>
                        <div className="text-2xl font-mono font-black mb-1.5">{formatCurrency(totalGastos)}</div>
                        <div className="flex items-center gap-2 text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{gastosPagados} pagados</span>
                          <span>·</span>
                          <span>{gastosFijos.length - gastosPagados} pendientes</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl p-5 shadow-lg text-white bg-rose-600 dark:bg-rose-700 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-4 -translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <RefreshCw className="text-white/90" size={16} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider opacity-90">Suscripciones</span>
                        </div>
                        <div className="text-2xl font-mono font-black mb-1.5">{formatCurrency(totalSubs)}</div>
                        <div className="flex items-center gap-2 text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{subsActivas.length} activas</span>
                          {proximosCobros.length > 0 && <span>·</span>}
                          {proximosCobros.length > 0 && <span>Próx: día {proximosCobros[0]?.dia}</span>}
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl p-5 shadow-lg text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card ${disponibleExtras >= 0 ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-rose-600 dark:bg-rose-700'}`}>
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-4 -translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Wallet className="text-white/90" size={16} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider opacity-90">Disponible</span>
                        </div>
                        <div className={`text-2xl font-mono font-black mb-1.5 ${disponibleExtras < 0 ? 'animate-pulse' : ''}`}>{formatCurrency(disponibleExtras)}</div>
                        <div className="flex items-center gap-2 text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{pctDisponible.toFixed(0)}% libre</span>
                          <span>·</span>
                          <span className="font-bold">{saludLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <button onClick={() => toggleDashSection('cuotas')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/section">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${theme.bgLight} ${theme.bgLightDark}`}>
                            <CreditCard className={theme.tabText} size={18} />
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Cuotas Activas</span>
                            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeBgDark} ${theme.badgeText} dark:${theme.badgeTextDark}`}>{cuotasActivas.length} este mes</span>
                          </div>
                        </div>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${dashSections.cuotas ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.cuotas && (
                        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4 animate-slide-down">
                          {cuotasActivas.map(d => {
                            const mesTermino = calculateEndDate(d.mesInicio, d.isContribuciones ? 4 : d.cuotasTotales, d.isContribuciones);
                            let pagadas = 0; let cur = toDateVal(d.mesInicio); const end = toDateVal(mesTermino);
                            while (cur <= end) { const m = fromDateVal(cur); if (!d.isContribuciones || ['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(m.split(' ')[0])) { if (d.pagos?.[m]?.estado === 'PAGADA') pagadas++; } cur++; }
                            const totalD = d.isContribuciones ? 4 : d.cuotasTotales;
                            const pctD = totalD > 0 ? (pagadas / totalD) * 100 : 0;
                            return (
                              <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${theme.bgLight} ${theme.bgLightDark} overflow-hidden`}>
                                  <div className={theme.tabText}>{renderDebtIcon(d)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 truncate">{d.descripcion}</span>
                                    {d.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Legal</span>}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pctD}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{pagadas}/{totalD}</span>
                                  </div>
                                </div>
                                <span className="text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(d.valorCuota)}</span>
                              </div>
                            );
                          })}
                          {cuotasActivas.length > 0 && (
                            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                              <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                              <span className={`text-sm font-mono font-black ${theme.tabText}`}>{formatCurrency(totalCuotas)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <PieChart className="text-emerald-500 dark:text-emerald-400" size={18} />
                          </div>
                          <span className="text-sm font-black text-slate-700 dark:text-slate-200">Distribución</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${donutSegments.map((s, i) => {
                              return `${donutColors[i]} ${i === 0 ? '0' : donutSegments.slice(0, i).reduce((a, x) => a + x.pct, 0)}% ${donutSegments.slice(0, i + 1).reduce((a, x) => a + x.pct, 0)}%`;
                            }).join(', ')})` }}></div>
                            <div className="absolute inset-3 rounded-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center shadow-inner">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gastado</span>
                              <span className="text-lg font-mono font-black text-slate-800 dark:text-slate-100">{pctGastado.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="space-y-2.5 flex-1">
                            {(() => {
                              const textColors = [theme.tabText, 'text-slate-500 dark:text-slate-400', 'text-rose-500 dark:text-rose-400', 'text-emerald-500 dark:text-emerald-400'];
                              return donutSegments.map((s, i) => (
                              <div key={i} className="flex items-center justify-between group/legend hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg px-2 py-1.5 -mx-2 transition-colors">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-800" style={{ backgroundColor: donutColors[i] }}></div>
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{s.label}</span>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs font-mono font-black ${textColors[i]}`}>{formatCurrency(s.value)}</span>
                                  <span className="text-[10px] font-bold text-slate-400 ml-1.5">{s.pct.toFixed(0)}%</span>
                                </div>
                              </div>
                            ));
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <button onClick={() => toggleDashSection('subs')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/section">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/30">
                            <RefreshCw className="text-rose-500 dark:text-rose-400" size={18} />
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Suscripciones</span>
                            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300`}>{subsActivas.length} activas</span>
                          </div>
                        </div>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${dashSections.subs ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.subs && (
                        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4 animate-slide-down">
                          {subsActivas.map(s => {
                            const monto = s.pagos?.[mes]?.monto || s.valor || 0;
                            return (
                              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-rose-100 dark:bg-rose-900/30 overflow-hidden">
                                  <div className="text-rose-500 dark:text-rose-400">{renderSubscriptionIcon(s)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 truncate">{s.descripcion}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400">Cobra día {s.diaPago || 1} · {s.billingCycle === 'mensual' ? 'Mensual' : 'Anual'}</span>
                                </div>
                                <span className="text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(monto)}</span>
                              </div>
                            );
                          })}
                          {subsActivas.length > 0 && (
                            <>
                              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarDays size={14} className="text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-400 uppercase">Próximos cobros</span>
                                </div>
                                <div className="space-y-1.5">
                                  {Object.entries(cobrosPorDia).map(([dia, cobros]) => (
                                    <div key={dia} className="flex items-center gap-2 text-xs">
                                      <span className="w-16 font-bold text-slate-500 dark:text-slate-400">Día {dia}</span>
                                      <span className="text-slate-400">{cobros.map(c => `${c.nombre} ${formatCurrency(c.monto)}`).join(', ')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                                <span className="text-sm font-mono font-black text-rose-500 dark:text-rose-400">{formatCurrency(totalSubs)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <button onClick={() => toggleDashSection('fijos')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group/section">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700">
                            <Receipt className="text-slate-500 dark:text-slate-400" size={18} />
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Gastos Fijos</span>
                            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>{gastosFijos.length} activos</span>
                          </div>
                        </div>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${dashSections.fijos ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.fijos && (
                        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4 animate-slide-down">
                          {gastosFijosList.map(g => (
                            <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${theme.bgLight} ${theme.bgLightDark} overflow-hidden`}>
                                <div className={theme.tabText}>{renderFixedIcon(g)}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200 truncate block">{g.descripcion}</span>
                              </div>
                              <span className="text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(g.monto)}</span>
                            </div>
                          ))}
                          {gastosFijosList.length > 0 && (
                            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                              <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                              <span className="text-sm font-mono font-black text-slate-500 dark:text-slate-400">{formatCurrency(totalGastos)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${saludBg}`}>
                          <Activity className={saludColor} size={18} />
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">Salud Financiera</span>
                      </div>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${saludBg}`}>{saludLabel}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-emerald-400" style={{ width: '60%' }}></div>
                            <div className="h-full bg-amber-400" style={{ width: '20%' }}></div>
                            <div className="h-full bg-rose-400" style={{ width: '20%' }}></div>
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-800 rounded-full shadow-md transition-all duration-500" style={{ left: `calc(${Math.min(pctGastado, 100)}% - 6px)` }}></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1">
                          <span>0%</span>
                          <span className="text-emerald-500">60%</span>
                          <span className="text-amber-500">80%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className={`text-2xl font-mono font-black ${saludColor}`}>{pctGastado.toFixed(0)}%</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">gastado</div>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    console.log('[PROJECTION] cuentasAhorro:', cuentasAhorro);
                    console.log('[PROJECTION] ahorrosData:', JSON.stringify(ahorrosData));
                    console.log('[PROJECTION] balancesPorCuenta keys:', Object.keys(balancesPorCuenta));

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

                    console.log('[PROJECTION] totalAhorroActual:', totalAhorroActual);
                    console.log('[PROJECTION] sortedMonths:', sortedMonths);
                    console.log('[PROJECTION] last6Months:', last6Months);
                    console.log('[PROJECTION] depositsByMonth:', depositsByMonth);
                    console.log('[PROJECTION] promedioMensual:', promedioMensual);

                    const proyeccion3Meses = totalAhorroActual + (promedioMensual * 3);
                    const proyeccion6Meses = totalAhorroActual + (promedioMensual * 6);

                    const maxDeposit = Math.max(...depositsByMonth, 1);
                    const trendUp = depositsByMonth.length >= 2 && depositsByMonth[depositsByMonth.length - 1] > depositsByMonth[depositsByMonth.length - 2];

                    const hasNoData = totalAhorroActual === 0 && promedioMensual === 0;

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <PiggyBank className="text-emerald-500 dark:text-emerald-400" size={18} />
                              </div>
                              <span className="text-sm font-black text-slate-700 dark:text-slate-200">Resumen de Ahorros</span>
                            </div>
                            {hasNoData ? (
                              <div className="text-center py-6">
                                <PiggyBank className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={36} />
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Sin datos de ahorro aún</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Ve a la pestaña <span className="font-bold text-emerald-500">Gestión de Ahorros</span> para registrar depósitos o gastos.</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                  <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">Balance total</span>
                                  <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalAhorroActual)}</div>
                                </div>
                                <div className="space-y-2">
                                  {cuentasAhorro.map(c => {
                                    const saldo = balancesPorCuenta[c.id]?.[mes]?.acumulado || 0;
                                    return (
                                      <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                                        <div>
                                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{c.nombre}</span>
                                          <span className="text-[10px] text-slate-400 ml-2">{c.banco}</span>
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

                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <TrendingUp className="text-indigo-500 dark:text-indigo-400" size={18} />
                              </div>
                              <span className="text-sm font-black text-slate-700 dark:text-slate-200">Proyección de Ahorro</span>
                              {promedioMensual > 0 && (
                                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                  {trendUp ? 'Tendencia +' : 'Estable'}
                                </span>
                              )}
                            </div>

                            {hasNoData ? (
                              <div className="text-center py-6">
                                <TrendingUp className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={36} />
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Sin historial de depósitos</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Registra depósitos en al menos un mes para ver tu proyección.</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Promedio mensual</span>
                                    <span className="text-xs font-mono font-black text-slate-600 dark:text-slate-300">{formatCurrency(promedioMensual)}</span>
                                  </div>
                                  <div className="flex gap-1 items-end h-8">
                                    {depositsByMonth.map((d, i) => (
                                      <div
                                        key={i}
                                        className="flex-1 rounded-sm bg-indigo-200 dark:bg-indigo-800/50 transition-all hover:bg-indigo-400 dark:hover:bg-indigo-600"
                                        style={{ height: `${Math.max((d / maxDeposit) * 100, 4)}%` }}
                                        title={last6Months[i]}
                                      ></div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                                    {last6Months.map((m, i) => (
                                      <span key={i} className="flex-1 text-center truncate">{m.split(' ')[0].substring(0, 3)}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">3 meses</span>
                                    <div className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(proyeccion3Meses)}</div>
                                  </div>
                                  <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">6 meses</span>
                                    <div className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(proyeccion6Meses)}</div>
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

        {activeTab === 'general' ? (
          <>
            <div className="flex justify-end gap-2 mb-4">
              <button onClick={() => { setEditingItem(null); setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, iconType: 'default', iconValue: 'layout', iconUrl: '' }); setDebtIconSearch(''); setIsAddingDebt(true); }} className={`flex items-center gap-2 ${theme.btnDebt} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                <CreditCard size={16} /> Nueva Cuota <Plus size={16} />
              </button>
              <button onClick={() => { setEditingItem(null); setNewFixed({ descripcion: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setIsAddingFixed(true); }} className={`flex items-center gap-2 ${theme.btnFixed} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                <Receipt size={16} /> Gasto Fijo <Plus size={16} />
              </button>
              <button onClick={() => { setEditingItem(null); setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setSubscriptionIconSearch(''); setIsAddingSub(true); }} className={`flex items-center gap-2 ${theme.btnSub} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                <RefreshCw size={16} /> Suscripciones <Plus size={16} />
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                      <th className="p-4 font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest sticky left-0 bg-white dark:bg-slate-800 z-20 border-r border-slate-100 dark:border-slate-700 min-w-[280px]">
                        Detalle de Gastos
                      </th>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <th key={mes} className={`p-3 min-w-[130px] text-center border-l border-slate-100 dark:border-slate-700 ${isEven ? 'bg-slate-50/80 dark:bg-slate-800/80' : 'bg-white dark:bg-slate-700/20'}`}>
                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{mes.split(' ')[1]}</div>
                            <div className="text-sm font-black text-slate-800 dark:text-slate-200">{mes.split(' ')[0]}</div>
                          </th>
                        );
                      })}
                          <th className={`p-3 min-w-[140px] text-center border-l border-slate-100 dark:border-slate-700 ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-20`}>
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp size={12} className={theme.tabText} />
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${theme.tabText}`}>Progreso</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsUnificados.length > 0 ? (
                      itemsUnificados.map(item => (
                        <tr key={item.id} className="border-b border-slate-50 dark:border-slate-700/50 group hover:bg-slate-50/30 dark:hover:bg-slate-700/20">
                          <td className="p-3 sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 z-10 border-r border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 overflow-hidden w-10 h-10 flex items-center justify-center">
                                  {item.tipo === 'cuota' ? renderDebtIcon(item) : item.tipo === 'suscripcion' ? renderSubscriptionIcon(item) : renderFixedIcon(item)}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-800 dark:text-slate-200 text-sm leading-tight">{item.descripcion}</span>
                                    {item.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Legal</span>}
                                    {item.tipo === 'suscripcion' && <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5"><RefreshCw size={10} /> Suscripcion</span>}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                    {item.tipo === 'cuota' ? `${item.mesInicio} — ${item.mesTermino}` : item.tipo === 'suscripcion' ? `${item.billingCycle === 'anual' ? 'Renova anual' : 'Renueva'} dia ${item.diaPago || 1}` : 'Gasto Fijo Recurrente'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEditItem(item)} className="p-1.5 text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => {
                                  if (item.tipo === 'cuota') setDeudas(deudas.filter(x => x.id !== item.id));
                                  else if (item.tipo === 'suscripcion') setSuscripciones(suscripciones.filter(x => x.id !== item.id));
                                  else setGastosFijos(gastosFijos.filter(x => x.id !== item.id));
                                }} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-slate-50/30 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-700/10';
                            if (item.tipo === 'cuota') {
                              const inRange = isMonthInRange(mes, item.mesInicio, item.mesTermino, item.isContribuciones);
                              const isPagado = item.pagos?.[mes]?.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-3 border-l border-slate-50 dark:border-slate-700/50 text-center ${!inRange ? 'bg-slate-50/40 dark:bg-slate-900/20 opacity-20' : cellBgBase}`}>
                                  {inRange && (
                                    <button
                                      onClick={() => {
                                        const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                                        setDeudas(deudas.map(x => x.id === item.id ? { ...x, pagos: { ...x.pagos, [mes]: { estado: next } } } : x));
                                      }}
                                      className={`w-full py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${isPagado ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-slate-500 shadow-sm'}`}
                                    >
                                      <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{isPagado ? 'Pagado' : 'Pendiente'}</span>
                                      <span className="text-xs font-mono font-black">{isPagado ? formatCurrency(item.valorCuota) : formatCurrency(item.valorCuota)}</span>
                                    </button>
                                  )}
                                </td>
                              );
                            } else if (item.tipo === 'suscripcion') {
                              const isActive = item.activeMonths && item.activeMonths.includes(mes);
                              const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                              const isPagado = pago.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-3 border-l border-slate-50 dark:border-slate-700/50 ${!isActive ? 'bg-slate-50/40 dark:bg-slate-900/20 opacity-20' : cellBgBase}`}>
                                  {isActive && (
                                    <div className="space-y-1.5">
                                      <div className="relative group/input">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 dark:text-slate-600">$</span>
                                        <input
                                          type="text"
                                          placeholder="0"
                                          value={pago.monto || item.valor ? new Intl.NumberFormat('es-CL').format(pago.monto || item.valor) : ''}
                                          onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                            const val = parseInt(raw) || 0;
                                            setSuscripciones(suscripciones.map(s => s.id === item.id ? { ...s, pagos: { ...s.pagos, [mes]: { ...(s.pagos?.[mes] || { estado: 'PENDIENTE' }), monto: val } } } : s));
                                          }}
                                          className="w-full bg-violet-50/50 dark:bg-violet-900/20 rounded-xl border-2 border-transparent focus:border-violet-500 text-center font-mono font-black text-xs outline-none py-1.5 pl-4 dark:text-slate-200"
                                        />
                                      </div>
                                      <button
                                        disabled={!((pago.monto || item.valor) > 0)}
                                        onClick={() => {
                                          const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                                          setSuscripciones(suscripciones.map(s => s.id === item.id ? { ...s, pagos: { ...s.pagos, [mes]: { ...(s.pagos?.[mes] || { monto: s.valor || 0 }), estado: next } } } : s));
                                        }}
                                        className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${!((pago.monto || item.valor) > 0) ? 'bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 border-slate-100 dark:border-slate-700' : isPagado ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-slate-400 dark:border-slate-500 hover:bg-slate-400 dark:hover:bg-slate-500 shadow-sm'}`}
                                      >
                                        {isPagado ? 'Pagado' : 'Pendiente'}
                                      </button>
                                    </div>
                                  )}
                                </td>
                              );
                            } else {
                              const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                              const isPagado = pago.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-3 border-l border-slate-50 dark:border-slate-700/50 ${cellBgBase}`}>
                                  <div className="space-y-1.5">
                                    <div className="relative group/input">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 dark:text-slate-600">$</span>
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={pago.monto ? new Intl.NumberFormat('es-CL').format(pago.monto) : ''}
                                        onChange={(e) => {
                                          const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                          updateFixedPayment(item.id, mes, 'monto', parseInt(raw) || 0);
                                        }}
                                        className="w-full bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border-2 border-transparent focus:border-indigo-500 text-center font-mono font-black text-xs outline-none py-1.5 pl-4 dark:text-slate-200"
                                      />
                                    </div>
                                    <button
                                      disabled={!(pago.monto > 0)}
                                      onClick={() => updateFixedPayment(item.id, mes, 'estado', isPagado ? 'PENDIENTE' : 'PAGADA')}
                                      className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${!(pago.monto > 0) ? 'bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 border-slate-100 dark:border-slate-700' : isPagado ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border-slate-400 dark:border-slate-500 hover:bg-slate-400 dark:hover:bg-slate-500 shadow-sm'}`}
                                    >
                                      {isPagado ? 'Pagado' : 'Pendiente'}
                                    </button>
                                  </div>
                                </td>
                              );
                            }
                          })}
                          {item.tipo === 'cuota' ? (
                            <td className={`p-3 border-l border-slate-50 dark:border-slate-700/50 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-10`}>
                              {(() => {
                                const mesTermino = calculateEndDate(item.mesInicio, item.cuotasTotales, item.isContribuciones);
                                let cur = toDateVal(item.mesInicio);
                                const end = toDateVal(mesTermino);
                                let pagadas = 0;
                                while (cur <= end) {
                                  const mName = fromDateVal(cur);
                                  if (!item.isContribuciones || ['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(mName.split(' ')[0])) {
                                    if (item.pagos?.[mName]?.estado === 'PAGADA') pagadas++;
                                  }
                                  cur++;
                                }
                                const totalCuotas = item.cuotasTotales;
                                const faltantes = totalCuotas - pagadas;
                                const pct = totalCuotas > 0 ? (pagadas / totalCuotas) * 100 : 0;
                                return (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className={`text-[10px] font-black ${theme.tabText}`}>{pagadas}/{totalCuotas} pagadas</span>
                                    <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-600/60 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                    <span className={`text-[9px] font-bold ${theme.tabText} opacity-60`}>{faltantes} faltante{faltantes !== 1 ? 's' : ''}</span>
                                  </div>
                                );
                              })()}
                            </td>
                          ) : (
                            <td className={`p-3 border-l border-slate-50 dark:border-slate-700/50 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-10`}>
                              <span className={`text-xs ${theme.tabText} opacity-30`}>—</span>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={filteredMonths.length + 2} className="p-24 text-center text-slate-300 font-bold italic">No hay registros para mostrar</td></tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-black">
                    <tr className={`border-t-4 ${theme.borderAccent} divide-x divide-slate-800`}>
                      <td className="p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CreditCard size={20} />
                          <span className="uppercase text-xs tracking-widest">Total Cuotas</span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-sm font-mono text-slate-300">{formatCurrency(totalesMensuales[mes].cuotas)}</div>
                          </td>
                        );
                      })}
                      <td className={`p-3 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800">
                      <td className="p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Receipt size={20} />
                          <span className="uppercase text-xs tracking-widest">Total Gastos Fijos</span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-sm font-mono text-slate-400">{formatCurrency(totalesMensuales[mes].gastos)}</div>
                          </td>
                        );
                      })}
                      <td className={`p-3 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800">
                      <td className="p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-rose-400">
                          <RefreshCw size={20} />
                          <span className="uppercase text-xs tracking-widest">Total Suscripciones</span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-sm font-mono text-rose-400">{formatCurrency(totalesMensuales[mes].suscripciones)}</div>
                          </td>
                        );
                      })}
                      <td className={`p-3 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className={`border-t-4 ${theme.borderAccent} divide-x divide-slate-800`}>
                      <td className="p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <ArrowUpCircle size={20} />
                          <span className="uppercase text-xs tracking-widest">Sueldo del Mes</span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <input
                              type="text"
                              value={sueldos[mes] ? new Intl.NumberFormat('es-CL').format(sueldos[mes]) : ''}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                setSueldos({ ...sueldos, [mes]: parseInt(raw) || 0 });
                              }}
                              placeholder="$ Monto"
                              className={`w-full bg-slate-700/50 rounded-xl py-2 px-3 text-center text-cyan-400 font-mono outline-none border border-slate-600 focus:border-cyan-500 transition-all placeholder:text-slate-500`}
                            />
                          </td>
                        );
                      })}
                      <td className={`p-3 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800 bg-slate-950">
                      <td className="p-4 sticky left-0 bg-slate-950 z-30 border-r border-slate-800 flex items-center gap-3">
                        <Wallet className="text-emerald-400" size={24} />
                        <span className="uppercase text-sm">Disponible</span>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-950' : 'bg-slate-900/80'}`}>
                            <div className={`text-lg font-mono ${totalesMensuales[mes].neto >= 0 ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                              {formatCurrency(totalesMensuales[mes].neto)}
                            </div>
                          </td>
                        );
                      })}
                      <td className={`p-3 text-center ${theme.bgLight} ${theme.bgLightDark} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'ahorros' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <PiggyBank className={theme.tabText} /> Mis Cuentas de Ahorro
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={getSavingsPlan}
                  disabled={isAiLoading}
                  className={`flex items-center gap-2 ${theme.bgLight} ${theme.bgLightDark} ${theme.badgeText} dark:${theme.badgeTextDark} ${theme.borderAccent} ${theme.badgeBgDark} hover:opacity-80 px-4 py-2 rounded-xl text-sm font-black transition-all disabled:opacity-50`}
                >
                  {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Lightbulb size={18} />}
                  Estrategia IA ✨
                </button>
                <button onClick={() => setIsAddingAccount(true)} className={`flex items-center gap-2 ${theme.btnPrimary} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                  <Plus size={18} /> Nueva Cuenta
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                      <th className="p-4 text-left font-black text-slate-400 uppercase text-[10px] tracking-widest sticky left-0 bg-slate-50 dark:bg-slate-800 z-20 min-w-[260px]">Cuentas / Bancos</th>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <th key={mes} className={`p-3 text-center min-w-[140px] border-l border-slate-100 dark:border-slate-700 ${isEven ? 'bg-slate-50/80 dark:bg-slate-800/80' : 'bg-white/50 dark:bg-slate-700/30'}`}>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{mes.split(' ')[1]}</div>
                            <div className="text-sm font-black text-slate-800 dark:text-slate-200">{mes.split(' ')[0]}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {cuentasAhorro.map(cuenta => (
                      <React.Fragment key={cuenta.id}>
                        <tr className="bg-slate-50/30 dark:bg-slate-800/30">
                          <td className="p-3 sticky left-0 bg-white dark:bg-slate-800 z-10 border-r border-slate-100 dark:border-slate-700 font-black text-xs uppercase tracking-widest" style={{ color: THEME_COLOR_HEX[themeColor] || THEME_COLOR_HEX.indigo }}>
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-2">
                                <Building2 size={14} /> {cuenta.banco} - {cuenta.nombre}
                              </div>
                              <button onClick={() => setCuentasAhorro(cuentasAhorro.filter(c => c.id !== cuenta.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-700/20';
                            return (
                              <td key={mes} className={`p-3 border-l border-slate-100 dark:border-slate-700 ${cellBgBase}`}>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="flex flex-col gap-0.5">
                                    <label className="text-[8px] font-black text-emerald-500 uppercase">Ahorro</label>
                                    <input
                                      type="text"
                                      placeholder="+$"
                                      value={ahorrosData[cuenta.id]?.[mes]?.deposito ? new Intl.NumberFormat('es-CL').format(ahorrosData[cuenta.id][mes].deposito) : ''}
                                      onChange={(e) => {
                                        const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                        updateSavingData(cuenta.id, mes, 'deposito', parseInt(raw) || 0);
                                      }}
                                      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-center font-mono font-black text-xs p-1 rounded-md border-transparent border-2 focus:border-emerald-300 outline-none"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <label className="text-[8px] font-black text-rose-500 uppercase">Gasto</label>
                                    <input
                                      type="text"
                                      placeholder="-$"
                                      value={ahorrosData[cuenta.id]?.[mes]?.gasto ? new Intl.NumberFormat('es-CL').format(ahorrosData[cuenta.id][mes].gasto) : ''}
                                      onChange={(e) => {
                                        const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                        updateSavingData(cuenta.id, mes, 'gasto', parseInt(raw) || 0);
                                      }}
                                      className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-center font-mono font-black text-xs p-1 rounded-md border-transparent border-2 focus:border-rose-300 outline-none"
                                    />
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-slate-700">
                          <td className="p-2 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 border-r border-slate-100 dark:border-slate-700 text-right pr-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Saldo Acumulado {cuenta.nombre}</span>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-slate-50/50 dark:bg-slate-800/50' : 'bg-slate-100/30 dark:bg-slate-700/30';
                            return (
                              <td key={mes} className={`p-2 border-l border-slate-100 dark:border-slate-700 text-center ${cellBgBase}`}>
                                <div className="text-xs font-mono font-black text-slate-600 dark:text-slate-400">
                                  {formatCurrency(balancesPorCuenta[cuenta.id]?.[mes]?.acumulado)}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                  <tfoot className={`${theme.btnPrimary} text-white font-black`}>
                    <tr>
                      <td className={`p-4 sticky left-0 ${theme.btnPrimary} z-30 flex items-center gap-3`}>
                        <TrendingUp size={24} />
                        <span className="uppercase text-sm">Ahorro Total Acumulado</span>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center text-lg font-mono ${isEven ? '' : ''}`}>
                            {formatCurrency(totalAhorroMensual[mes])}
                          </td>
                        );
                      })}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {isAddingDebt && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <CreditCard className={theme.tabText} /> {editingItem ? 'Editar Cuota' : 'Nueva Cuota'}
                </h3>
                <button onClick={() => { setIsAddingDebt(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X /></button>
              </div>
              <form onSubmit={handleSaveDebt} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Descripción</label>
                  <input required value={newDebt.descripcion} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all ${newDebt.isContribuciones ? 'text-slate-500 cursor-not-allowed' : ''} dark:text-slate-200`} placeholder="Ej: Notebook, Vacaciones..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Cuotas Totales</label>
                    <input type="number" required value={newDebt.cuotasTotales} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, cuotasTotales: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all ${newDebt.isContribuciones ? 'text-slate-500 cursor-not-allowed' : ''} dark:text-slate-200`} />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Valor Cuota</label>
                    <input type="number" required value={newDebt.valorCuota} onChange={e => setNewDebt({ ...newDebt, valorCuota: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Mes de Inicio</label>
                  <input
                    type="month"
                    required
                    value={monthStrToMonthInput(newDebt.mesInicio)}
                    onChange={handleMesInicioChange}
                    className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                  />
                </div>
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
                  <input type="checkbox" id="contrib" checked={newDebt.isContribuciones} onChange={handleContribucionesChange} className="w-5 h-5 rounded-md accent-amber-600" />
                  <label htmlFor="contrib" className="text-xs font-bold text-amber-800 dark:text-amber-200">Es Contribución Legal (Solo 4 cuotas fijas al año)</label>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Icono (opcional)</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'default' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newDebt.iconType === 'default' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Por defecto</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'preset' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newDebt.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Iconos</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'url' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newDebt.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>URL</button>
                  </div>

                  {newDebt.iconType === 'preset' && (
                    <div>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={debtIconSearch}
                          onChange={(e) => setDebtIconSearch(e.target.value)}
                          className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                          placeholder="Buscar icono..."
                        />
                      </div>
                      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredDebtIcons.length > 0 ? filteredDebtIcons.map(i => (
                          <button type="button" key={i.id} onClick={() => setNewDebt({ ...newDebt, iconValue: i.id })} className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newDebt.iconValue === i.id ? `${theme.borderTheme} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
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
                    <input value={newDebt.iconUrl} onChange={e => setNewDebt({ ...newDebt, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  )}
                </div>
                <button type="submit" className={`w-full ${theme.btnPrimary} text-white py-4 rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-4`}>Guardar Registro</button>
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
                  <input required value={newFixed.descripcion} onChange={e => setNewFixed({ ...newFixed, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Ej: Gastos Comunes, Luz, Internet..." />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'preset' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newFixed.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Iconos Predefinidos</button>
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'url' })} className={`py-2 rounded-lg text-xs font-black border-2 transition-all ${newFixed.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>URL Imagen</button>
                </div>

                {newFixed.iconType === 'preset' ? (
                  <div>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={fixedIconSearch}
                        onChange={(e) => setFixedIconSearch(e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                        placeholder="Buscar icono..."
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredFixedIcons.length > 0 ? filteredFixedIcons.map(i => (
                        <button type="button" key={i.id} onClick={() => setNewFixed({ ...newFixed, iconValue: i.id })} className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newFixed.iconValue === i.id ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
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
                    <input value={newFixed.iconUrl} onChange={e => setNewFixed({ ...newFixed, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  </div>
                )}

                <button type="submit" className={`w-full ${theme.btnPrimary} text-white py-4 rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-4`}>Registrar Gasto</button>
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

        {isAddingSub && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <RefreshCw className={theme.tabText} /> {editingItem?.tipo === 'suscripcion' ? 'Editar Suscripcion' : 'Nueva Suscripcion'}
                </h3>
                <button onClick={() => { setIsAddingSub(false); setEditingItem(null); setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setSubscriptionIconSearch(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X /></button>
              </div>
              <form onSubmit={handleSaveSubscription} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Servicio</label>
                  <input required value={newSub.descripcion} onChange={e => setNewSub({ ...newSub, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Ej: Netflix, Spotify, YouTube..." />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Valor</label>
                  <input type="number" required value={newSub.valor} onChange={e => setNewSub({ ...newSub, valor: parseInt(e.target.value) || 0 })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Monto a pagar" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Plan de facturacion</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setNewSub({ ...newSub, billingCycle: 'mensual' })} className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all ${newSub.billingCycle === 'mensual' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Mensual</button>
                    <button type="button" onClick={() => setNewSub({ ...newSub, billingCycle: 'anual' })} className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all ${newSub.billingCycle === 'anual' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>Anual</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Duracion (años)</label>
                    <select value={newSub.durationYears} onChange={e => setNewSub({ ...newSub, durationYears: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}>
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'año' : 'años'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Dia de pago</label>
                    <input type="number" min="1" max="28" required value={newSub.diaPago} onChange={e => setNewSub({ ...newSub, diaPago: parseInt(e.target.value) || 1 })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Mes de inicio</label>
                  <input
                    type="month"
                    required
                    value={monthStrToMonthInput(newSub.mesInicio)}
                    onChange={e => setNewSub({ ...newSub, mesInicio: monthInputToMonthStr(e.target.value) })}
                    className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Icono</label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={subscriptionIconSearch}
                      onChange={(e) => setSubscriptionIconSearch(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                      placeholder="Buscar icono..."
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredSubscriptionIcons.length > 0 ? filteredSubscriptionIcons.map(i => (
                      <button type="button" key={i.id} onClick={() => setNewSub({ ...newSub, iconType: 'preset', iconValue: i.id })} className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${newSub.iconValue === i.id && newSub.iconType === 'preset' ? `${theme.borderAccent} ${theme.btnSub} text-white` : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                        <i.icon size={16} />
                        <span className="text-[7px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                      </button>
                    )) : (
                      <div className="col-span-5 text-center py-4 text-xs font-bold text-slate-400">No se encontraron iconos</div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setNewSub({ ...newSub, iconType: 'url' })} className={`flex-1 py-2 rounded-lg text-xs font-black border-2 transition-all ${newSub.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>URL Imagen</button>
                  </div>
                  {newSub.iconType === 'url' && (
                    <input value={newSub.iconUrl} onChange={e => setNewSub({ ...newSub, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl px-4 py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200 mt-2`} placeholder="https://ejemplo.com/logo.png" />
                  )}
                </div>

                <button type="submit" className={`w-full ${theme.btnSub} text-white py-4 rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-4`}>Guardar Suscripcion</button>
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
