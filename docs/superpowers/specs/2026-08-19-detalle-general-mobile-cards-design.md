# Detalle General & Ahorros: replace matrix tables with month-nav + cards

## Problem

`Dashboard.jsx` has two item-by-month matrix tables:

- **Detalle General** (`activeTab === 'general'`, `src/Dashboard.jsx:1663-2055`): one row per deuda/gasto fijo/suscripción/abono (`itemsUnificados`), one column per month in `filteredMonths`, plus a `tfoot` with totals (Cuotas, Fijos, Subs, Abonos, Sueldo input, Disponible).
- **Cuentas de Ahorro** (`activeTab === 'ahorros'`, `src/Dashboard.jsx:2056-2221`): one card-group of 3 rows per cuenta (Depósito, Gasto/Retiro, Saldo), one column per month, plus a `tfoot` total (Ahorro Total Acumulado).

Both are wrapped in `overflow-x-auto` with `min-w-[900px]` / `min-w-[600px]`, so on phone width they only work as a horizontal-scroll spreadsheet — not usable. Same class of problem `Transacciones.jsx` had before it was replaced with a card list (`694dfd3`).

## Scope

Delete both tables entirely (all breakpoints, not just `<sm`) and replace with a shared "month nav + summary card + item cards" pattern, same spirit as the Transacciones card list. Desktop intentionally gives up side-by-side multi-month view in exchange for one consistent pattern across the app. Nothing else in `Dashboard.jsx` changes except `dashboardMonth` becomes shared state (see below).

Out of scope: `Transacciones.jsx`, `activeTab === 'dashboard'` (Resumen) content itself, `CategoriasConfig.jsx`.

## Shared state changes

- `dashboardMonth` (`src/Dashboard.jsx:79`) currently belongs only to the Resumen tab (`activeTab === 'dashboard'`, uses a `<select>` at `:1145-1158`). It becomes the shared "current month" for Resumen, Detalle General and Ahorros. Its `<select>` is replaced by a `MonthNav` bar (new small inline component or extracted function) rendered in all three tabs:

  ```
  <button disabled={idx <= 0} onClick={prev}><ChevronLeft/></button>
  <span>{dashboardMonth}</span>
  <button disabled={idx >= filteredMonths.length-1} onClick={next}><ChevronRight/></button>
  ```

  `idx = filteredMonths.indexOf(dashboardMonth)`. Bounded to `filteredMonths` (i.e. to `selectedYear`) exactly like today's `<select>` was. Add `ChevronLeft`, `ChevronRight` to the `lucide-react` import (`src/Dashboard.jsx:5-33`).

- New: `expandedGeneralItems` (`{ [itemId]: boolean }`) and `expandedAhorroCuentas` (`{ [cuentaId]: boolean }`) — local `useState({})`, toggled by each card's "Ver año completo" button. Not persisted.

## Detalle General tab (`:1663-2055`)

Structure top to bottom, replacing the whole table block:

1. Existing toolbar (year select + Nueva Cuota/Gasto Fijo/Abono/Suscripciones/+1 Mes buttons, `:1665-1695`) — unchanged.
2. `MonthNav` bar.
3. Summary card — dark (`bg-slate-900`, matches current `tfoot` styling), one row per total, sourced from `totalesMensuales[dashboardMonth]` (`:611`) exactly like the Resumen tab already does at `:1162-1174`:
   - Sueldo: editable input, same `onChange` pattern as `:2015-2024` (`setSueldos({ ...sueldos, [dashboardMonth]: val })`).
   - Cuotas / Gastos Fijos / Suscripciones / Abonos: read-only, formatted with `formatCurrency`.
   - Disponible: `sueldo + abonos - (cuotas + gastos + subs)` (i.e. `totalesMensuales[mes].neto`), emerald if ≥0 else rose, same as `:2041`.
4. `itemsUnificados.length > 0 ? list : empty state`. Empty state: centered message "No hay registros para mostrar" (was `:1924`), plain card/div instead of a `td colSpan`.
5. Item list: `<div className="space-y-2 sm:space-y-3">`, one card per `itemsUnificados` entry.

### Item card

Reuses all existing logic verbatim, just re-skinned from `<td>`/`<tr>` into `<div>`s:

- Header (from `:1726-1747`): icon box (`renderDebtIcon`/`renderSubscriptionIcon`/`renderFixedIcon`, `:947-985`) with `bancoLogo` corner badge for `cuota`, name (opens `setViewingItem` on tap, unchanged), type badges (Legal/Sub/ABONO/tipoTarjeta — no longer need the `hidden sm:inline` qualifiers since this is now the only rendering path), sub-label (banco or "Día N").
- Actions (from `:1748-1765`): Edit (`handleEditItem`) and Delete (`confirmDelete` with the same per-type `itemType`/`onConfirm`) buttons — already have `min-w-[44px] min-h-[44px]` tap targets, keep as-is, drop the `sm:opacity-0 sm:group-hover:opacity-100` hover-reveal (no hover on touch; always visible).
- Progress bar — only for `item.tipo === 'cuota'`: reuse the `pagadas`/`totalCuotas`/`pct`/`faltantes` calculation from `:1888-1914` verbatim, rendered as a small bar + `${pagadas}/${totalCuotas}` + `${faltantes} faltante(s)` (drop the `sm:`-only "pagadas"/"faltante" text hiding).
- Current-month block: computed for `mes = dashboardMonth`, mirroring the per-type branch in `:1768-1887` (`isMonthInRange`/`isActive`/`pago` lookups, same `onClick` toggle handlers: direct `setDeudas` for cuota, `setSuscripciones` for suscripcion, `updateAbonoPayment`/`updateFixedPayment` for abono/fijo). If the item isn't active/in-range for `dashboardMonth`, render a muted "No aplica en {mes}" state instead of the pill (equivalent of today's faded empty `<td>`).
  - `cuota`: status pill only (amount is fixed `valorCuota`, shown next to it), tap toggles PAGADA/PENDIENTE.
  - `suscripcion`/`abono`/`fijo`: status pill + the existing `$`-prefixed numeric input (same `onChange` parsing `/[^0-9\-]/g`), tap-on-pill toggles status same as today's `onClick` guarded by `hasValue`/`pago.monto > 0`.
- "Ver año completo ▾" button (hidden for items with only 1 relevant month, not a real constraint here — always show it): toggles `expandedGeneralItems[item.id]`. When expanded, render a `grid grid-cols-3 gap-1.5` of chips over all `filteredMonths` (same per-type active/inRange checks as above, condensed):
  - Chip shows month abbrev + amount, colored by paid state (emerald if PAGADA, slate/pending otherwise, faded/dimmed if not active that month).
  - Tapping a chip: `setDashboardMonth(mes)` (so the one current-month block above becomes that month, ready to edit/toggle) rather than editing inline in the grid.

## Ahorros tab (`:2056-2221`)

Same shape:

1. Existing header (title, year select, IA/Nueva Cuenta buttons, `:2058-2089`) — unchanged.
2. `MonthNav` bar (shared `dashboardMonth`/`filteredMonths`, same component as Detalle General).
3. Summary card: single line, "Ahorro Total Acumulado" = `totalAhorroMensual[dashboardMonth]` (`:553`).
4. `cuentasAhorro.length > 0 ? list : empty state` (no explicit empty state exists today — add one, same style as Detalle General's).
5. Account cards, `space-y-2 sm:space-y-3`.

### Account card

- Header (from `:2112-2136`): bank logo via `getAhorroBankInfo(cuenta.banco)` or `Building2` fallback, `${cuenta.banco} - ${cuenta.nombre}`, "Ahorro" badge, Edit (opens `setEditingAccount`/`setIsAddingAccount`) and Delete (`setCuentasAhorro`/prunes `ahorrosData`) — same handlers as `:2120-2134`.
- Current-month block: two inputs side by side for `mes = dashboardMonth` — Depósito (`updateSavingData(cuenta.id, mes, 'deposito', val)`, from `:2143-2152`) and Gasto/Retiro (`updateSavingData(cuenta.id, mes, 'gasto', val)`, from `:2169-2177`) — same emerald/rose styling as today's inputs. Below them, computed Saldo (`balancesPorCuenta[cuenta.id]?.[mes]?.acumulado`, from `:2191-2194`), read-only.
- "Ver año completo" button toggles `expandedAhorroCuentas[cuenta.id]`; expands to a `grid grid-cols-3 gap-1.5` of chips, one per `filteredMonths` entry, each showing month + `balancesPorCuenta[cuenta.id]?.[mes]?.acumulado`. Tapping a chip does `setDashboardMonth(mes)` (same jump-to-edit pattern as Detalle General).
- Footer total row (`tfoot`, `:2202-2217`) is replaced by the summary card in step 3 — no per-card equivalent needed.

## Styling

Match the app's existing tokens throughout — no new colors/fonts introduced:

- Cards: `bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-2xl`, same radius scale as Transacciones cards.
- Summary card: `bg-slate-900` (matches today's `tfoot`), white/slate-300 text, emerald-400/rose-400 for Disponible sign, same as `:2041`.
- Status pill: emerald (bg-emerald-500 text-white) for PAGADA, slate-300/dark-lightest for pending, matching current button colors (`:1782`, `:1805` etc.) — no new palette.
- Chips (expanded grid): same emerald/slate pending colors, `rounded-xl`, `text-[10px]` month label + `text-xs font-black font-mono` amount.

## Edge cases

- `filteredMonths` empty (no months for `selectedYear`): `MonthNav` renders disabled with a "—" label; summary card and item list render normally against `undefined` totals (existing `totalesMensuales[mes]` / `balancesPorCuenta` already tolerate a missing key via optional chaining in the current code, keep that).
- `itemsUnificados` / `cuentasAhorro` empty: centered empty-state message (existing copy for Detalle General; new copy "Sin cuentas de ahorro" for Ahorros, same visual treatment).
- Switching `selectedYear` while `dashboardMonth` is outside the new `filteredMonths`: reuse the existing effect at `:228-241` (already re-picks `dashboardMonth` from `filteredMonths` when it's out of range) — no new effect needed, just confirm it still fires for `general`/`ahorros` tabs too (it's not tab-gated today).
- Expanding many cards at once on a long list: no virtualization — acceptable, same as Transacciones' card list has no virtualization either.

## Testing

No existing test suite covers `Dashboard.jsx` interactions (confirm via `Glob` before implementing — if one exists, extend it; otherwise this ships without new automated tests, consistent with how `694dfd3` shipped). Verification is manual: run the app (`Skill: run`), open Detalle General and Ahorros at phone width and desktop width, exercise:
- Month nav prev/next at both ends of the year.
- Toggling paid/pending for each item type (cuota, fijo, sub, abono) and for a saving account's implicit paid state (n/a — saldo has no toggle, just verify input persistence).
- Expand/collapse per card, tapping an expanded chip to jump `dashboardMonth`.
- Edit/Delete buttons still open the right modal / confirm dialog.
- Sueldo input in the summary card still feeds `totalesMensuales` (compare against Resumen tab for the same month).
