import {
  User, Users, Palette, BrainCircuit,
  LogOut, ChevronDown, Check, Loader2, RefreshCw,
  Settings2, Filter, Tags, Bell,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'

const THEME_COLORS = ['kk', 'indigo', 'blue', 'emerald', 'purple', 'rose', 'amber', 'teal', 'slate']
const THEME_COLOR_HEX = {
  kk: '#059669', indigo: '#4f46e5', blue: '#2563eb', emerald: '#059669',
  purple: '#9333ea', rose: '#e11d48', amber: '#d97706',
  teal: '#0d9488', slate: '#475569',
}
const COLOR_NAMES = {
  kk: 'Principal', indigo: 'Índigo', blue: 'Azul', emerald: 'Esmeralda',
  purple: 'Púrpura', rose: 'Rosa', amber: 'Ámbar',
  teal: 'Cian', slate: 'Gris',
}

export function UserMenu({
  user,
  themeColor, setThemeColor,
  isDarkMode, setIsDarkMode,
  onOpenAdmin, onOpenCategorias, onLogout,
  generateFinancialAdvice, isAiLoading,
  isPushSubscribed, isPushLoading,
  onToggleNotifications,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter px-3 py-2 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300 min-h-[40px]">
          <User size={16} className="text-slate-400 flex-shrink-0" />
          <span className="truncate max-w-[100px]">{user.name}</span>
          {user.role === 'admin' && (
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0">Admin</span>
          )}
          <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-2xl p-1" align="end">
        <DropdownMenuGroup>
          {user.role === 'admin' && (
            <DropdownMenuItem onClick={onOpenAdmin} className="p-2 rounded-lg cursor-pointer">
              <Users size={16} className="mr-2 text-slate-500" />
              <span>Usuarios</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => window.dispatchEvent(new CustomEvent('opencode:open-config'))}
            className="p-2 rounded-lg cursor-pointer"
          >
            <Settings2 size={16} className="mr-2 text-slate-500" />
            <span>Configurar</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => window.dispatchEvent(new CustomEvent('opencode:open-filters'))}
            className="p-2 rounded-lg cursor-pointer"
          >
            <Filter size={16} className="mr-2 text-slate-500" />
            <span>Reglas</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onOpenCategorias}
            className="p-2 rounded-lg cursor-pointer"
          >
            <Tags size={16} className="mr-2 text-slate-500" />
            <span>Categorías</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="p-2 rounded-lg cursor-pointer">
              <Palette size={16} className="mr-2 text-slate-500" />
              <span>Color del tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-3 rounded-xl min-w-[180px]">
              <div className="grid grid-cols-3 gap-2">
                {THEME_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${themeColor === color ? 'ring-[3px] ring-offset-2 ring-slate-400 dark:ring-offset-slate-800 scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: THEME_COLOR_HEX[color] }}
                    >
                      {themeColor === color && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 capitalize">
                      {COLOR_NAMES[color]}
                    </span>
                  </button>
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={generateFinancialAdvice}
            disabled={isAiLoading}
            className="p-2 rounded-lg cursor-pointer"
          >
            {isAiLoading ? (
              <Loader2 size={16} className="mr-2 text-slate-500 animate-spin" />
            ) : (
              <BrainCircuit size={16} className="mr-2 text-slate-500" />
            )}
            <span>Consultar IA ✨</span>
          </DropdownMenuItem>

          <div
            onClick={() => { if (!isPushLoading) onToggleNotifications(); }}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-lighter transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              {isPushLoading ? (
                <Loader2 size={16} className="text-slate-500 animate-spin" />
              ) : (
                <Bell size={16} className="text-slate-500" />
              )}
              <span>Notificaciones</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPushSubscribed}
              disabled={isPushLoading}
              onClick={(e) => { e.stopPropagation(); if (!isPushLoading) onToggleNotifications(); }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPushSubscribed ? 'bg-kk-primary' : 'bg-slate-300 dark:bg-slate-600'
              } ${isPushLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                  isPushSubscribed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <DropdownMenuItem
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(regs => {
                  regs.forEach(r => r.unregister());
                }).finally(() => window.location.reload());
              } else {
                window.location.reload();
              }
            }}
            className="p-2 rounded-lg cursor-pointer"
          >
            <RefreshCw size={16} className="mr-2 text-slate-500" />
            <span>Recargar app</span>
          </DropdownMenuItem>

        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onLogout} className="p-2 rounded-lg cursor-pointer text-rose-500">
            <LogOut size={16} className="mr-2" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
