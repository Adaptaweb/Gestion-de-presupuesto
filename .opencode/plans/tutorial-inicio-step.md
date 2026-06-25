# Tutorial: Add StepInicio (welcome screen) + KK logo in headers

## What changed
User added `public/tutorial/inicio/` with `DESIGN.md` (brand guide) and `screen.png` (hero image, 266KB). Logo exists at `public/kuentasklaras-logo.svg`. Need a welcome step (Step 0) and logo integration.

## Files to create

### `src/components/tutorial/StepInicio.jsx`
Welcome/intro screen rendered first when tutorial opens:

- Layout: `h-full flex flex-col overflow-hidden` (same modal-compatible pattern as other steps)
- Header: sticky, right-aligned "Saltar" button that calls `onClose`
- Main: centered flex column with:
  - KK logo (`/kuentasklaras-logo.svg`, 64-80px)
  - Title: "Kuentas Klaras" in navy-deep (`#0a192f`)
  - Subtitle: "Te guiaremos paso a paso..." in secondary (`#515f78`)
  - Hero image: `/tutorial/inicio/screen.png` in rounded card with shadow
  - **"Comenzar tutorial"** button (primary mint `#2dbc8b`, arrow icon) → `onNext`
  - **"Ir al inicio"** text link → `onClose`
- No progress stepper (it's the welcome screen)

## Files to modify

### `src/components/TutorialFlow.jsx`
- Change `useState(1)` → `useState(0)` for initial step
- Import `StepInicio` from `./tutorial/StepInicio`
- Add: `if (step === 0) return <StepInicio {...sharedProps} onNext={goNext} onClose={onClose} />;`
- `goBack` at step 0 should call `onClose` (already handled — `step > 1` check means 0 falls to else)

### Step headers (Step1.jsx, StepOpcional.jsx, Step2.jsx, Step3.jsx, Step4.jsx)
Replace or supplement the text "Kuentas Klaras" in each `<header>` with the logo image:
```jsx
<img src="/kuentasklaras-logo.svg" alt="Kuentas Klaras" className="w-8 h-8" />
```
Keep the text alongside or replace depending on visual preference. The logo is a simple SVG (letter K mark), so replacing the text "Kuentas Klaras" with `[logo] + "Kuentas Klaras"` works well.

## Build
`npm run build` — expect success (no new deps, only new component + import changes)
