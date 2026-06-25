# Tutorial: 6 Fixes

## Fix 1: Move step indicator from bottom nav to header (StepInicio.jsx)

**Header**: Replace `div.w-10` with step indicator:
```jsx
<div className="hidden md:flex items-center gap-4">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-[#2dbc8b] text-white flex items-center justify-center text-xs font-bold">1</div>
    <span className="text-[14px] leading-5 font-semibold text-[#0a192f]">Inicio</span>
  </div>
  <div className="w-12 h-0.5 bg-[#f1f5f9]" />
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] text-[#515f78] flex items-center justify-center text-xs font-bold">2</div>
    <span className="text-[14px] leading-5 font-semibold text-[#515f78]">Correo</span>
  </div>
</div>
```

**Nav**: Remove the hidden md:flex steps div. Keep only the button:
```jsx
<nav className="sticky bottom-0 z-50 bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.04)] px-4 py-6 border-t border-[#f1f5f9] flex flex-col md:flex-row md:justify-center items-center gap-4 flex-shrink-0">
  <button onClick={onNext} ...>Empezar</button>
</nav>
```

## Fix 2: Stepper cut off in Step 1 (Step1.jsx)

Remove `h-10` from: `<div className="flex items-center w-full max-w-md gap-0 relative h-10">`
→ `<div className="flex items-center w-full max-w-md gap-0 relative">`

## Fix 3: Back from step 1 goes to StepInicio (TutorialFlow.jsx + Step1.jsx)

**TutorialFlow.jsx**:
- Line 35: `if (step > 1)` → `if (step > 0)`
- Line 62: add `onBack={goBack}` to Step1 props

**Step1.jsx**:
- Line 3: add `onBack` to destructured props
- Line 10: `<button onClick={onClose}` → `<button onClick={onBack || onClose}`

## Fix 4: Transition animations

No code changes needed. Fix 3 unblocks the animation chain since `goBack` now fires for step 1 → step 0. The wrapper `<div key={step} className={`h-full ${animClass}`}>` already applies animation classes on each step change.

**Note**: Ensure StepOpcional's inline `onBack` also sets `animClass` — currently done inline, already works.

## Fix 5: Copy email button in Step 1 (Step1.jsx)

Add a `Copy` icon button next to the email address in the step 1 content card (line 101):

```jsx
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText(reenvioEmail);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

Add import: `import { ..., Copy, Check } from 'lucide-react';`

Replace `<span className="text-[#2dbc8b] select-all">{reenvioEmail}</span>` with:
```jsx
<span className="inline-flex items-center gap-2 bg-[#f1f5f9] rounded-lg px-3 py-1.5">
  <span className="text-[#2dbc8b] select-all text-[20px]">{reenvioEmail}</span>
  <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-[#e0e3e5] transition-colors active:scale-95" title="Copiar email">
    {copied ? <Check size={18} className="text-[#2dbc8b]" /> : <Copy size={18} className="text-[#515f78]" />}
  </button>
  {copied && <span className="text-[12px] leading-4 text-[#2dbc8b] font-semibold">Copiado!</span>}
</span>
```

## Fix 6: Step 4 divided with scroll (Step4.jsx)

Add `flex flex-col` to the `<main>` element so children distribute vertically:
```
className="flex-1 overflow-y-auto max-w-[1200px] mx-auto w-full px-4 md:px-10 py-6"
→
className="flex-1 overflow-y-auto max-w-[1200px] mx-auto w-full px-4 md:px-10 py-6 flex flex-col"
```

## Build

Run `npm run build` and verify no errors.
