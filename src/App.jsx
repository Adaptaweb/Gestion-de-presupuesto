import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  TrendingDown,
  Plus,
  Trash2,
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
  Sun,
  Moon,
  ArrowDownCircle,
  Building2,
  ListChecks,
  Settings2,
  ImageIcon,
  Sparkles,
  Lightbulb,
  Loader2,
  ChevronRight,
  TrendingUp,
  MinusCircle,
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
  Calendar,
  Activity
} from 'lucide-react';
import Login from './Login.jsx';
import Register from './Register.jsx';
import AdminPanel from './AdminPanel.jsx';
import TutorialFlow from './components/TutorialFlow.jsx';
import Transacciones from './Transacciones.jsx';
import { UserMenu } from './components/user-dropdown';
import CategoriasConfig from './components/CategoriasConfig.jsx';
import { useCategorias } from './hooks/useCategorias.js';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';
import { usePushNotifications } from './hooks/usePushNotifications.js';
import { useInstallPrompt } from './hooks/useInstallPrompt.js';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const INITIAL_MONTHS = [
  'Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026',
  'Julio 2026', 'Agosto 2026', 'Septiembre 2026', 'Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'
];

const THEMES = {
  kk: {
    btnPrimary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    shadowBtn: 'shadow-emerald-100 dark:shadow-emerald-900/30',
    focusBorder: 'focus:border-emerald-500',
    hoverBorder: 'hover:border-emerald-300',
    iconAccent: 'text-emerald-400',
    iconAccentDark: 'dark:text-emerald-300',
    bgLight: 'bg-emerald-50/50',
    bgLightDark: 'dark:bg-emerald-900/20',
    bgLightSolid: 'bg-emerald-50',
    bgLightDarkSolid: 'dark:bg-emerald-900',
    badgeBg: 'bg-emerald-100',
    badgeBgDark: 'dark:bg-emerald-900/30',
    badgeText: 'text-emerald-700',
    badgeTextDark: 'dark:text-emerald-300',
    tabText: 'text-emerald-600',
    headerIcon: 'bg-emerald-500',
    headerIconShadow: 'shadow-emerald-200 dark:shadow-emerald-900/30',
    btnDebt: 'bg-blue-600 hover:bg-blue-700 text-white',
    btnFixed: 'bg-sky-500 hover:bg-sky-600 text-white',
    btnSub: 'bg-rose-600 hover:bg-rose-700 text-white',
    modalPrimary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    borderAccent: 'border-emerald-500',
    bgModalLight: 'bg-emerald-50 dark:bg-emerald-900/30',
    inputBg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
  },
  indigo: {
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-700',
    shadowBtn: 'shadow-indigo-100 dark:shadow-indigo-900/30',
    focusBorder: 'focus:border-indigo-500',
    hoverBorder: 'hover:border-indigo-300',
    iconAccent: 'text-indigo-400',
    iconAccentDark: 'dark:text-indigo-300',
    bgLight: 'bg-indigo-50/50',
    bgLightDark: 'dark:bg-indigo-900/20',
    bgLightSolid: 'bg-indigo-50',
    bgLightDarkSolid: 'dark:bg-indigo-900',
    badgeBg: 'bg-indigo-100',
    badgeBgDark: 'dark:bg-indigo-900/30',
    badgeText: 'text-indigo-700',
    badgeTextDark: 'dark:text-indigo-300',
    tabText: 'text-indigo-600',
    headerIcon: 'bg-indigo-600',
    headerIconShadow: 'shadow-indigo-200 dark:shadow-indigo-900/30',
    btnDebt: 'bg-indigo-600 hover:bg-indigo-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
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
    bgLightSolid: 'bg-blue-50',
    bgLightDarkSolid: 'dark:bg-blue-900',
    badgeBg: 'bg-blue-100',
    badgeBgDark: 'dark:bg-blue-900/30',
    badgeText: 'text-blue-700',
    badgeTextDark: 'dark:text-blue-300',
    tabText: 'text-blue-600',
    headerIcon: 'bg-blue-600',
    headerIconShadow: 'shadow-blue-200 dark:shadow-blue-900/30',
    btnDebt: 'bg-blue-600 hover:bg-blue-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
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
    bgLightSolid: 'bg-emerald-50',
    bgLightDarkSolid: 'dark:bg-emerald-900',
    badgeBg: 'bg-emerald-100',
    badgeBgDark: 'dark:bg-emerald-900/30',
    badgeText: 'text-emerald-700',
    badgeTextDark: 'dark:text-emerald-300',
    tabText: 'text-emerald-600',
    headerIcon: 'bg-emerald-600',
    headerIconShadow: 'shadow-emerald-200 dark:shadow-emerald-900/30',
    btnDebt: 'bg-emerald-600 hover:bg-emerald-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
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
    bgLightSolid: 'bg-purple-50',
    bgLightDarkSolid: 'dark:bg-purple-900',
    badgeBg: 'bg-purple-100',
    badgeBgDark: 'dark:bg-purple-900/30',
    badgeText: 'text-purple-700',
    badgeTextDark: 'dark:text-purple-300',
    tabText: 'text-purple-600',
    headerIcon: 'bg-purple-600',
    headerIconShadow: 'shadow-purple-200 dark:shadow-purple-900/30',
    btnDebt: 'bg-purple-600 hover:bg-purple-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
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
    bgLightSolid: 'bg-rose-50',
    bgLightDarkSolid: 'dark:bg-rose-900',
    badgeBg: 'bg-rose-100',
    badgeBgDark: 'dark:bg-rose-900/30',
    badgeText: 'text-rose-700',
    badgeTextDark: 'dark:text-rose-300',
    tabText: 'text-rose-600',
    headerIcon: 'bg-rose-600',
    headerIconShadow: 'shadow-rose-200 dark:shadow-rose-900/30',
    btnDebt: 'bg-rose-600 hover:bg-rose-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
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
    bgLightSolid: 'bg-amber-50',
    bgLightDarkSolid: 'dark:bg-amber-900',
    badgeBg: 'bg-amber-100',
    badgeBgDark: 'dark:bg-amber-900/30',
    badgeText: 'text-amber-700',
    badgeTextDark: 'dark:text-amber-300',
    tabText: 'text-amber-600',
    headerIcon: 'bg-amber-600',
    headerIconShadow: 'shadow-amber-200 dark:shadow-amber-900/30',
    btnDebt: 'bg-amber-600 hover:bg-amber-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
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
    bgLightSolid: 'bg-teal-50',
    bgLightDarkSolid: 'dark:bg-teal-900',
    badgeBg: 'bg-teal-100',
    badgeBgDark: 'dark:bg-teal-900/30',
    badgeText: 'text-teal-700',
    badgeTextDark: 'dark:text-teal-300',
    tabText: 'text-teal-600',
    headerIcon: 'bg-teal-600',
    headerIconShadow: 'shadow-teal-200 dark:shadow-teal-900/30',
    btnDebt: 'bg-teal-600 hover:bg-teal-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-teal-600 hover:bg-teal-700',
    borderAccent: 'border-teal-600',
    bgModalLight: 'bg-teal-50 dark:bg-teal-900/30',
    inputBg: 'bg-teal-50/50 dark:bg-teal-900/20',
  },
  slate: {
    btnPrimary: 'bg-slate-600 hover:bg-slate-700',
    shadowBtn: 'shadow-slate-100 dark:shadow-dark-darker/30',
    focusBorder: 'focus:border-slate-500',
    hoverBorder: 'hover:border-slate-300',
    iconAccent: 'text-slate-400',
    iconAccentDark: 'dark:text-slate-300',
    bgLight: 'bg-slate-50/50',
    bgLightDark: 'dark:bg-dark-darker/20',
    bgLightSolid: 'bg-slate-50',
    bgLightDarkSolid: 'dark:bg-dark-darker',
    badgeBg: 'bg-slate-100',
    badgeBgDark: 'dark:bg-dark-darker/30',
    badgeText: 'text-slate-700',
    badgeTextDark: 'dark:text-slate-300',
    tabText: 'text-slate-600',
    headerIcon: 'bg-slate-600',
    headerIconShadow: 'shadow-slate-200 dark:shadow-dark-darker/30',
    btnDebt: 'bg-slate-600 hover:bg-slate-700',
    btnFixed: 'bg-slate-800 dark:bg-dark-lighter hover:bg-slate-900 dark:hover:bg-dark-lightest',
    btnSub: 'bg-rose-600 hover:bg-rose-700',
    modalPrimary: 'bg-slate-600 hover:bg-slate-700',
    borderAccent: 'border-slate-600',
    bgModalLight: 'bg-slate-50 dark:bg-dark-darker/30',
    inputBg: 'bg-slate-50/50 dark:bg-dark-darker/20',
  },
};

const THEME_COLORS = ['kk', 'indigo', 'blue', 'emerald', 'purple', 'rose', 'amber', 'teal', 'slate'];
const THEME_COLOR_HEX = {
  kk: '#059669',
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

const BANCOS_CHILE = [
  { id: 'banco-de-chile', nombre: 'Banco de Chile', logo: '/bancos/banco-de-chile.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-santander', nombre: 'Banco Santander', logo: '/bancos/banco-santander.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-estado', nombre: 'BancoEstado', logo: '/bancos/banco-estado.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-de-credito', nombre: 'Banco de Crédito e Inversiones (BCI)', logo: '/bancos/banco-de-credito.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-scotiabank', nombre: 'Scotiabank Chile', logo: '/bancos/banco-scotiabank.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-itau', nombre: 'Itaú Corpbanca', logo: '/bancos/banco-itau.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-falabella', nombre: 'Banco Falabella', logo: '/bancos/banco-falabella.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-ripley', nombre: 'Banco Ripley', logo: '/bancos/banco-ripley.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-paris', nombre: 'Banco Paris', logo: '/bancos/banco-paris.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-cencosud', nombre: 'Banco Cencosud', logo: '/bancos/banco-cencosud.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-security', nombre: 'Banco Security', logo: '/bancos/banco-security.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-rabobank', nombre: 'Rabobank Chile', logo: '/bancos/banco-rabobank.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-internacional', nombre: 'Banco Internacional', logo: '/bancos/banco-internacional.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-bice', nombre: 'Banco BICE', logo: '/bancos/banco-bice.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-hsbc', nombre: 'HSBC Bank Chile', logo: '/bancos/banco-hsbc.png', tipos: ['visa', 'mastercard'] },
  { id: 'coopeuch', nombre: 'Coopeuch', logo: '/bancos/coopeuch.png', tipos: ['visa', 'mastercard'] },
  { id: 'banco-consorcio', nombre: 'Banco Consorcio', logo: '/bancos/banco-consorcio.png', tipos: ['visa', 'mastercard'] },
  { id: 'tenpo', nombre: 'Tenpo', logo: '/bancos/tenpo.png', tipos: ['visa', 'mastercard'] },
  { id: 'mach', nombre: 'Mach', logo: '/bancos/mach.png', tipos: ['visa', 'mastercard'] },
  { id: 'lider', nombre: 'Banco Líder', logo: '/bancos/lider.png', tipos: ['visa', 'mastercard'] },
  { id: 'mercadopago', nombre: 'Mercado Pago', logo: '/bancos/mercadopago.png', tipos: ['visa', 'mastercard'] }
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

const CHILE_PRESET_ICONS = {
  bancos: [
    { id: 'banco_bice', label: 'Banco BICE', path: '/chile-icons/bancos/banco_bice.png', keywords: 'bice banco' },
    { id: 'banco_de_chile', label: 'Banco de Chile', path: '/chile-icons/bancos/banco_de_chile.png', keywords: 'banco chile' },
    { id: 'banco_do_brasil', label: 'Banco do Brasil', path: '/chile-icons/bancos/banco_do_brasil.png', keywords: 'brasil banco' },
    { id: 'banco_estado', label: 'BancoEstado', path: '/chile-icons/bancos/banco_estado.png', keywords: 'estado banco' },
    { id: 'banco_falabella', label: 'Banco Falabella', path: '/chile-icons/bancos/banco_falabella.png', keywords: 'falabella banco' },
    { id: 'banco_internacional', label: 'Banco Internacional', path: '/chile-icons/bancos/banco_internacional.png', keywords: 'internacional banco' },
    { id: 'banco_ripley', label: 'Banco Ripley', path: '/chile-icons/bancos/banco_ripley.png', keywords: 'ripley banco' },
    { id: 'banco_security', label: 'Banco Security', path: '/chile-icons/bancos/banco_security.png', keywords: 'security banco' },
    { id: 'bbva', label: 'BBVA', path: '/chile-icons/bancos/bbva.png', keywords: 'bbva banco' },
    { id: 'bci', label: 'BCI', path: '/chile-icons/bancos/bci.png', keywords: 'bci banco credito inversiones' },
    { id: 'consorcio', label: 'Consorcio', path: '/chile-icons/bancos/consorcio.png', keywords: 'consorcio banco' },
    { id: 'coopeuch', label: 'Coopeuch', path: '/chile-icons/bancos/coopeuch.png', keywords: 'coopeuch banco' },
    { id: 'corpbanca', label: 'Corpbanca', path: '/chile-icons/bancos/corpbanca.png', keywords: 'corpbanca banco itau' },
    { id: 'hsbc', label: 'HSBC', path: '/chile-icons/bancos/hsbc.png', keywords: 'hsbc banco' },
    { id: 'itau', label: 'Itaú', path: '/chile-icons/bancos/itau.png', keywords: 'itau banco corpbanca' },
    { id: 'paris', label: 'París', path: '/chile-icons/bancos/paris.png', keywords: 'paris banco' },
    { id: 'prepago_los_heroes', label: 'Prepago Los Héroes', path: '/chile-icons/bancos/prepago_los_heroes.png', keywords: 'prepago heroes heroes' },
    { id: 'santander', label: 'Santander', path: '/chile-icons/bancos/santander.png', keywords: 'santander banco' },
    { id: 'scotiabank', label: 'Scotiabank', path: '/chile-icons/bancos/scotiabank.png', keywords: 'scotiabank banco' },
    { id: 'mercadopago', label: 'Mercado Pago', path: '/chile-icons/medios-pago/mercadopago.png', keywords: 'mercadopago banco pago' },
  ],
  isapres: [
    { id: 'banmedica', label: 'Banmédica', path: '/chile-icons/isapres/banmedica.png', keywords: 'banmedica isapre salud' },
    { id: 'colmena', label: 'Colmena', path: '/chile-icons/isapres/colmena.png', keywords: 'colmena isapre salud' },
    { id: 'consalud', label: 'Consalud', path: '/chile-icons/isapres/consalud.png', keywords: 'consalud isapre salud' },
    { id: 'cruz_blanca', label: 'Cruz Blanca', path: '/chile-icons/isapres/cruz_blanca.png', keywords: 'cruz blanca isapre salud' },
    { id: 'vidatres', label: 'Vida Tres', path: '/chile-icons/isapres/vidatres.png', keywords: 'vidatres vida tres isapre salud' },
  ],
  afp: [
    { id: 'capital', label: 'Capital', path: '/chile-icons/afp/capital.png', keywords: 'capital afp' },
    { id: 'cuprum', label: 'Cuprum', path: '/chile-icons/afp/cuprum.png', keywords: 'cuprum afp' },
    { id: 'habitat', label: 'Habitat', path: '/chile-icons/afp/habitat.png', keywords: 'habitat afp' },
    { id: 'modelo', label: 'Modelo', path: '/chile-icons/afp/modelo.png', keywords: 'modelo afp' },
    { id: 'plan_vital', label: 'PlanVital', path: '/chile-icons/afp/plan_vital.png', keywords: 'plan vital afp' },
    { id: 'provida', label: 'Provida', path: '/chile-icons/afp/provida.png', keywords: 'provida afp' },
    { id: 'sura', label: 'SURA', path: '/chile-icons/afp/sura.png', keywords: 'sura afp' },
  ],
  telefonia: [
    { id: 'claro', label: 'Claro', path: '/chile-icons/telefonia/claro.png', keywords: 'claro telefono celular' },
    { id: 'entel', label: 'Entel', path: '/chile-icons/telefonia/entel.png', keywords: 'entel telefono celular' },
    { id: 'movistar', label: 'Movistar', path: '/chile-icons/telefonia/movistar.png', keywords: 'movistar telefono celular' },
    { id: 'virgin', label: 'Virgin', path: '/chile-icons/telefonia/virgin.png', keywords: 'virgin telefono celular' },
    { id: 'wom', label: 'WOM', path: '/chile-icons/telefonia/wom.png', keywords: 'wom telefono celular' },
  ],
  gas: [
    { id: 'abastible', label: 'Abastible', path: '/chile-icons/gas/abastible.png', keywords: 'abastible gas' },
    { id: 'gasco', label: 'Gasco', path: '/chile-icons/gas/gasco.png', keywords: 'gasco gas' },
    { id: 'lipigas', label: 'Lipigas', path: '/chile-icons/gas/lipigas.png', keywords: 'lipigas gas' },
    { id: 'metrogas', label: 'Metrogas', path: '/chile-icons/gas/metrogas.png', keywords: 'metrogas gas' },
  ],
  agua: [
    { id: 'aguas_andinas', label: 'Aguas Andinas', path: '/chile-icons/agua/aguas_andinas.png', keywords: 'aguas andinas agua' },
    { id: 'aguas_nuevas', label: 'Aguas Nuevas', path: '/chile-icons/agua/aguas_nuevas.png', keywords: 'aguas nuevas agua' },
    { id: 'essbio', label: 'Essbio', path: '/chile-icons/agua/essbio.png', keywords: 'essbio agua' },
    { id: 'nuevosur', label: 'Nuevosur', path: '/chile-icons/agua/nuevosur.png', keywords: 'nuevosur agua' },
  ],
  tickets: [
    { id: 'amipass', label: 'Amipass', path: '/chile-icons/tickets/amipass.png', keywords: 'amipass ticket restaurant' },
    { id: 'cornershop', label: 'Cornershop', path: '/chile-icons/tickets/cornershop.png', keywords: 'cornershop delivery' },
    { id: 'edenred', label: 'Edenred', path: '/chile-icons/tickets/edenred.png', keywords: 'edenred ticket restaurant' },
    { id: 'glovo', label: 'Glovo', path: '/chile-icons/tickets/glovo.png', keywords: 'glovo delivery' },
    { id: 'pedidos_ya', label: 'PedidosYa', path: '/chile-icons/tickets/pedidos_ya.png', keywords: 'pedidos ya delivery' },
    { id: 'rappi', label: 'Rappi', path: '/chile-icons/tickets/rappi.png', keywords: 'rappi delivery' },
    { id: 'sodexo', label: 'Sodexo', path: '/chile-icons/tickets/sodexo.png', keywords: 'sodexo ticket restaurant' },
    { id: 'ticket_restaurant', label: 'Ticket Restaurant', path: '/chile-icons/tickets/ticket_restaurant.png', keywords: 'ticket restaurant' },
    { id: 'uber_eats', label: 'Uber Eats', path: '/chile-icons/tickets/uber_eats.png', keywords: 'uber eats delivery' },
  ],
  'medios-pago': [
    { id: 'fpay', label: 'Fpay', path: '/chile-icons/medios-pago/fpay.png', keywords: 'fpay pago' },
    { id: 'khipu', label: 'Khipu', path: '/chile-icons/medios-pago/khipu.png', keywords: 'khipu pago' },
    { id: 'mach', label: 'Mach', path: '/chile-icons/medios-pago/mach.png', keywords: 'mach pago banco' },
    { id: 'mercadopago', label: 'Mercado Pago', path: '/chile-icons/medios-pago/mercadopago.png', keywords: 'mercadopago mercado pago' },
    { id: 'multicaja', label: 'Multicaja', path: '/chile-icons/medios-pago/multicaja.png', keywords: 'multicaja pago' },
    { id: 'one_pay', label: 'OnePay', path: '/chile-icons/medios-pago/one_pay.png', keywords: 'onepay one pay pago' },
    { id: 'paypal', label: 'PayPal', path: '/chile-icons/medios-pago/paypal.png', keywords: 'paypal pago' },
    { id: 'redcompra', label: 'Redcompra', path: '/chile-icons/medios-pago/redcompra.png', keywords: 'redcompra pago' },
    { id: 'transbank', label: 'Transbank', path: '/chile-icons/medios-pago/transbank.png', keywords: 'transbank pago' },
    { id: 'webpay', label: 'Webpay', path: '/chile-icons/medios-pago/webpay.png', keywords: 'webpay pago' },
  ],
  tarjetas: [
    { id: 'american_express', label: 'American Express', path: '/chile-icons/tarjetas/american_express.png', keywords: 'american express tarjeta credito' },
    { id: 'dinners_club', label: "Dinner's Club", path: '/chile-icons/tarjetas/dinners_club.png', keywords: 'dinners club tarjeta credito' },
    { id: 'magna', label: 'Magna', path: '/chile-icons/tarjetas/magna.png', keywords: 'magna tarjeta credito' },
    { id: 'master_card', label: 'MasterCard', path: '/chile-icons/tarjetas/master_card.png', keywords: 'mastercard tarjeta credito' },
    { id: 'visa', label: 'Visa', path: '/chile-icons/tarjetas/visa.png', keywords: 'visa tarjeta credito' },
  ],
};

const CHILE_CATEGORY_LABELS = {
  bancos: 'Bancos',
  isapres: 'Isapres',
  afp: 'AFP',
  telefonia: 'Telefonía',
  gas: 'Gas',
  agua: 'Agua',
  tickets: 'Tickets/Delivery',
  'medios-pago': 'Medios de Pago',
  tarjetas: 'Tarjetas',
};

const getAhorroBankInfo = (bankName) => {
  if (!bankName) return null;
  const n = bankName.toLowerCase().trim();
  return BANCOS_CHILE.find(b => b.nombre.toLowerCase() === n) || null;
};

const Dashboard = ({ user, token, onLogout, onOpenAdmin, onOpenTutorial, isPushSubscribed, isPushLoading, onToggleNotifications, isInstallable, onInstall }) => {
  const [activeTab, setActiveTab] = useState('transacciones');
  const [dashboardMonth, setDashboardMonth] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');

  const [months, setMonths] = useState(INITIAL_MONTHS);
  const [deudas, setDeudas] = useState([]);
  const [gastosFijos, setGastosFijos] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [sueldos, setSueldos] = useState({});
  const [cuentasAhorro, setCuentasAhorro] = useState([]);
  const [ahorrosData, setAhorrosData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [showCategoriasConfig, setShowCategoriasConfig] = useState(false);

  const {
    categorias, gastosCats, ingresosCats,
    createCategoria, updateCategoria, deleteCategoria,
    reorderCategorias, reorderCategoriasLocal,
    getCatStyle, getCatBar, getCatIconBg, getCatIconColor, getCatText,
  } = useCategorias(token);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '', itemName: '', itemType: '', message: '', onConfirm: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []); // runs once on mount only

  useEffect(() => {
    fetch('/api/data', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.months && data.months.length > 0) setMonths(expandToFullYearMonths(data.months));
        if (data.deudas && data.deudas.length > 0) setDeudas(data.deudas);
        if (data.gastosFijos && data.gastosFijos.length > 0) setGastosFijos(data.gastosFijos);
        if (data.abonos && data.abonos.length > 0) setAbonos(data.abonos);
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

  const filteredBancos = useMemo(() => {
    if (!bancoSearch.trim()) return BANCOS_CHILE;
    const q = bancoSearch.toLowerCase().trim();
    return BANCOS_CHILE.filter(b => b.nombre.toLowerCase().includes(q));
  }, [bancoSearch]);

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
      const syncPayload = {
        deudas,
        months,
        gastosFijos,
        abonos,
        sueldos,
        cuentasAhorro,
        ahorrosData,
        suscripciones
      };

      console.log('[SYNC] Sending payload:', JSON.stringify({
        deudasCount: deudas.length,
        monthsCount: months.length,
        gastosFijosCount: gastosFijos.length,
        abonosCount: abonos.length,
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
  }, [deudas, months, gastosFijos, abonos, sueldos, cuentasAhorro, ahorrosData, suscripciones]);

  const getNextMonthStr = (monthStr) => fromDateVal(toDateVal(monthStr) + 1);

  const expandToFullYearMonths = (monthArr) => {
    const years = [...new Set(monthArr.map(m => m.split(' ')[1]))];
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

    const abonosProcesados = abonos.map(a => ({
      ...a,
      tipo: 'abono'
    }));

    return [...deudasProcesadas, ...gastosProcesados, ...subsProcesadas, ...abonosProcesados];
  }, [deudas, gastosFijos, suscripciones, abonos, filteredMonths]);

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
    console.log('[DEBUG] Guardando deuda:', newDebt);
    const endMonth = calculateEndDate(newDebt.mesInicio, newDebt.cuotasTotales, newDebt.isContribuciones);
    ensureMonthsRange(newDebt.mesInicio, endMonth);
    if (editingItem) {
      setDeudas(deudas.map(d => d.id === editingItem.id ? { ...newDebt, id: d.id, pagos: d.pagos } : d));
    } else {
      setDeudas([...deudas, { ...newDebt, id: `debt-${Date.now()}`, pagos: {} }]);
    }
    setIsAddingDebt(false);
    setEditingItem(null);
    setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'default', iconValue: 'layout', iconUrl: '' });
    setDebtIconSearch('');
    setBancoSearch('');
  };

  const handleSaveFixed = (e) => {
    e.preventDefault();
    console.log('[DEBUG] Guardando gasto fijo:', newFixed);
    if (editingItem) {
      setGastosFijos(gastosFijos.map(g => g.id === editingItem.id ? { ...newFixed, id: g.id, pagos: g.pagos } : g));
    } else {
      setGastosFijos([...gastosFijos, { ...newFixed, id: `fixed-${Date.now()}`, pagos: {} }]);
    }
    setIsAddingFixed(false);
    setEditingItem(null);
    setNewFixed({ descripcion: '', diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setFixedIconSearch('');
  };

  const handleSaveAbono = (e) => {
    e.preventDefault();
    if (editingItem) {
      setAbonos(abonos.map(a => a.id === editingItem.id ? { ...newAbono, id: a.id, pagos: a.pagos } : a));
    } else {
      setAbonos([...abonos, { ...newAbono, id: `abono-${Date.now()}`, pagos: {} }]);
    }
    setIsAddingAbono(false);
    setEditingItem(null);
    setNewAbono({ descripcion: '', diaPago: 1, facturacionAuto: false, iconType: 'preset', iconValue: 'layout', iconUrl: '' });
    setAbonoIconSearch('');
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
    if (editingAccount) {
      setCuentasAhorro(cuentasAhorro.map(c => c.id === editingAccount.id ? { ...newAccount, id: c.id } : c));
    } else {
      setCuentasAhorro([...cuentasAhorro, { ...newAccount, id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }]);
    }
    setIsAddingAccount(false);
    setEditingAccount(null);
    setNewAccount({ nombre: '', banco: '' });
    setAccountBancoSearch('');
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

  return (
    <div className={isDarkMode ? 'dark' : ''}>
	      <div className="min-h-screen bg-kk-background dark:bg-dark-darker p-1 md:p-2 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-[100%] lg:max-w-[1920px] mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <img src="/kuentasklaras-logo.svg" alt="Kuentas Klaras" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-kk-dark dark:text-white">Kuentas Klaras</h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium tracking-tight hidden sm:block">Tus finanzas claras, bajo control</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            {syncStatus !== 'idle' && (
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${syncStatus === 'saving' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : syncStatus === 'saved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>
                {syncStatus === 'saving' ? <Loader2 size={14} className="animate-spin" /> : syncStatus === 'saved' ? <ClipboardCheck size={14} /> : <X size={14} />}
                {syncStatus === 'saving' ? 'Guardando...' : syncStatus === 'saved' ? 'Guardado' : 'Error'}
              </div>
            )}
            <button
              onClick={() => {
                const newMode = !isDarkMode
                setIsDarkMode(newMode)
                document.documentElement.classList.toggle('dark')
                localStorage.setItem('theme', newMode ? 'dark' : 'light')
              }}
              className="p-2 md:p-2.5 rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <UserMenu
              user={user}
              themeColor={themeColor}
              setThemeColor={(color) => { setThemeColor(color); localStorage.setItem('themeColor', color); }}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              onOpenAdmin={onOpenAdmin}
              onOpenCategorias={() => setShowCategoriasConfig(true)}
              onLogout={onLogout}
              generateFinancialAdvice={generateFinancialAdvice}
              isAiLoading={isAiLoading}
              isPushSubscribed={isPushSubscribed}
              isPushLoading={isPushLoading}
              onToggleNotifications={onToggleNotifications}
            />
          </div>
        </header>

        {isInstallable && (
          <div className="mb-4 md:mb-6">
            <button
              onClick={onInstall}
              className="flex items-center gap-2 px-4 py-2.5 bg-kk text-white rounded-xl text-xs font-bold shadow-sm hover:bg-kk-dark transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Instalar App
            </button>
          </div>
        )}

        {aiAdvice && (
          <div className={`mb-4 md:mb-8 ${theme.bgLight} ${theme.bgLightDark} border-2 ${theme.badgeBg} ${theme.badgeBgDark} rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 relative animate-in fade-in slide-in-from-top-4 duration-500`}>
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

        <div className="flex gap-1 sm:gap-2 md:gap-4 mb-4 md:mb-8 bg-slate-200/50 dark:bg-dark-normal/50 p-1 sm:p-1.5 rounded-xl sm:rounded-[1.5rem] w-full md:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('transacciones')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex-shrink-0 ${activeTab === 'transacciones' ? `bg-white dark:bg-dark-lighter ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter/50'}`}
          >
            <Mail size={16} /> Transacciones
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex-shrink-0 ${activeTab === 'general' ? `bg-white dark:bg-dark-lighter ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter/50'}`}
          >
            <ListChecks size={16} /> <span className="hidden sm:inline">Detalle General</span><span className="sm:hidden">Detalle</span>
          </button>
          <button
            onClick={() => setActiveTab('ahorros')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex-shrink-0 ${activeTab === 'ahorros' ? `bg-white dark:bg-dark-lighter ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter/50'}`}
          >
            <PiggyBank size={16} /> <span className="hidden sm:inline">Gestión de Ahorros</span><span className="sm:hidden">Ahorros</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex-shrink-0 ${activeTab === 'dashboard' ? `bg-white dark:bg-dark-lighter ${theme.tabText} shadow-md` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-lighter/50'}`}
          >
            <LayoutDashboard size={16} /> <span className="hidden sm:inline">Resumen</span><span className="sm:hidden">Res</span>
          </button>
        </div>

        {!showCategoriasConfig && <>
        {activeTab === 'dashboard' && !!dashboardMonth && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
                <LayoutDashboard className={theme.tabText} size={20} /> <span className="hidden sm:inline">Resumen Mensual</span><span className="sm:hidden">Resumen</span>
              </h2>
              <div className="relative">
                <select
                  value={dashboardMonth}
                  onChange={(e) => setDashboardMonth(e.target.value)}
                  className={`appearance-none bg-white dark:bg-dark-normal border-2 ${theme.borderAccent} rounded-xl px-3 sm:px-4 py-2 pr-10 font-bold text-xs sm:text-sm outline-none cursor-pointer ${theme.tabText}`}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className={`rounded-2xl p-3 sm:p-5 shadow-lg text-white ${theme.btnPrimary.replace('hover:bg-', 'bg-').replace('hover:bg-', '')} relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card`}>
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 -translate-y-4 sm:-translate-y-6 translate-x-4 sm:translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 translate-y-3 sm:translate-y-4 -translate-x-3 sm:-translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="p-1 sm:p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <CreditCard className="text-white/90" size={14} />
                          </div>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider opacity-90">Cuotas</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5">{formatCurrency(totalCuotas)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{cuotasPagadasMes} pagadas</span>
                          <span>·</span>
                          <span>{cuotasPendientesMes} pendientes</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl p-3 sm:p-5 shadow-lg text-white bg-slate-600 dark:bg-dark-lighter relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card">
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 -translate-y-4 sm:-translate-y-6 translate-x-4 sm:translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 translate-y-3 sm:translate-y-4 -translate-x-3 sm:-translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="p-1 sm:p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Receipt className="text-white/90" size={14} />
                          </div>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider opacity-90">Gastos Fijos</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5">{formatCurrency(totalGastos)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{gastosPagados} pagados</span>
                          <span>·</span>
                          <span>{gastosFijos.length - gastosPagados} pendientes</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl p-3 sm:p-5 shadow-lg text-white bg-rose-600 dark:bg-rose-700 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card">
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 -translate-y-4 sm:-translate-y-6 translate-x-4 sm:translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 translate-y-3 sm:translate-y-4 -translate-x-3 sm:-translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="p-1 sm:p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <RefreshCw className="text-white/90" size={14} />
                          </div>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider opacity-90">Suscripciones</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5">{formatCurrency(totalSubs)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{subsActivas.length} activas</span>
                          {proximosCobros.length > 0 && <span>·</span>}
                          {proximosCobros.length > 0 && <span>Próx: día {proximosCobros[0]?.dia}</span>}
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl p-3 sm:p-5 shadow-lg text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group/card ${disponibleExtras >= 0 ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-rose-600 dark:bg-rose-700'}`}>
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 -translate-y-4 sm:-translate-y-6 translate-x-4 sm:translate-x-6 group-hover/card:scale-125 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 translate-y-3 sm:translate-y-4 -translate-x-3 sm:-translate-x-4 group-hover/card:scale-150 transition-transform duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <div className="p-1 sm:p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Wallet className="text-white/90" size={14} />
                          </div>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider opacity-90">Disponible</span>
                        </div>
                        <div className={`text-lg sm:text-2xl font-mono font-black mb-1 sm:mb-1.5 ${disponibleExtras < 0 ? 'animate-pulse' : ''}`}>{formatCurrency(disponibleExtras)}</div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs opacity-85">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>{pctDisponible.toFixed(0)}% libre</span>
                          <span>·</span>
                          <span className="font-bold">{saludLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <button onClick={() => toggleDashSection('cuotas')} className="w-full flex items-center justify-between p-3 sm:p-5 hover:bg-slate-50 dark:hover:bg-dark-lighter/50 transition-colors group/section">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-xl ${theme.bgLight} ${theme.bgLightDark}`}>
                            <CreditCard className={theme.tabText} size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Cuotas Activas</span>
                            <span className={`ml-1 sm:ml-2 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeBgDark} ${theme.badgeText} dark:${theme.badgeTextDark}`}>{cuotasActivas.length} este mes</span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${dashSections.cuotas ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.cuotas && (
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-2 sm:space-y-3 border-t border-slate-100 dark:border-dark-lighter pt-3 sm:pt-4 animate-slide-down">
                          {cuotasActivas.map(d => {
                            const mesTermino = calculateEndDate(d.mesInicio, d.isContribuciones ? 4 : d.cuotasTotales, d.isContribuciones);
                            let pagadas = 0; let cur = toDateVal(d.mesInicio); const end = toDateVal(mesTermino);
                            while (cur <= end) { const m = fromDateVal(cur); if (!d.isContribuciones || ['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(m.split(' ')[0])) { if (d.pagos?.[m]?.estado === 'PAGADA') pagadas++; } cur++; }
                            const totalD = d.isContribuciones ? 4 : d.cuotasTotales;
                            const pctD = totalD > 0 ? (pagadas / totalD) * 100 : 0;
                            return (
                              <div key={d.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-dark-lighter/30 transition-all hover:bg-slate-100 dark:hover:bg-dark-lighter/50">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-300 overflow-hidden`}>
                                  <div className={theme.tabText}>{renderDebtIcon(d)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 truncate">{d.descripcion}</span>
                                    {d.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase hidden sm:inline">Legal</span>}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-2 sm:h-1.5 bg-slate-100 dark:bg-dark-lighter rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pctD}%` }}></div>
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 whitespace-nowrap">{pagadas}/{totalD}</span>
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

                    <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gastado</span>
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
                                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 ml-1 sm:ml-1.5">{s.pct.toFixed(0)}%</span>
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
                    <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <button onClick={() => toggleDashSection('subs')} className="w-full flex items-center justify-between p-3 sm:p-5 hover:bg-slate-50 dark:hover:bg-dark-lighter/50 transition-colors group/section">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 rounded-xl bg-rose-100 dark:bg-rose-900/30">
                            <RefreshCw className="text-rose-500 dark:text-rose-400" size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Suscripciones</span>
                            <span className={`ml-1 sm:ml-2 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300`}>{subsActivas.length} activas</span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${dashSections.subs ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.subs && (
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-2 sm:space-y-3 border-t border-slate-100 dark:border-dark-lighter pt-3 sm:pt-4 animate-slide-down">
                          {subsActivas.map(s => {
                            const monto = s.pagos?.[mes]?.monto || s.valor || 0;
                            return (
                              <div key={s.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-dark-lighter/30 transition-all hover:bg-slate-100 dark:hover:bg-dark-lighter/50">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-rose-100 dark:bg-rose-900/30 overflow-hidden">
                                  <div className="text-rose-500 dark:text-rose-400">{renderSubscriptionIcon(s)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 truncate">{s.descripcion}</span>
                                  </div>
                                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">Día {s.diaPago || 1} · {s.billingCycle === 'mensual' ? 'Mensual' : 'Anual'}</span>
                                </div>
                                <span className="text-xs sm:text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(monto)}</span>
                              </div>
                            );
                          })}
                          {subsActivas.length > 0 && (
                            <>
                              <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-dark-lighter">
                                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                  <CalendarDays size={12} className="text-slate-400" />
                                  <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">Próximos cobros</span>
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
                              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-dark-lighter">
                                <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                                <span className="text-xs sm:text-sm font-mono font-black text-rose-500 dark:text-rose-400">{formatCurrency(totalSubs)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <button onClick={() => toggleDashSection('fijos')} className="w-full flex items-center justify-between p-3 sm:p-5 hover:bg-slate-50 dark:hover:bg-dark-lighter/50 transition-colors group/section">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-dark-lighter">
                            <Receipt className="text-slate-500 dark:text-slate-400" size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Gastos Fijos</span>
                            <span className={`ml-1 sm:ml-2 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-slate-300`}>{gastosFijos.length} activos</span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${dashSections.fijos ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dashSections.fijos && (
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-2 sm:space-y-3 border-t border-slate-100 dark:border-dark-lighter pt-3 sm:pt-4 animate-slide-down">
                          {gastosFijosList.map(g => (
                            <div key={g.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-dark-lighter/30 transition-all hover:bg-slate-100 dark:hover:bg-dark-lighter/50">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${theme.bgLight} ${theme.bgLightDark} overflow-hidden`}>
                                <div className={theme.tabText}>{renderFixedIcon(g)}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 truncate block">{g.descripcion}</span>
                              </div>
                              <span className="text-xs sm:text-sm font-mono font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(g.monto)}</span>
                            </div>
                          ))}
                          {gastosFijosList.length > 0 && (
                            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-dark-lighter">
                              <span className="text-xs font-black text-slate-400 uppercase">Total del mes</span>
                              <span className="text-xs sm:text-sm font-mono font-black text-slate-500 dark:text-slate-400">{formatCurrency(totalGastos)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-3 sm:p-5 hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-xl ${saludBg}`}>
                          <Activity className={saludColor} size={16} />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Salud Financiera</span>
                      </div>
                      <span className={`text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 rounded-full ${saludBg}`}>{saludLabel}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="h-2.5 sm:h-3 bg-slate-100 dark:bg-dark-lighter rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-emerald-400" style={{ width: '60%' }}></div>
                            <div className="h-full bg-amber-400" style={{ width: '20%' }}></div>
                            <div className="h-full bg-rose-400" style={{ width: '20%' }}></div>
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border-2 border-slate-800 rounded-full shadow-md transition-all duration-500" style={{ left: `calc(${Math.min(pctGastado, 100)}% - 6px)` }}></div>
                        </div>
                        <div className="flex justify-between text-[8px] sm:text-[9px] font-bold text-slate-400 mt-1">
                          <span>0%</span>
                          <span className="text-emerald-500">60%</span>
                          <span className="text-amber-500">80%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="text-right sm:min-w-[100px]">
                        <div className={`text-xl sm:text-2xl font-mono font-black ${saludColor}`}>{pctGastado.toFixed(0)}%</div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">gastado</div>
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
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
                        <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">Ve a la pestaña <span className="font-bold text-emerald-500">Gestión de Ahorros</span> para registrar depósitos o gastos.</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">Balance total</span>
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
                                            <span className="text-[9px] sm:text-[10px] text-slate-400">{c.banco}</span>
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

                        <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <TrendingUp className="text-indigo-500 dark:text-indigo-400" size={16} />
                              </div>
                              <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">Proyección de Ahorro</span>
                              {promedioMensual > 0 && (
                                <span className={`ml-auto text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-dark-lighter text-slate-500'}`}>
                                  {trendUp ? 'Tendencia +' : 'Estable'}
                                </span>
                              )}
                            </div>

                            {hasNoData ? (
                              <div className="text-center py-4 sm:py-6">
                                <TrendingUp className="mx-auto text-slate-300 dark:text-slate-600 mb-2 sm:mb-3" size={28} />
                                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">Sin historial de depósitos</p>
                                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">Registra depósitos en al menos un mes para ver tu proyección.</p>
                              </div>
                            ) : (
                              <>
                                <div className="mb-3 sm:mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Promedio mensual</span>
                                    <span className="text-xs font-mono font-black text-slate-600 dark:text-slate-300">{formatCurrency(promedioMensual)}</span>
                                  </div>
                                  <div className="flex gap-1 items-end h-6 sm:h-8">
                                    {depositsByMonth.map((d, i) => (
                                      <div
                                        key={i}
                                        className="flex-1 rounded-sm bg-indigo-200 dark:bg-indigo-800/50 transition-all hover:bg-indigo-400 dark:hover:bg-indigo-600"
                                        style={{ height: `${Math.max((d / maxDeposit) * 100, 4)}%` }}
                                        title={last6Months[i]}
                                      ></div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-400 mt-0.5">
                                    {last6Months.map((m, i) => (
                                      <span key={i} className="flex-1 text-center truncate">{m.split(' ')[0].substring(0, 3)}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                  <div className="p-2 sm:p-3 bg-slate-50 dark:bg-dark-lighter/30 rounded-xl text-center">
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">3 meses</span>
                                    <div className="text-xs sm:text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(proyeccion3Meses)}</div>
                                  </div>
                                  <div className="p-2 sm:p-3 bg-slate-50 dark:bg-dark-lighter/30 rounded-xl text-center">
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">6 meses</span>
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
          <div key="general-tab" className="animate-slide-fade px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400 flex-shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter px-3 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 outline-none cursor-pointer appearance-none"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setEditingItem(null); setNewDebt({ descripcion: '', cuotasTotales: 12, valorCuota: 0, mesInicio: months[0], isContribuciones: false, diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'default', iconValue: 'layout', iconUrl: '' }); setDebtIconSearch(''); setBancoSearch(''); setIsAddingDebt(true); }} className={`flex items-center justify-center gap-2 ${theme.btnDebt} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                  <CreditCard size={16} /> Nueva Cuota <Plus size={16} />
                </button>
                <button onClick={() => { setEditingItem(null); setNewFixed({ descripcion: '', diaPago: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setFixedBancoSearch(''); setIsAddingFixed(true); }} className={`flex items-center justify-center gap-2 ${theme.btnFixed} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                  <Receipt size={16} /> Gasto Fijo <Plus size={16} />
                </button>
                <button onClick={() => { setEditingItem(null); setNewAbono({ descripcion: '', diaPago: 1, facturacionAuto: false, iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setAbonoBancoSearch(''); setAbonoIconSearch(''); setIsAddingAbono(true); }} className={`flex items-center justify-center gap-2 ${theme.btnPrimary} px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                  <TrendingUp size={16} /> Abono <Plus size={16} />
                </button>
                <button onClick={() => { setEditingItem(null); setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setSubBancoSearch(''); setSubscriptionIconSearch(''); setIsAddingSub(true); }} className={`flex items-center justify-center gap-2 ${theme.btnSub} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                  <RefreshCw size={16} /> Suscripciones <Plus size={16} />
                </button>
                <button onClick={() => { const sorted = [...months].sort((a, b) => toDateVal(a) - toDateVal(b)); setMonths([...months, getNextMonthStr(sorted[sorted.length - 1])]); }} className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                  <Plus size={16} /> +1 Mes
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-normal rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-dark-normal/50 border-b border-slate-100 dark:border-dark-lighter">
                      <th className="p-3 sm:p-4 font-black text-slate-400 dark:text-slate-500 uppercase text-[9px] sm:text-[10px] tracking-widest sticky left-0 bg-white dark:bg-dark-normal z-20 border-r border-slate-100 dark:border-dark-lighter w-[55px] min-w-[55px] sm:min-w-[280px] sm:w-auto">
                        <span className="hidden sm:inline">Detalle de Gastos</span><span className="sm:hidden">Detalle</span>
                      </th>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <th key={mes} className={`p-3 min-w-[100px] text-center border-l border-slate-100 dark:border-dark-lighter ${isEven ? 'bg-slate-50/80 dark:bg-dark-normal/80' : 'bg-white dark:bg-dark-lighter/20'}`}>
                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{mes.split(' ')[1]}</div>
                            <div className="text-sm font-black text-slate-800 dark:text-slate-200">{mes.split(' ')[0]}</div>
                          </th>
                        );
                      })}
                          <th className={`hidden portrait:table-cell sm:table-cell p-3 min-w-[140px] text-center border-l border-slate-100 dark:border-dark-lighter ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sm:sticky right-0 z-20`}>
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp size={12} className={theme.tabText} />
                          <span className={`text-[10px] font-white uppercase tracking-tighter`}>Progreso</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsUnificados.length > 0 ? (
                      itemsUnificados.map(item => (
                        <tr key={item.id} className="border-b border-slate-50 dark:border-dark-lighter/50 group hover:bg-slate-50/30 dark:hover:bg-dark-lighter/20">
                          <td className="p-1.5 sm:p-3 sticky left-0 bg-white dark:bg-dark-normal group-hover:bg-slate-50 dark:group-hover:bg-dark-lighter/50 z-10 border-r border-slate-100 dark:border-dark-lighter">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                 <div className="relative p-1 bg-slate-100 dark:bg-slate-100 rounded-xl text-slate-500 dark:text-slate-400 overflow-hidden hidden sm:flex w-7 h-7 sm:w-10 sm:h-10 items-center justify-center flex-shrink-0">
                                   {item.tipo === 'cuota' ? renderDebtIcon(item) : item.tipo === 'suscripcion' ? renderSubscriptionIcon(item) : renderFixedIcon(item)}
                                   {item.tipo === 'cuota' && item.bancoLogo && (
                                     <img src={item.bancoLogo} alt={item.banco} className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 object-contain bg-white dark:bg-dark-normal rounded-full p-0.5 border border-slate-200 dark:border-dark-lightest" onError={(e) => { e.target.style.display = 'none'; }} />
                                   )}
                                 </div>
                                 <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => setViewingItem({ tipo: item.tipo, data: item })}>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="font-black text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-tight truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title={item.descripcion}>{item.descripcion}</span>
                                    {item.isContribuciones && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[7px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase hidden sm:inline">Legal</span>}
                                    {item.tipo === 'suscripcion' && <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[7px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5 hidden sm:inline-flex"><RefreshCw size={10} /> Sub</span>}
                                    {item.tipo === 'abono' && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[7px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase hidden sm:inline">ABONO</span>}
                                    {item.tipo === 'cuota' && item.tipoTarjeta && <span className={`text-[7px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 rounded uppercase hidden sm:inline ${item.tipoTarjeta === 'visa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}`}>{item.tipoTarjeta.toUpperCase()}</span>}
                                  </div>
                                  <span className="text-[8px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 truncate">
                                    {item.tipo === 'cuota' ? (item.banco ? `${item.banco}` : `${item.mesInicio.split(' ')[0]}`) : item.tipo === 'suscripcion' ? `Día ${item.diaPago || 1}` : item.tipo === 'abono' ? 'Abono' : 'Fijo'}
                                  </span>
                                </div>
                              </div>
<div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0">
                                <button onClick={() => handleEditItem(item)} className="hidden sm:inline-flex p-1.5 text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => {
                                  const itemType = item.tipo === 'cuota' ? 'deuda' : item.tipo === 'suscripcion' ? 'suscripción' : item.tipo === 'abono' ? 'abono' : 'gasto fijo';
                                  confirmDelete({
                                    title: `¿Eliminar ${itemType}?`,
                                    itemName: item.descripcion,
                                    itemType: itemType,
                                    onConfirm: async () => {
                                      if (item.tipo === 'cuota') setDeudas(deudas.filter(x => x.id !== item.id));
                                      else if (item.tipo === 'suscripcion') setSuscripciones(suscripciones.filter(x => x.id !== item.id));
                                      else if (item.tipo === 'abono') setAbonos(abonos.filter(x => x.id !== item.id));
                                      else setGastosFijos(gastosFijos.filter(x => x.id !== item.id));
                                      return Promise.resolve();
                                    }
                                  });
                                }} className="hidden sm:inline-flex p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-slate-50/30 dark:bg-dark-normal/30' : 'bg-white dark:bg-dark-lighter/10';
                            if (item.tipo === 'cuota') {
                              const inRange = isMonthInRange(mes, item.mesInicio, item.mesTermino, item.isContribuciones);
                              const isPagado = item.pagos?.[mes]?.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-[9px] border-l border-slate-50 dark:border-dark-lighter/50 text-center ${!inRange ? 'bg-slate-50/40 dark:bg-dark-darker/20 opacity-20' : cellBgBase}`}>
                                  {inRange && (
                                    <button
                                      onClick={() => {
                                        const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                                        setDeudas(deudas.map(x => x.id === item.id ? { ...x, pagos: { ...x.pagos, [mes]: { estado: next } } } : x));
                                      }}
                                      className={`w-full py-0.5 rounded-2xl transition-all flex flex-col items-center gap-1 ${isPagado ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-300 dark:bg-dark-lightest text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-dark-lightest shadow-sm'}`}
                                    >
                                      <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{isPagado ? 'Pagado' : 'Pendiente'}</span>
                                      <span className="text-[18px] font-mono font-black">{isPagado ? formatCurrency(item.valorCuota) : formatCurrency(item.valorCuota)}</span>
                                    </button>
                                  )}
                                </td>
                              );
                            } else if (item.tipo === 'suscripcion') {
                              const isActive = item.activeMonths && item.activeMonths.includes(mes);
                              const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                              const isPagado = pago.estado === 'PAGADA';
                              const hasValue = (pago.monto || item.valor) > 0;
                              return (
                                <td key={mes} className={`p-[9px] border-l border-slate-50 dark:border-dark-lighter/50 ${!isActive ? 'bg-slate-50/40 dark:bg-dark-darker/20 opacity-20' : cellBgBase}`}>
                                  {isActive && (
                                    <div
                                      onClick={() => {
                                        if (hasValue) {
                                          const next = isPagado ? 'PENDIENTE' : 'PAGADA';
                                          setSuscripciones(suscripciones.map(s => s.id === item.id ? { ...s, pagos: { ...s.pagos, [mes]: { ...(s.pagos?.[mes] || { monto: s.valor || 0 }), estado: next } } } : s));
                                        }
                                      }}
                                      className={`w-full py-0.5 rounded-2xl transition-all flex flex-col items-center gap-1 cursor-pointer ${isPagado ? 'bg-emerald-500 text-white shadow-lg' : hasValue ? 'bg-slate-300 dark:bg-dark-lightest text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-dark-lightest shadow-sm' : 'bg-slate-100 dark:bg-dark-normal text-slate-300 dark:text-slate-600'}`}
                                    >
                                      <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{isPagado ? 'Pagado' : 'Pendiente'}</span>
                                      <div className="relative w-full max-w-[110px]" onClick={(e) => e.stopPropagation()}>
                                        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[13px] font-bold opacity-60">$</span>
                                        <input
                                          type="text"
                                          placeholder="0"
                                          value={pago.monto || item.valor ? new Intl.NumberFormat('es-CL').format(pago.monto || item.valor) : ''}
                                          onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                            const val = parseInt(raw) || 0;
                                            setSuscripciones(suscripciones.map(s => s.id === item.id ? { ...s, pagos: { ...s.pagos, [mes]: { ...(s.pagos?.[mes] || { estado: 'PENDIENTE' }), monto: val } } } : s));
                                          }}
                                          className="w-full bg-transparent text-center font-mono font-black text-[18px] outline-none pl-3 dark:text-white"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </td>
                              );
                            } else if (item.tipo === 'abono') {
                              const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                              const isPagado = pago.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-[9px] border-l border-slate-50 dark:border-dark-lighter/50 ${cellBgBase}`}>
                                  <div
                                    onClick={() => {
                                      if (pago.monto > 0) {
                                        updateAbonoPayment(item.id, mes, 'estado', isPagado ? 'PENDIENTE' : 'PAGADA');
                                      }
                                    }}
                                    className={`w-full py-0.5 rounded-2xl transition-all flex flex-col items-center gap-1 cursor-pointer ${isPagado ? 'bg-emerald-500 text-white shadow-lg' : pago.monto > 0 ? 'bg-slate-300 dark:bg-dark-lightest text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-dark-lightest shadow-sm' : 'bg-slate-100 dark:bg-dark-normal text-slate-300 dark:text-slate-600'}`}
                                  >
                                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{isPagado ? 'Pagado' : 'Pendiente'}</span>
                                    <div className="relative w-full max-w-[110px]" onClick={(e) => e.stopPropagation()}>
                                      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[13px] font-bold opacity-60">$</span>
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={pago.monto ? new Intl.NumberFormat('es-CL').format(pago.monto) : ''}
                                        onChange={(e) => {
                                          const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                          updateAbonoPayment(item.id, mes, 'monto', parseInt(raw) || 0);
                                        }}
                                        className="w-full bg-transparent text-center font-mono font-black text-[18px] outline-none pl-3 dark:text-white"
                                      />
                                    </div>
                                  </div>
                                </td>
                              );
                            } else {
                              const pago = item.pagos?.[mes] || { monto: 0, estado: 'PENDIENTE' };
                              const isPagado = pago.estado === 'PAGADA';
                              return (
                                <td key={mes} className={`p-[9px] border-l border-slate-50 dark:border-dark-lighter/50 ${cellBgBase}`}>
                                  <div
                                    onClick={() => {
                                      if (pago.monto > 0) {
                                        updateFixedPayment(item.id, mes, 'estado', isPagado ? 'PENDIENTE' : 'PAGADA');
                                      }
                                    }}
                                    className={`w-full py-0.5 rounded-2xl transition-all flex flex-col items-center gap-1 cursor-pointer ${isPagado ? 'bg-emerald-500 text-white shadow-lg' : pago.monto > 0 ? 'bg-slate-300 dark:bg-dark-lightest text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-dark-lightest shadow-sm' : 'bg-slate-100 dark:bg-dark-normal text-slate-300 dark:text-slate-600'}`}
                                  >
                                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{isPagado ? 'Pagado' : 'Pendiente'}</span>
                                    <div className="relative w-full max-w-[110px]" onClick={(e) => e.stopPropagation()}>
                                      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[13px] font-bold opacity-60">$</span>
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={pago.monto ? new Intl.NumberFormat('es-CL').format(pago.monto) : ''}
                                        onChange={(e) => {
                                          const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                          updateFixedPayment(item.id, mes, 'monto', parseInt(raw) || 0);
                                        }}
                                        className="w-full bg-transparent text-center font-mono font-black text-[18px] outline-none pl-3 dark:text-white"
                                      />
                                    </div>
                                  </div>
                                </td>
                              );
                            }
                          })}
                          {item.tipo === 'cuota' ? (
                            <td className={`hidden portrait:table-cell sm:table-cell p-1.5 sm:p-3 border-l border-slate-50 dark:border-dark-lighter/50 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sm:sticky right-0 z-10`}>
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
                                  <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                                    <span className={`text-[8px] sm:text-[10px] font-black whitespace-nowrap`}>{pagadas}/{totalCuotas} <span className="hidden sm:inline">pagadas</span></span>
                                    <div className="w-full h-0.5 sm:h-2 bg-slate-200/60 dark:bg-dark-lightest/60 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                    <span className={`text-[7px] sm:text-[9px] font-bold whitespace-nowrap`}>{faltantes} faltante{faltantes !== 1 ? 's' : ''}</span>
                                  </div>
                                );
                              })()}
                            </td>
                          ) : (
                            <td className={`hidden portrait:table-cell sm:table-cell p-1.5 sm:p-3 border-l border-slate-50 dark:border-dark-lighter/50 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sm:sticky right-0 z-10`}>
                              <span className={`text-[8px] sm:text-xs ${theme.tabText} opacity-30`}>—</span>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={filteredMonths.length + 1} className="p-24 text-center text-slate-300 font-bold italic">No hay registros para mostrar</td></tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-black">
                    <tr className={`border-t-4 ${theme.borderAccent} divide-x divide-slate-800`}>
                      <td className="p-2 sm:p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CreditCard size={18} />
                          <span className="uppercase text-[10px] sm:text-xs tracking-widest"><span className="hidden sm:inline">Total Cuotas</span><span className="sm:hidden">Cuotas</span></span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-base font-mono text-slate-300">{formatCurrency(totalesMensuales[mes].cuotas)}</div>
                          </td>
                        );
                      })}
                      <td className={`hidden portrait:table-cell sm:table-cell p-3 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800">
                      <td className="p-2 sm:p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Receipt size={18} />
                          <span className="uppercase text-[10px] sm:text-xs tracking-widest"><span className="hidden sm:inline">Total Gastos Fijos</span><span className="sm:hidden">G. Fijos</span></span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-base font-mono text-slate-400">{formatCurrency(totalesMensuales[mes].gastos)}</div>
                          </td>
                        );
                      })}
                      <td className={`hidden portrait:table-cell sm:table-cell p-3 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800">
                      <td className="p-2 sm:p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-rose-400">
                          <RefreshCw size={18} />
                          <span className="uppercase text-[10px] sm:text-xs tracking-widest"><span className="hidden sm:inline">Total Suscripciones</span><span className="sm:hidden">Subs</span></span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-base font-mono text-rose-400">{formatCurrency(totalesMensuales[mes].suscripciones)}</div>
                          </td>
                        );
                      })}
                      <td className={`hidden portrait:table-cell sm:table-cell p-3 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800">
                      <td className="p-2 sm:p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <TrendingUp size={18} />
                          <span className="uppercase text-[10px] sm:text-xs tracking-widest"><span className="hidden sm:inline">Total Abonos</span><span className="sm:hidden">Abonos</span></span>
                        </div>
                      </td>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <td key={mes} className={`p-3 text-center ${isEven ? 'bg-slate-900' : 'bg-slate-800/90'}`}>
                            <div className="text-base font-mono text-emerald-400">{formatCurrency(totalesMensuales[mes].abonos)}</div>
                          </td>
                        );
                      })}
                      <td className={`hidden portrait:table-cell sm:table-cell p-3 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className={`border-t-4 ${theme.borderAccent} divide-x divide-slate-800`}>
                      <td className="p-2 sm:p-4 sticky left-0 bg-slate-900 z-30 border-r border-slate-800">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <ArrowUpCircle size={18} />
                          <span className="uppercase text-[10px] sm:text-xs tracking-widest"><span className="hidden sm:inline">Sueldo del Mes</span><span className="sm:hidden">Sueldo</span></span>
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
                              className="w-full bg-slate-700/50 rounded-xl py-2 px-3 text-center text-cyan-400 font-mono outline-none border border-slate-600 focus:border-cyan-500 transition-all placeholder:text-slate-500"
                            />
                          </td>
                        );
                      })}
                      <td className={`hidden portrait:table-cell sm:table-cell p-3 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                    <tr className="divide-x divide-slate-800 border-t border-slate-800 bg-slate-950">
                      <td className="p-2 sm:p-4 sticky left-0 bg-slate-950 z-30 border-r border-slate-800 flex items-center gap-2 sm:gap-3">
                        <Wallet className="text-emerald-400" size={20} />
                        <span className="uppercase text-xs sm:text-sm"><span className="hidden sm:inline">Disponible</span><span className="sm:hidden">Libre</span></span>
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
                      <td className={`hidden portrait:table-cell sm:table-cell p-3 text-center ${theme.bgLightSolid} ${theme.bgLightDarkSolid} sticky right-0 z-20`}>
                        <span className={`text-[10px] font-bold ${theme.tabText} opacity-30`}>—</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )} {activeTab === 'ahorros' && (
          <div key="ahorros-tab" className="space-y-8 animate-slide-fade px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
                  <PiggyBank className={theme.tabText} size={20} /> <span className="truncate">Cuentas de Ahorro</span>
                </h2>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400 flex-shrink-0" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className={`${theme.bgLight} ${theme.bgLightDark} ${theme.badgeText} dark:${theme.badgeTextDark} border ${theme.borderAccent} ${theme.badgeBgDark} px-3 py-2 rounded-xl text-xs font-black outline-none cursor-pointer appearance-none`}
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={getSavingsPlan}
                  disabled={isAiLoading}
                  className={`flex items-center justify-center gap-2 flex-1 md:flex-initial ${theme.bgLight} ${theme.bgLightDark} ${theme.badgeText} dark:${theme.badgeTextDark} ${theme.borderAccent} ${theme.badgeBgDark} hover:opacity-80 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all disabled:opacity-50`}
                >
                  {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Lightbulb size={16} />}
                  <span className="hidden sm:inline">Estrategia IA</span><span className="sm:hidden">IA</span> ✨
                </button>
                <button onClick={() => setIsAddingAccount(true)} className={`flex items-center justify-center gap-2 flex-1 md:flex-initial ${theme.btnPrimary} text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
                  <Plus size={16} /> <span className="hidden sm:inline">Nueva Cuenta</span><span className="sm:hidden">Cuenta</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-lighter overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-dark-normal border-b border-slate-100 dark:border-dark-lighter">
                      <th className="p-2 sm:p-4 text-left font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest sticky left-0 bg-slate-50 dark:bg-dark-normal z-20 min-w-[55px] sm:min-w-[200px]"><span className="hidden sm:inline">Cuentas / Bancos</span><span className="sm:hidden">Cuenta</span></th>
                      {filteredMonths.map((mes, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <th key={mes} className={`p-2 sm:p-3 text-center min-w-[80px] sm:min-w-[100px] border-l border-slate-100 dark:border-dark-lighter ${isEven ? 'bg-slate-50/80 dark:bg-dark-normal/80' : 'bg-white/50 dark:bg-dark-lighter/30'}`}>
                            <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{mes.split(' ')[1]}</div>
                            <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">{mes.split(' ')[0]}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {cuentasAhorro.map(cuenta => (
                      <React.Fragment key={cuenta.id}>
                        <tr className="border-b border-slate-100 dark:border-dark-lighter">
                          <td className="p-2 sm:p-3 sticky left-0 bg-white dark:bg-dark-normal z-10 border-r border-slate-100 dark:border-dark-lighter font-black text-[9px] sm:text-xs uppercase tracking-widest" style={{ color: THEME_COLOR_HEX[themeColor] || THEME_COLOR_HEX.indigo }}>
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                {(() => { const bi = getAhorroBankInfo(cuenta.banco); return bi ? <img src={bi.logo} alt={cuenta.banco} className="w-6 h-4 sm:w-8 sm:h-5 object-contain flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} /> : <Building2 size={10} />; })()}
                                <span className="truncate">{cuenta.banco} - {cuenta.nombre}</span>
                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase">Ahorro</span>
                              </div>
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button onClick={() => {
                                  setNewAccount({ nombre: cuenta.nombre, banco: cuenta.banco });
                                  setAccountBancoSearch('');
                                  setEditingAccount(cuenta);
                                  setIsAddingAccount(true);
                                }} className="text-slate-300 hover:text-emerald-500 transition-colors p-1" title="Editar">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => {
                                  setCuentasAhorro(cuentasAhorro.filter(c => c.id !== cuenta.id));
                                  const { [cuenta.id]: _, ...rest } = ahorrosData;
                                  setAhorrosData(rest);
                                }} className="text-slate-300 hover:text-rose-500 transition-colors p-1" title="Eliminar">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-white dark:bg-dark-normal' : 'bg-slate-50/50 dark:bg-dark-lighter/20';
                            return (
                              <td key={mes} className={`p-2 sm:p-3 border-l border-slate-100 dark:border-dark-lighter ${cellBgBase}`}>
                                <input
                                  type="text"
                                  placeholder="+$"
                                  value={ahorrosData[cuenta.id]?.[mes]?.deposito ? new Intl.NumberFormat('es-CL').format(ahorrosData[cuenta.id][mes].deposito) : ''}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                    updateSavingData(cuenta.id, mes, 'deposito', parseInt(raw) || 0);
                                  }}
                                  className="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-center font-mono font-black text-base py-1.5 sm:py-2 rounded-lg border-2 border-transparent focus:border-emerald-400 outline-none transition-all"
                                />
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-dark-lighter">
                          <td className="p-2 sm:p-3 sticky left-0 bg-slate-50 dark:bg-dark-normal/50 z-10 border-r border-slate-100 dark:border-dark-lighter font-black text-[9px] sm:text-xs uppercase tracking-widest text-rose-500 pl-8 sm:pl-12">
                            <div className="flex items-center gap-1.5">
                              <ArrowDownCircle size={14} />
                              <span>Gasto / Retiro</span>
                            </div>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-white dark:bg-dark-normal' : 'bg-slate-50/50 dark:bg-dark-lighter/20';
                            return (
                              <td key={mes} className={`p-2 sm:p-3 border-l border-slate-100 dark:border-dark-lighter ${cellBgBase}`}>
                                <input
                                  type="text"
                                  placeholder="-$"
                                  value={ahorrosData[cuenta.id]?.[mes]?.gasto ? new Intl.NumberFormat('es-CL').format(ahorrosData[cuenta.id][mes].gasto) : ''}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9\-]/g, '');
                                    updateSavingData(cuenta.id, mes, 'gasto', parseInt(raw) || 0);
                                  }}
                                  className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-center font-mono font-black text-base py-1.5 sm:py-2 rounded-lg border-2 border-transparent focus:border-rose-400 outline-none transition-all"
                                />
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="border-b border-slate-100 dark:border-dark-lighter">
                          <td className="p-1.5 sm:p-2 sticky left-0 bg-slate-50 dark:bg-dark-normal z-10 border-r border-slate-100 dark:border-dark-lighter text-right pr-2 sm:pr-4">
                            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase">Saldo {cuenta.nombre}</span>
                          </td>
                          {filteredMonths.map((mes, idx) => {
                            const isEven = idx % 2 === 0;
                            const cellBgBase = isEven ? 'bg-slate-50/50 dark:bg-dark-normal/50' : 'bg-slate-100/30 dark:bg-dark-lighter/30';
                            return (
                              <td key={mes} className={`p-1.5 sm:p-2 border-l border-slate-100 dark:border-dark-lighter text-center ${cellBgBase}`}>
                                <div className="text-sm font-mono font-black text-slate-600 dark:text-slate-400">
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
                      <td className={`p-2 sm:p-4 sticky left-0 ${theme.btnPrimary} z-30 flex items-center gap-2 sm:gap-3`}>
                        <TrendingUp size={18} />
                        <span className="uppercase text-[10px] sm:text-sm"><span className="hidden sm:inline">Ahorro Total Acumulado</span><span className="sm:hidden">Ahorro Total</span></span>
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
        )}
        <div style={{ display: activeTab === 'transacciones' ? 'block' : 'none' }}>
          <Transacciones
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
          />
        </div></>}

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

        {isAddingDebt && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <CreditCard className={theme.tabText} size={20} /> {editingItem ? 'Editar Cuota' : 'Nueva Cuota'}
                </h3>
                <button onClick={() => { setIsAddingDebt(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveDebt} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Descripción</label>
                  <input required value={newDebt.descripcion} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all ${newDebt.isContribuciones ? 'text-slate-500 cursor-not-allowed' : ''} dark:text-slate-200`} placeholder="Ej: Notebook, Vacaciones..." />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Cuotas Totales</label>
                    <input type="number" required value={newDebt.cuotasTotales} readOnly={newDebt.isContribuciones} onChange={e => setNewDebt({ ...newDebt, cuotasTotales: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all ${newDebt.isContribuciones ? 'text-slate-500 cursor-not-allowed' : ''} dark:text-slate-200`} />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Valor Cuota</label>
                    <input type="number" required value={newDebt.valorCuota} onChange={e => setNewDebt({ ...newDebt, valorCuota: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Mes de Inicio</label>
                  <input
                    type="month"
                    required
                    value={monthStrToMonthInput(newDebt.mesInicio)}
                    onChange={handleMesInicioChange}
                    className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-amber-50 dark:bg-amber-900/20 p-3 sm:p-4 rounded-xl border border-amber-100 dark:border-amber-800">
                  <input type="checkbox" id="contrib" checked={newDebt.isContribuciones} onChange={handleContribucionesChange} className="w-4 h-4 sm:w-5 sm:h-5 rounded-md accent-amber-600" />
                  <label htmlFor="contrib" className="text-[10px] sm:text-xs font-bold text-amber-800 dark:text-amber-200">Es Contribución Legal (Solo 4 cuotas fijas al año)</label>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Día de Pago</label>
                    <input type="number" min="1" max="31" value={newDebt.diaPago} onChange={e => setNewDebt({ ...newDebt, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
                  </div>
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <input type="checkbox" className="sr-only peer" checked={newDebt.facturacionAuto} onChange={e => setNewDebt({ ...newDebt, facturacionAuto: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-dark-lightest peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-lightest peer-checked:bg-blue-600"></div>
                      <span className="text-[10px] sm:text-xs font-bold text-blue-800 dark:text-blue-200">Facturación Automática</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Banco / Institución</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={bancoSearch}
                      onChange={(e) => setBancoSearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
                      placeholder="Buscar banco..."
                    />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar mb-2">
                    {filteredBancos.map(b => (
                      <button type="button" key={b.id} onClick={() => setNewDebt({ ...newDebt, banco: b.nombre, bancoLogo: b.logo, tipoTarjeta: b.tipos.includes('visa') ? 'visa' : 'mastercard' })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newDebt.banco === b.nombre ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-dark-lighter hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                        <img src={b.logo} alt={b.nombre} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                        <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center text-slate-600 dark:text-slate-400">{b.nombre}</span>
                      </button>
                    ))}
                  </div>
                  {newDebt.banco && (
                    <div className="flex items-center gap-2 mb-2">
                      <img src={newDebt.bancoLogo} alt={newDebt.banco} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{newDebt.banco}</span>
                    </div>
                  )}
                </div>

                {newDebt.banco && (
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Tipo de Tarjeta</label>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      <button type="button" onClick={() => setNewDebt({ ...newDebt, tipoTarjeta: 'visa' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newDebt.tipoTarjeta === 'visa' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Visa</button>
                      <button type="button" onClick={() => setNewDebt({ ...newDebt, tipoTarjeta: 'mastercard' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newDebt.tipoTarjeta === 'mastercard' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Mastercard</button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Icono (opcional)</label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2">
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'default' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newDebt.iconType === 'default' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Por defecto</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newDebt.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                    <button type="button" onClick={() => { setNewDebt({ ...newDebt, iconType: 'chile_preset', iconValue: 'bancos:banco_de_chile' }); setDebtChileCat('bancos'); }} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newDebt.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                    <button type="button" onClick={() => setNewDebt({ ...newDebt, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newDebt.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                  </div>

                  {newDebt.iconType === 'preset' && (
                    <div>
                      <div className="relative mb-2 sm:mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          value={debtIconSearch}
                          onChange={(e) => setDebtIconSearch(e.target.value)}
                          className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                          placeholder="Buscar icono..."
                        />
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredDebtIcons.length > 0 ? filteredDebtIcons.map(i => (
                          <button type="button" key={i.id} onClick={() => setNewDebt({ ...newDebt, iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newDebt.iconValue === i.id ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <i.icon size={16} />
                            <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
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
                          <button key={cat} type="button" onClick={() => setDebtChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black border-2 transition-all ${debtChileCat === cat ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {CHILE_PRESET_ICONS[debtChileCat]?.map(i => {
                          const val = `${debtChileCat}:${i.id}`;
                          return (
                            <button key={i.id} type="button" onClick={() => setNewDebt({ ...newDebt, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newDebt.iconValue === val ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                              <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                              <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {newDebt.iconType === 'url' && (
                    <input value={newDebt.iconUrl} onChange={e => setNewDebt({ ...newDebt, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  )}
                </div>
                <button type="submit" className={`w-full ${theme.btnPrimary} text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-3 sm:mt-4`}>Guardar Registro</button>
              </form>
            </div>
          </div>
        )}

        {isAddingFixed && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <Receipt className="text-slate-800 dark:text-slate-200" size={20} /> {editingItem ? 'Editar Gasto' : 'Nuevo Gasto Fijo'}
                </h3>
                <button onClick={() => { setIsAddingFixed(false); setEditingItem(null); setFixedBancoSearch(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveFixed} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Descripción</label>
                  <input required value={newFixed.descripcion} onChange={e => setNewFixed({ ...newFixed, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Ej: Gastos Comunes, Luz, Internet..." />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Día de Pago</label>
                    <input type="number" min="1" max="31" value={newFixed.diaPago} onChange={e => setNewFixed({ ...newFixed, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
                  </div>
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <input type="checkbox" className="sr-only peer" checked={newFixed.facturacionAuto} onChange={e => setNewFixed({ ...newFixed, facturacionAuto: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-dark-lightest peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-lightest peer-checked:bg-blue-600"></div>
                      <span className="text-[10px] sm:text-xs font-bold text-blue-800 dark:text-blue-200">Facturación Automática</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Banco / Institución</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value={fixedBancoSearch} onChange={(e) => setFixedBancoSearch(e.target.value)} className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" placeholder="Buscar banco..." />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar mb-2">
                    {(fixedBancoSearch ? BANCOS_CHILE.filter(b => b.nombre.toLowerCase().includes(fixedBancoSearch.toLowerCase())) : BANCOS_CHILE).map(b => (
                      <button type="button" key={b.id} onClick={() => { setNewFixed({ ...newFixed, banco: b.nombre, bancoLogo: b.logo, tipoTarjeta: b.tipos.includes('visa') ? 'visa' : 'mastercard' }); setFixedBancoSearch(''); }} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newFixed.banco === b.nombre ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-dark-lighter hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                        <img src={b.logo} alt={b.nombre} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                        <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center text-slate-600 dark:text-slate-400">{b.nombre}</span>
                      </button>
                    ))}
                  </div>
                  {newFixed.banco && (
                    <div className="flex items-center gap-2 mb-2">
                      <img src={newFixed.bancoLogo} alt={newFixed.banco} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{newFixed.banco}</span>
                    </div>
                  )}
                  {newFixed.banco && (
                    <div>
                      <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Tipo de Tarjeta</label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button type="button" onClick={() => setNewFixed({ ...newFixed, tipoTarjeta: 'visa' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newFixed.tipoTarjeta === 'visa' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Visa</button>
                        <button type="button" onClick={() => setNewFixed({ ...newFixed, tipoTarjeta: 'mastercard' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newFixed.tipoTarjeta === 'mastercard' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Mastercard</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newFixed.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                  <button type="button" onClick={() => { setNewFixed({ ...newFixed, iconType: 'chile_preset', iconValue: 'agua:aguas_andinas' }); setFixedChileCat('agua'); }} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newFixed.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                  <button type="button" onClick={() => setNewFixed({ ...newFixed, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newFixed.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                </div>

                {newFixed.iconType === 'preset' && (
                  <div>
                    <div className="relative mb-2 sm:mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={fixedIconSearch}
                        onChange={(e) => setFixedIconSearch(e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                        placeholder="Buscar icono..."
                      />
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredFixedIcons.length > 0 ? filteredFixedIcons.map(i => (
                        <button type="button" key={i.id} onClick={() => setNewFixed({ ...newFixed, iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newFixed.iconValue === i.id ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                          <i.icon size={16} />
                          <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
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
                        <button key={cat} type="button" onClick={() => setFixedChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black border-2 transition-all ${fixedChileCat === cat ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {CHILE_PRESET_ICONS[fixedChileCat]?.map(i => {
                        const val = `${fixedChileCat}:${i.id}`;
                        return (
                          <button key={i.id} type="button" onClick={() => setNewFixed({ ...newFixed, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newFixed.iconValue === val ? `${theme.borderAccent} ${theme.btnPrimary} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                            <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {newFixed.iconType === 'url' && (
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">URL del Logo (PNG/SVG)</label>
                    <input value={newFixed.iconUrl} onChange={e => setNewFixed({ ...newFixed, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  </div>
                )}

                <button type="submit" className={`w-full ${theme.btnPrimary} text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-3 sm:mt-4`}>Registrar Gasto</button>
              </form>
            </div>
          </div>
        )}

        {isAddingAbono && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} /> {editingItem && editingItem.tipo === 'abono' ? 'Editar Abono' : 'Nuevo Abono'}
                </h3>
                <button onClick={() => { setIsAddingAbono(false); setEditingItem(null); setAbonoIconSearch(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveAbono} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Descripción</label>
                  <input required value={newAbono.descripcion} onChange={e => setNewAbono({ ...newAbono, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Ej: Freelance, Venta, Devolución..." />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Día de Pago</label>
                    <input type="number" min="1" max="31" value={newAbono.diaPago} onChange={e => setNewAbono({ ...newAbono, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none focus:border-emerald-500 transition-all dark:text-slate-200" />
                  </div>
                  <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 p-3 sm:p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <input type="checkbox" className="sr-only peer" checked={newAbono.facturacionAuto} onChange={e => setNewAbono({ ...newAbono, facturacionAuto: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-dark-lightest peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-lightest peer-checked:bg-emerald-600"></div>
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-200">Automático</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                  <button type="button" onClick={() => setNewAbono({ ...newAbono, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newAbono.iconType === 'preset' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                  <button type="button" onClick={() => { setNewAbono({ ...newAbono, iconType: 'chile_preset', iconValue: 'agua:aguas_andinas' }); setAbonoChileCat('agua'); }} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newAbono.iconType === 'chile_preset' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                  <button type="button" onClick={() => setNewAbono({ ...newAbono, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newAbono.iconType === 'url' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                </div>

                {newAbono.iconType === 'preset' && (
                  <div>
                    <div className="relative mb-2 sm:mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={abonoIconSearch}
                        onChange={(e) => setAbonoIconSearch(e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                        placeholder="Buscar icono..."
                      />
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredAbonoIcons.length > 0 ? filteredAbonoIcons.map(i => (
                        <button type="button" key={i.id} onClick={() => setNewAbono({ ...newAbono, iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newAbono.iconValue === i.id ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                          <i.icon size={16} />
                          <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
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
                        <button key={cat} type="button" onClick={() => setAbonoChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black border-2 transition-all ${abonoChileCat === cat ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {CHILE_PRESET_ICONS[abonoChileCat]?.map(i => {
                        const val = `${abonoChileCat}:${i.id}`;
                        return (
                          <button key={i.id} type="button" onClick={() => setNewAbono({ ...newAbono, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newAbono.iconValue === val ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                            <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {newAbono.iconType === 'url' && (
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">URL del Logo (PNG/SVG)</label>
                    <input value={newAbono.iconUrl} onChange={e => setNewAbono({ ...newAbono, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="https://ejemplo.com/logo.png" />
                  </div>
                )}

                <button type="submit" className={`w-full ${theme.btnPrimary} py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-3 sm:mt-4`}>Registrar Abono</button>
              </form>
            </div>
          </div>
        )}

        {isAddingAccount && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <PiggyBank className="text-emerald-600" size={20} /> {editingAccount ? 'Editar Cuenta de Ahorro' : 'Nueva Cuenta de Ahorro'}
                </h3>
                <button onClick={() => { setIsAddingAccount(false); setEditingAccount(null); setNewAccount({ nombre: '', banco: '' }); setAccountBancoSearch(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveAccount} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Nombre de la Cuenta</label>
                  <input required value={newAccount.nombre} onChange={e => setNewAccount({ ...newAccount, nombre: e.target.value })} className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none focus:border-emerald-500 transition-all dark:text-slate-200" placeholder="Ej: Fondo de Emergencia, Vacaciones..." />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Institución Financiera</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={accountBancoSearch}
                      onChange={(e) => setAccountBancoSearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold outline-none focus:border-emerald-500 transition-all dark:text-slate-200"
                      placeholder="Buscar banco..."
                    />
                  </div>
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                    {(accountBancoSearch
                      ? BANCOS_CHILE.filter(b => b.nombre.toLowerCase().includes(accountBancoSearch.toLowerCase()))
                      : BANCOS_CHILE
                    ).map(b => (
                      <button key={b.id} type="button" onClick={() => { setNewAccount({ ...newAccount, banco: b.nombre }); setAccountBancoSearch(''); }} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newAccount.banco === b.nombre ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                        <img src={b.logo} alt={b.nombre} className="w-10 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                        <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center">{b.nombre}</span>
                      </button>
                    ))}
                  </div>
                  {newAccount.banco && (
                    <div className="mt-2 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2">
                      <img src={getAhorroBankInfo(newAccount.banco)?.logo || ''} alt={newAccount.banco} className="w-8 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{newAccount.banco}</span>
                      <button type="button" onClick={() => { setNewAccount({ ...newAccount, banco: '' }); setAccountBancoSearch(''); }} className="ml-auto text-slate-400 hover:text-rose-500 p-0.5"><X size={14} /></button>
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 hover:bg-emerald-700 transition-all mt-3 sm:mt-4">{editingAccount ? 'Guardar Cambios' : 'Crear Cuenta'}</button>
              </form>
            </div>
          </div>
        )}

        {isAddingSub && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <RefreshCw className={theme.tabText} size={20} /> {editingItem?.tipo === 'suscripcion' ? 'Editar Suscripcion' : 'Nueva Suscripcion'}
                </h3>
                <button onClick={() => { setIsAddingSub(false); setEditingItem(null); setNewSub({ descripcion: '', valor: 0, billingCycle: 'mensual', diaPago: 1, mesInicio: months[0], durationYears: 1, facturacionAuto: false, banco: '', bancoLogo: '', tipoTarjeta: '', iconType: 'preset', iconValue: 'layout', iconUrl: '' }); setSubBancoSearch(''); setSubscriptionIconSearch(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveSubscription} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Servicio</label>
                  <input required value={newSub.descripcion} onChange={e => setNewSub({ ...newSub, descripcion: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Ej: Netflix, Spotify, YouTube..." />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Valor</label>
                  <input type="number" required value={newSub.valor} onChange={e => setNewSub({ ...newSub, valor: parseInt(e.target.value) || 0 })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} placeholder="Monto a pagar" />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Plan de facturacion</label>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button type="button" onClick={() => setNewSub({ ...newSub, billingCycle: 'mensual' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.billingCycle === 'mensual' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Mensual</button>
                    <button type="button" onClick={() => setNewSub({ ...newSub, billingCycle: 'anual' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.billingCycle === 'anual' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Anual</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Duracion (años)</label>
                    <select value={newSub.durationYears} onChange={e => setNewSub({ ...newSub, durationYears: parseInt(e.target.value) })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}>
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'año' : 'años'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Dia de pago</label>
                    <input type="number" min="1" max="31" required value={newSub.diaPago} onChange={e => setNewSub({ ...newSub, diaPago: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Mes de inicio</label>
                  <input
                    type="month"
                    required
                    value={monthStrToMonthInput(newSub.mesInicio)}
                    onChange={e => setNewSub({ ...newSub, mesInicio: monthInputToMonthStr(e.target.value) })}
                    className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                  />
                </div>

                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <label className="relative inline-flex items-center cursor-pointer gap-3">
                    <input type="checkbox" className="sr-only peer" checked={newSub.facturacionAuto} onChange={e => setNewSub({ ...newSub, facturacionAuto: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-dark-lightest peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-lightest peer-checked:bg-blue-600"></div>
                    <span className="text-[10px] sm:text-xs font-bold text-blue-800 dark:text-blue-200">Facturación Automática</span>
                  </label>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Banco / Institución</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value={subBancoSearch} onChange={(e) => setSubBancoSearch(e.target.value)} className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" placeholder="Buscar banco..." />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar mb-2">
                    {(subBancoSearch ? BANCOS_CHILE.filter(b => b.nombre.toLowerCase().includes(subBancoSearch.toLowerCase())) : BANCOS_CHILE).map(b => (
                      <button type="button" key={b.id} onClick={() => { setNewSub({ ...newSub, banco: b.nombre, bancoLogo: b.logo, tipoTarjeta: b.tipos.includes('visa') ? 'visa' : 'mastercard' }); setSubBancoSearch(''); }} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${newSub.banco === b.nombre ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-dark-lighter hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                        <img src={b.logo} alt={b.nombre} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                        <span className="text-[7px] sm:text-[8px] font-bold leading-none truncate w-full text-center text-slate-600 dark:text-slate-400">{b.nombre}</span>
                      </button>
                    ))}
                  </div>
                  {newSub.banco && (
                    <div className="flex items-center gap-2 mb-2">
                      <img src={newSub.bancoLogo} alt={newSub.banco} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{newSub.banco}</span>
                    </div>
                  )}
                  {newSub.banco && (
                    <div>
                      <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Tipo de Tarjeta</label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button type="button" onClick={() => setNewSub({ ...newSub, tipoTarjeta: 'visa' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.tipoTarjeta === 'visa' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Visa</button>
                        <button type="button" onClick={() => setNewSub({ ...newSub, tipoTarjeta: 'mastercard' })} className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.tipoTarjeta === 'mastercard' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Mastercard</button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400 mb-1.5 block">Icono</label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
                    <button type="button" onClick={() => setNewSub({ ...newSub, iconType: 'preset' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.iconType === 'preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Iconos</button>
                    <button type="button" onClick={() => { setNewSub({ ...newSub, iconType: 'chile_preset', iconValue: 'medios-pago:webpay' }); setSubChileCat('medios-pago'); }} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>Chile</button>
                    <button type="button" onClick={() => setNewSub({ ...newSub, iconType: 'url' })} className={`py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black border-2 transition-all ${newSub.iconType === 'url' ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>URL</button>
                  </div>

                  {newSub.iconType === 'preset' && (
                    <div>
                      <div className="relative mb-2 sm:mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          value={subscriptionIconSearch}
                          onChange={(e) => setSubscriptionIconSearch(e.target.value)}
                          className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200`}
                          placeholder="Buscar icono..."
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2 max-h-28 sm:max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredSubscriptionIcons.length > 0 ? filteredSubscriptionIcons.map(i => (
                          <button type="button" key={i.id} onClick={() => setNewSub({ ...newSub, iconType: 'preset', iconValue: i.id })} className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${newSub.iconValue === i.id && newSub.iconType === 'preset' ? `${theme.borderAccent} ${theme.btnSub} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                            <i.icon size={14} />
                            <span className="text-[6px] sm:text-[7px] font-bold leading-none truncate w-full text-center">{i.label}</span>
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
                          <button key={cat} type="button" onClick={() => setSubChileCat(cat)} className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black border-2 transition-all ${subChileCat === cat ? `${theme.borderAccent} ${theme.bgModalLight} ${theme.tabText}` : 'border-slate-100 dark:border-dark-lighter text-slate-400'}`}>{CHILE_CATEGORY_LABELS[cat]}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 max-h-28 sm:max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                        {CHILE_PRESET_ICONS[subChileCat]?.map(i => {
                          const val = `${subChileCat}:${i.id}`;
                          return (
                            <button key={i.id} type="button" onClick={() => setNewSub({ ...newSub, iconValue: val })} className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${newSub.iconValue === val && newSub.iconType === 'chile_preset' ? `${theme.borderAccent} ${theme.btnSub} text-white` : 'border-slate-100 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'}`}>
                              <img src={i.path} alt={i.label} className="w-8 h-5 object-contain" />
                              <span className="text-[6px] sm:text-[7px] font-bold leading-none truncate w-full text-center">{i.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {newSub.iconType === 'url' && (
                    <input value={newSub.iconUrl} onChange={e => setNewSub({ ...newSub, iconUrl: e.target.value })} className={`w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-bold outline-none ${theme.focusBorder} transition-all dark:text-slate-200 mt-2`} placeholder="https://ejemplo.com/logo.png" />
                  )}
                </div>

                <button type="submit" className={`w-full ${theme.btnSub} text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all mt-3 sm:mt-4`}>Guardar Suscripcion</button>
              </form>
            </div>
          </div>
        )}

        {viewingItem && (
          <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  {viewingItem.tipo === 'cuota' ? <CreditCard className={theme.tabText} size={20} /> : viewingItem.tipo === 'suscripcion' ? <RefreshCw className={theme.tabText} size={20} /> : viewingItem.tipo === 'abono' ? <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} /> : <Receipt className="text-slate-800 dark:text-slate-200" size={20} />}
                  Detalles
                </h3>
                <button onClick={() => setViewingItem(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-100 dark:bg-dark-lighter rounded-xl w-12 h-12 flex items-center justify-center">
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Cuotas Totales</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.cuotasTotales}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Valor Cuota</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{formatCurrency(viewingItem.data.valorCuota)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Mes Inicio</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.mesInicio}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Día de Pago</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">Día {viewingItem.data.diaPago || 1}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Progreso</span>
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
                              <span className="text-[9px] font-bold text-slate-400">{faltantes} faltante{faltantes !== 1 ? 's' : ''}</span>
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Banco / Institución</span>
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
                      <span className="text-[10px] sm:text-xs font-bold text-blue-800 dark:text-blue-200">
                        {viewingItem.data.facturacionAuto ? 'Facturación Automática Activada' : 'Sin Facturación Automática'}
                      </span>
                    </div>
                  </>
                )}

                {viewingItem.tipo === 'suscripcion' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Valor</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{formatCurrency(viewingItem.data.valor)}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ciclo</span>
                        <p className="font-black text-slate-800 dark:text-slate-200">{viewingItem.data.billingCycle === 'mensual' ? 'Mensual' : 'Anual'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Día de Pago</span>
                      <p className="font-black text-slate-800 dark:text-slate-200">Día {viewingItem.data.diaPago || 1}</p>
                    </div>
                    {viewingItem.data.banco && (
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Banco / Institución</span>
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
                      <span className="text-[10px] sm:text-xs font-bold text-blue-800 dark:text-blue-200">
                        {viewingItem.data.facturacionAuto ? 'Facturación Automática Activada' : 'Sin Facturación Automática'}
                      </span>
                    </div>
                  </>
                )}

                {(viewingItem.tipo === 'fijo' || viewingItem.tipo === 'abono') && (
                  <>
                    <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Día de Pago</span>
                      <p className="font-black text-slate-800 dark:text-slate-200">Día {viewingItem.data.diaPago || 1}</p>
                    </div>
                    {viewingItem.data.banco && (
                      <div className="bg-slate-50 dark:bg-dark-lighter/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Banco / Institución</span>
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
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-200">
                        {viewingItem.data.facturacionAuto ? 'Automático' : 'Manual'}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex gap-2 mt-6">
                  <button onClick={() => { setViewingItem(null); handleEditItem(viewingItem.data); }} className={`flex-1 ${theme.btnPrimary} text-white py-2.5 sm:py-3 rounded-xl font-black text-sm shadow-lg ${theme.shadowBtn} hover:opacity-90 transition-all`}>
                    Editar
                  </button>
                  <button onClick={() => setViewingItem(null)} className="flex-1 bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-slate-300 py-2.5 sm:py-3 rounded-xl font-black text-sm hover:bg-slate-200 dark:hover:bg-dark-lightest transition-all">
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
    </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('loading');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const push = usePushNotifications(token);
  const install = useInstallPrompt();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialHasMailbox, setTutorialHasMailbox] = useState(false);

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
        <div className="min-h-screen bg-kk-background dark:bg-dark-darker flex items-center justify-center font-sans transition-colors duration-300">
        <Loader2 className="animate-spin text-kk-primary" size={40} />
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
    <>
      <Dashboard
        user={user}
        token={token}
        onLogout={handleLogout}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenTutorial={(hasMailbox) => { setTutorialHasMailbox(hasMailbox ?? false); setShowTutorial(true); }}
        isPushSubscribed={push.isSubscribed}
        isPushLoading={push.loading}
        onToggleNotifications={() => {
          if (push.isSubscribed) {
            push.unsubscribe();
          } else {
            push.subscribe();
          }
        }}
        isInstallable={install.isInstallable}
        onInstall={install.install}
      />
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#f7f9fb] rounded-2xl w-full max-w-5xl mx-4 h-[90vh] max-h-[900px] shadow-2xl overflow-hidden">
            <TutorialFlow user={user} onClose={() => setShowTutorial(false)} hasMailboxConfigured={tutorialHasMailbox} />
          </div>
        </div>
      )}
    </>
  );
};

export default App;

