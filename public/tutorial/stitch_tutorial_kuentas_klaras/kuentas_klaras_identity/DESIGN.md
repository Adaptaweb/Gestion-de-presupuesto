---
name: Kuentas Klaras Identity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4a43'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4d'
  primary: '#006c4d'
  on-primary: '#ffffff'
  primary-container: '#2dbc8b'
  on-primary-container: '#004530'
  inverse-primary: '#58dda9'
  secondary: '#515f78'
  on-secondary: '#ffffff'
  secondary-container: '#d2e0fe'
  on-secondary-container: '#55637d'
  tertiary: '#006c4e'
  on-tertiary: '#ffffff'
  tertiary-container: '#44ba90'
  on-tertiary-container: '#004531'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#77fac4'
  primary-fixed-dim: '#58dda9'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#005139'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#b9c7e4'
  on-secondary-fixed: '#0d1c32'
  on-secondary-fixed-variant: '#39475f'
  tertiary-fixed: '#85f8c9'
  tertiary-fixed-dim: '#68dbae'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  mint-dark: '#2dbc8b'
  mint-bright: '#6de0b3'
  navy-deep: '#0a192f'
  gray-soft: '#f1f5f9'
  white: '#ffffff'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  unit-1: 0.25rem
  unit-2: 0.5rem
  unit-4: 1rem
  unit-6: 1.5rem
  unit-8: 2rem
  unit-12: 3rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  gutter: 1.5rem
---

## Brand & Style

The brand personality for this design system is **approachable, transparent, and precise**. As a finance app focused on "Clear Accounts," the UI must eliminate financial anxiety through extreme legibility and a welcoming atmosphere. It targets users seeking financial literacy and control, requiring a balance between a professional fintech tool and a supportive coach.

The design style is **Corporate / Modern** with a **Tactile** edge. It utilizes generous whitespace and a "soft-pro" aesthetic—retaining the professional structure of a banking app but softening the interaction points with rounded corners and subtle depth. The visual narrative focuses on a "step-by-step" journey, using clear hierarchy to guide users through complex data without overwhelming them.

## Colors

The palette is anchored by **Mint Green**, symbolizing growth and clarity. 

- **Primary (`#2dbc8b`)**: Used for action buttons, success states, and key brand moments.
- **Secondary (`#0a192f`)**: A deep navy used for high-contrast typography and structural elements to ensure authority and readability.
- **Tertiary (`#6de0b3`)**: A brighter tint of mint used for accents, highlights, and secondary progress indicators.
- **Neutral (`#f8fafc`)**: A soft, cool-toned gray that prevents the clinical feeling of pure white while maintaining a clean backdrop.

Backgrounds should primarily use `white` for content cards and `gray-soft` for the application canvas to create subtle separation.

## Typography

This design system uses **Inter** for all roles to achieve a clean, systematic, and highly legible appearance. 

- **Headlines**: Use heavy weights (Bold/700) and slightly negative letter spacing for a modern, "locked-in" look.
- **Body Text**: Maintain a generous line height (1.5x) to ensure large blocks of financial data remain scannable.
- **Labels**: Used for secondary information and navigation; these should utilize the Medium or Semi-Bold weights to maintain hierarchy against body text.
- **Hierarchy**: On mobile, headlines should scale down to prevent awkward wrapping, ensuring the "tutorial" feel remains intact.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy for desktop (1200px max-width) and a **Fluid** model for mobile. It uses an 8px base rhythm to ensure consistent vertical harmony.

- **Desktop**: 12-column grid with 24px gutters.
- **Mobile**: Single column with 16px side margins. 
- **Rhythm**: Use `unit-6` (24px) for the majority of vertical gaps between sections to maintain the "generous whitespace" requested. 
- **Alignment**: Interactive elements like inputs and buttons must always align to the grid edges to reinforce the "precise" brand attribute.

## Elevation & Depth

To convey hierarchy without clutter, this design system employs **Tonal Layers** and **Ambient Shadows**.

1.  **Canvas (Level 0)**: Uses `gray-soft`. 
2.  **Surface (Level 1)**: White cards used for the main content. These feature a very soft, diffused shadow (10% opacity Navy-Deep, 12px blur, 4px Y-offset) to appear "lifted" from the background.
3.  **Active/Hover (Level 2)**: For buttons or selected cards, increase the shadow spread slightly and add a 1px border of `mint-dark` at 20% opacity.

Avoid harsh black shadows; always tint shadows with `navy-deep` to keep the palette cohesive and professional.

## Shapes

The shape language transitions from the logo's sharp edges to a **Rounded** UI philosophy to enhance friendliness. 

- **Cards and Containers**: 1rem (`rounded-lg`) corner radius to create a soft, modern frame for data.
- **Buttons and Inputs**: 0.5rem (`base`) corner radius.
- **Selection Indicators**: Use pill-shapes (full rounding) for tags or chips to differentiate them from functional buttons.

## Components

### Buttons
- **Primary**: Solid `mint-dark` with White text. Bold weight. High-contrast and center-aligned.
- **Secondary**: Ghost style with a `mint-dark` 1.5px border and `mint-dark` text.
- **Tutorial Next**: Large, full-width primary buttons with a right-arrow icon to signify progress.

### Cards
- White background, `rounded-lg` corners, and Level 1 elevation.
- Use `unit-6` internal padding to prevent content from feeling cramped.

### Input Fields
- Soft gray background (`gray-soft`) with a subtle 1px border that turns `mint-dark` on focus.
- Labels sit above the field in `label-md` navy text.

### Progress Indicators (Tutorial)
- Stepper component using `mint-dark` for completed steps and `mint-bright` (at 30% opacity) for upcoming steps. 
- Use large, clear numbers to maintain the "Klaras" (Clear) promise.

### Chips & Tags
- Used for transaction categories. Subtle background tints of the category color with semi-bold text. Always pill-shaped.