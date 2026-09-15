# RS Neuro Health Care Center — Design System

## Overview
A calm, modern, and professional healthcare design system developed for **RS Neuro Health Care Center**.
Adapted from the foundational visual tokens of `nomadkit-DESIGN.md`, this system translates Warm Sand, Ocean, and Forest palettes into an evidence-based, clinical, and reassuring environment that prioritizes patient accessibility, trust, and clarity.

---

## 1. Visual Direction & Principles

- **Trust & Professionalism**: Clean layout, uncluttered hierarchy, and clear typography suitable for an established neurological care center.
- **Calmness & Healing**: Warm off-white backgrounds (`#FFFDF7`) avoid sterile cold blues, creating a warm, humane, and welcoming atmosphere.
- **Accessible & High-Contrast**: Every piece of text strictly adheres to WCAG AA/AAA contrast guidelines. Color is never used as the sole indicator of meaning.
- **Subtle Depth**: Clean borders and soft elevation shadows replace excessive glassmorphism, aggressive gradients, or gamified visuals.
- **Performance First**: Zero bloated UI frameworks; lightweight, semantic, and fast loading.

---

## 2. Color Palette & Semantic Tokens

### Core Brand Colors
- **Primary Sand**: `#D4A373` (Primary brand accent, primary CTA background, focal highlights)
- **Secondary Ocean**: `#0891B2` (Secondary actions, interactive text links, neurological precision accent)
- **Tertiary Forest**: `#166534` (Positive health states, verified credentials, recovery milestones)

### Surfaces & Backgrounds
- **Background**: `#FFFDF7` (Warm off-white base canvas)
- **Surface Default**: `#FFFFFF` (Card surfaces, modals, elevated containers)
- **Surface Muted**: `#F7F4EC` (Alternate section backgrounds, badge backgrounds, subtle callouts)
- **Surface Elevated**: `#FFFFFF` with `--shadow-md`

### Typography Colors
- **Text Primary**: `#1A202C` (Deep charcoal slate for maximum legibility on headings and body)
- **Text Secondary**: `#4A5568` (Muted slate for descriptions, subtitles, and supporting metadata)
- **Text Muted**: `#718096` (Tertiary captions, timestamps, placeholder text)
- **Text Inverse**: `#FFFFFF` (High contrast text on dark or accent surfaces)

### Semantic & Feedback States
- **Success**: `#166534` (Bg tint: `#DCFCE7`, border: `#86EFAC`)
- **Warning**: `#CA8A04` (Bg tint: `#FEF9C3`, border: `#FDE047`)
- **Error**: `#DC2626` (Bg tint: `#FEE2E2`, border: `#FCA5A5`)
- **Info**: `#0891B2` (Bg tint: `#E0F2FE`, border: `#7DD3FC`)

### Borders
- **Border Default**: `#E5DFD5` (Soft warm border for cards and dividers)
- **Border Subtler**: `#EFEBE3` (Subtle container outlines)
- **Border Focus**: `#0891B2` (2px visible high-contrast focus ring)

---

## 3. Typography Hierarchy

- **Font Family**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (Crisp, universally accessible, zero network latency)
- **Headings**:
  - `Display`: `clamp(2.25rem, 4.5vw, 3.25rem)` / Weight: 700 / Line-height: 1.15
  - `H1`: `clamp(1.875rem, 3.5vw, 2.5rem)` / Weight: 700 / Line-height: 1.2
  - `H2`: `clamp(1.5rem, 2.8vw, 2rem)` / Weight: 600 / Line-height: 1.25
  - `H3`: `clamp(1.25rem, 2vw, 1.5rem)` / Weight: 600 / Line-height: 1.3
- **Body & Captions**:
  - `Body Large`: `1.125rem` (18px) / Weight: 400 / Line-height: 1.6
  - `Body Regular`: `1rem` (16px) / Weight: 400 / Line-height: 1.6
  - `Body Small`: `0.875rem` (14px) / Weight: 400 / Line-height: 1.5
  - `Caption`: `0.75rem` (12px) / Weight: 500 / Line-height: 1.4 / Letter-spacing: 0.05em
  - `Button Text`: `1rem` (16px) / Weight: 600 / Line-height: 1
  - `Nav Text`: `0.95rem` (15px) / Weight: 500 / Line-height: 1

---

## 4. Spacing Scale

Based on an 8-point harmonic grid with 4px half-steps:
- `--space-1`: 0.25rem (4px)
- `--space-2`: 0.5rem (8px)
- `--space-3`: 0.75rem (12px)
- `--space-4`: 1rem (16px)
- `--space-5`: 1.25rem (20px)
- `--space-6`: 1.5rem (24px)
- `--space-8`: 2rem (32px)
- `--space-10`: 2.5rem (40px)
- `--space-12`: 3rem (48px)
- `--space-16`: 4rem (64px)
- `--space-20`: 5rem (80px)

---

## 5. Responsive Breakpoints

- **Mobile**: 320px – 767px (Stacked layouts, touch-friendly min 44px targets, drawer navigation)
- **Tablet**: 768px – 1023px (2-column grids, compact horizontal navigation)
- **Desktop**: 1024px+ (Multi-column grids, full navigation, maximum content container 1200px)

---

## 6. Accessibility & Motion Guidelines

- **Focus Visibility**: `:focus-visible` with 2px solid Ocean (`#0891B2`) and 2px offset.
- **Skip Links**: Direct keyboard access to `#main-content`.
- **Motion Reduction**: All transitions respect `@media (prefers-reduced-motion: reduce)`.
- **Touch Targets**: Minimum 44px × 44px clickable area on all mobile buttons and links.
