# CHURCH ADMIN FRONTEND

# COLOR SPECIFICATION DOCUMENT

## Glassmorphism Design System

## Version 1.0

---

# DESIGN PHILOSOPHY

The Church Admin Frontend design system is based on:

* Modern Glassmorphism UI
* Soft spiritual visual aesthetics
* Calm immersive gradients
* Premium admin dashboard feel
* Clean readability
* Light + Dark adaptive system
* Frosted translucent surfaces
* Soft elevation hierarchy

The UI should feel:

* Peaceful
* Elegant
* Premium
* Modern
* Spacious
* Softly futuristic

---

# THEME ARCHITECTURE

The system supports:

```bash id="44c7y7"
1. Light Theme
2. Dark Theme
```

Both themes share:

* spacing system
* typography system
* border radius
* component sizing
* layout hierarchy

Only:

* colors
* shadows
* glass opacity
* gradients

change between themes.

---

# LIGHT MODE COLOR SYSTEM

## Theme Goal

Light mode should feel:

* clean
* airy
* peaceful
* soft
* elegant
* spiritual
* highly readable

---

# LIGHT MODE BASE COLORS

| Token           | Value     | Purpose                |
| --------------- | --------- | ---------------------- |
| Background Base | `#F4F7FF` | Main app background    |
| Primary Text    | `#2D3142` | Main readable text     |
| Secondary Text  | `#5C6170` | Subtext                |
| Muted Text      | `#8B90A0` | Disabled/inactive text |

---

# LIGHT MODE ACCENT COLORS

| Accent      | Value     | Usage             |
| ----------- | --------- | ----------------- |
| Soft Pink   | `#FAD0C4` | Gradient blobs    |
| Soft Purple | `#E0C3FC` | Brand gradients   |
| Soft Cyan   | `#D4F0F0` | Accent highlights |

---

# LIGHT MODE GLASS CARD

```css id="o3y4k9"
background: rgba(255, 255, 255, 0.45);

backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);

border: 1px solid rgba(255, 255, 255, 0.8);

box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

color: #2D3142;
```

---

# LIGHT MODE SURFACE COLORS

| Surface            | Value                    |
| ------------------ | ------------------------ |
| Card Background    | `rgba(255,255,255,0.45)` |
| Navbar Background  | `rgba(255,255,255,0.35)` |
| Sidebar Background | `rgba(255,255,255,0.28)` |
| Modal Background   | `rgba(255,255,255,0.55)` |

---

# LIGHT MODE BORDERS

| Border Type  | Value                   |
| ------------ | ----------------------- |
| Glass Border | `rgba(255,255,255,0.8)` |
| Soft Border  | `rgba(220,225,240,0.7)` |
| Input Border | `rgba(210,215,230,0.9)` |

---

# LIGHT MODE SHADOWS

| Shadow | Value                              |
| ------ | ---------------------------------- |
| Small  | `0 4px 12px rgba(31,38,135,0.05)`  |
| Medium | `0 8px 24px rgba(31,38,135,0.08)`  |
| Large  | `0 12px 40px rgba(31,38,135,0.12)` |

---

# LIGHT MODE GRADIENTS

## Primary Gradient

```css id="rj8r7s"
linear-gradient(
  135deg,
  #FAD0C4 0%,
  #E0C3FC 50%,
  #D4F0F0 100%
)
```

---

## Card Glow Gradient

```css id="4m4d8u"
linear-gradient(
  135deg,
  rgba(250,208,196,0.18),
  rgba(224,195,252,0.12)
)
```

---

# DARK MODE COLOR SYSTEM

## Theme Goal

Dark mode should feel:

* cinematic
* immersive
* premium
* futuristic
* spiritual
* vibrant
* atmospheric

---

# DARK MODE BASE COLORS

| Token               | Value     | Purpose              |
| ------------------- | --------- | -------------------- |
| Background Base     | `#0A0E29` | Main dark background |
| Elevated Background | `#11162F` | Secondary surface    |
| Primary Text        | `#FFFFFF` | Main readable text   |
| Secondary Text      | `#B9C0D4` | Secondary text       |
| Muted Text          | `#7E879E` | Disabled text        |

---

# DARK MODE ACCENT COLORS

| Accent         | Value     | Usage              |
| -------------- | --------- | ------------------ |
| Vibrant Purple | `#7B2CBF` | Main accent        |
| Electric Blue  | `#0077B6` | Interactive accent |
| Neon Magenta   | `#C77DFF` | Glow highlight     |

---

# DARK MODE GLASS CARD

```css id="lspz2m"
background: rgba(255, 255, 255, 0.05);

backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);

border: 1px solid rgba(255, 255, 255, 0.15);

box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

color: #FFFFFF;
```

---

# DARK MODE SURFACE COLORS

| Surface            | Value                    |
| ------------------ | ------------------------ |
| Card Background    | `rgba(255,255,255,0.05)` |
| Navbar Background  | `rgba(10,14,41,0.55)`    |
| Sidebar Background | `rgba(10,14,41,0.72)`    |
| Modal Background   | `rgba(15,20,45,0.82)`    |

---

# DARK MODE BORDERS

| Border Type  | Value                    |
| ------------ | ------------------------ |
| Glass Border | `rgba(255,255,255,0.15)` |
| Soft Border  | `rgba(255,255,255,0.08)` |
| Input Border | `rgba(255,255,255,0.18)` |

---

# DARK MODE SHADOWS

| Shadow      | Value                            |
| ----------- | -------------------------------- |
| Small       | `0 4px 12px rgba(0,0,0,0.18)`    |
| Medium      | `0 8px 24px rgba(0,0,0,0.28)`    |
| Large       | `0 12px 40px rgba(0,0,0,0.45)`   |
| Purple Glow | `0 0 24px rgba(123,44,191,0.28)` |
| Blue Glow   | `0 0 24px rgba(0,119,182,0.18)`  |

---

# DARK MODE GRADIENTS

## Primary Gradient

```css id="x7uk2u"
linear-gradient(
  135deg,
  #7B2CBF 0%,
  #C77DFF 50%,
  #0077B6 100%
)
```

---

## Glass Glow Gradient

```css id="f8mfqf"
linear-gradient(
  135deg,
  rgba(123,44,191,0.22),
  rgba(199,125,255,0.12)
)
```

---

# STATUS COLORS

## SUCCESS

| Theme | Value     |
| ----- | --------- |
| Light | `#2E9E5B` |
| Dark  | `#4ADE80` |

---

## ERROR

| Theme | Value     |
| ----- | --------- |
| Light | `#DC2626` |
| Dark  | `#F87171` |

---

## WARNING

| Theme | Value     |
| ----- | --------- |
| Light | `#F59E0B` |
| Dark  | `#FBBF24` |

---

## INFO

| Theme | Value     |
| ----- | --------- |
| Light | `#2563EB` |
| Dark  | `#60A5FA` |

---

# BUTTON COLOR SYSTEM

## Primary Button

### Light

```css id="sjzjrl"
background: linear-gradient(
  135deg,
  #FAD0C4,
  #E0C3FC
);

color: #2D3142;
```

---

### Dark

```css id="i0cvj2"
background: linear-gradient(
  135deg,
  #7B2CBF,
  #C77DFF
);

color: #FFFFFF;
```

---

# INPUT FIELD SYSTEM

## Light Inputs

```css id="zq1kji"
background: rgba(255,255,255,0.55);

border: 1px solid rgba(255,255,255,0.8);

color: #2D3142;
```

---

## Dark Inputs

```css id="fx1l7j"
background: rgba(255,255,255,0.06);

border: 1px solid rgba(255,255,255,0.15);

color: #FFFFFF;
```

---

# SIDEBAR COLOR SYSTEM

## Light Sidebar

```css id="8vpryv"
background: rgba(255,255,255,0.28);

backdrop-filter: blur(18px);
```

---

## Dark Sidebar

```css id="yn3e0u"
background: rgba(10,14,41,0.72);

backdrop-filter: blur(20px);
```

---

# NAVBAR COLOR SYSTEM

## Light Navbar

```css id="tqprjz"
background: rgba(255,255,255,0.35);
```

---

## Dark Navbar

```css id="0rjcc1"
background: rgba(10,14,41,0.55);
```

---

# TYPOGRAPHY SYSTEM

## Font Family

```css id="u61j5m"
font-family:
  Inter,
  SF Pro Display,
  Segoe UI,
  sans-serif;
```

---

# BORDER RADIUS SYSTEM

| Token | Value  |
| ----- | ------ |
| sm    | `8px`  |
| md    | `12px` |
| lg    | `16px` |
| xl    | `20px` |
| 2xl   | `24px` |

---

# SPACING SYSTEM

| Token | Value  |
| ----- | ------ |
| xs    | `4px`  |
| sm    | `8px`  |
| md    | `16px` |
| lg    | `24px` |
| xl    | `32px` |
| 2xl   | `48px` |

---

# ANIMATION PRINCIPLES

Animations should be:

* soft
* smooth
* premium
* subtle
* non-aggressive

---

# RECOMMENDED TRANSITIONS

```css id="8du0nc"
transition:
  all 0.3s ease;
```

---

# GLASSMORPHISM RULES

Always maintain:

* subtle transparency
* readable text
* soft borders
* blur depth hierarchy
* clean spacing

Never:

* overblur
* oversaturate
* use harsh neon
* reduce readability

---

# FINAL DESIGN DIRECTION

The Church Admin Frontend should visually feel like:

* a premium SaaS admin dashboard
* mixed with spiritual calmness
* modern glassmorphism
* cinematic gradients
* peaceful lighting
* elegant minimalism
* immersive UI depth

This creates:

* strong visual identity
* memorable branding
* modern UX
* premium feel
* scalable design system
