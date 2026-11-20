---
name: Academic Intelligence Interface
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#571ac0'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f3dd9'
  on-tertiary-container: '#e3d5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies modern edtech: analytical, structured, and friction-free, yet encouraging and accessible. Designed specifically for university students navigating intensive curricula, it merges the clean structural modularity of Notion, the razor-sharp execution and micro-focus of Linear, and the motivating milestone feedback of Duolingo, wrapped in the neutral precision of modern component architectures.

### Visual Pillars
- **Cognitive Clarity:** Dense academic materials (syllabi, slides, flashcards, mock quizzes) are parsed into scannable visual chunks. Whitespace is active and deliberate.
- **Intelligent Elevation:** Subtle tonal layers, precision hairline borders, and translucent backdrops replace heavy decorative artifacts.
- **Purposeful Micro-Delight:** Academic rigor is balanced by tactile progress bars, crisp state feedback, and intelligent status badges that reward completion without infantilizing the learner.
- **Tactile Utility:** Form components and quiz cards feature distinct interactive affordances, high-contrast focus rings, and crisp optical alignments.

## Colors

The palette establishes an intellectual, high-focus environment with high semantic contrast.

### Palette Hierarchy & Intent
- **Primary Indigo (`#4F46E5` / `#6366F1`):** Represents cognition and system intelligence. Anchors key interactive moments: AI quiz generation prompts, primary action triggers, and active navigation states.
- **Secondary Cyan (`#06B6D4`):** Accents dynamic AI operations, live parsing tags, citation tags, and real-time processing indicators.
- **Tertiary Electric Violet (`#8B5CF6`):** Dedicated to mastery metrics, personalized streak counters, and AI synthesis callouts.
- **Deep Slate Ground (`#0F172A` / `#1E293B`):** Anchors high-priority typography, high-contrast sidebars, and structural headers.
- **Surface Canvas (`#F8FAFC` base, `#FFFFFF` container):** Ensures high-legibility document reading, zero visual fatigue during prolonged study sessions, and effortless card separation.
- **Functional Semantics:**
  - **Success Emerald (`#10B981`):** Correct answers, mastered topics, completed quiz decks.
  - **Warning Amber (`#F59E0B`):** Review required, mid-tier confidence ratings, approaching deadlines.
  - **Danger Rose (`#F43F5E`):** Incorrect options, critical exam countdowns, missed checkpoints.

## Typography

The type system pairs structural display geometry with uncompromising Vietnamese diacritic rendering.

- **Display & Headings (Plus Jakarta Sans):** Chosen for its contemporary geometric balance, open counters, and high readability in dense digital dashboards. It provides energy and academic confidence.
- **Body & Labels (Be Vietnam Pro):** Engineered specifically for native Vietnamese typographical nuances, preventing accent mark clipping, uneven vertical baselines, and irregular tone mark collisions across all platforms.
- **Formulas & Technical Excerpts (JetBrains Mono):** Reserved for technical snippets, formula annotations, and parsed question metadata identifiers.

## Layout & Spacing

The layout operates on a disciplined 4px/8px incremental grid designed to handle both wide-screen multi-pane workspaces (e.g., PDF Reader on the left, AI Flashcards on the right) and single-column mobile study sessions.

### Grid & Breakpoints
- **Desktop (1280px+):** 12-column fluid grid with standard 24px (`1.5rem`) gutters and responsive outer canvas margins of 32px (`2rem`). Supports persistent left-hand course navigation (260px fixed) and context-aware right-hand AI sidebars (360px fixed).
- **Tablet (768px - 1279px):** 8-column layout. Document review and quiz cards transition to stacked vertical flow; supplementary sidebars collapse into overlay slide-overs.
- **Mobile (< 768px):** 4-column layout with 16px (`1rem`) outer margins and gutters. Quiz answer options expand to full container width for optimal thumb touch-targets (minimum 48px height).

### Spacing Hygiene
- Internal component padding strictly adheres to token steps (`space-sm` for compact tags, `space-md` for inputs and list items, `space-lg` for study card interiors).
- Large macro distances (`space-xl` and above) are reserved exclusively for section boundaries and content transitions.

## Elevation & Depth

Visual hierarchy is constructed using crisp borders, subtle directional shifts in luminance, and ambient color-tinted shadows, rather than deep blurred drops.

- **Level 0 (Flat Canvas):** `#F8FAFC`. Background bedrock across standard reading interfaces.
- **Level 1 (Card & Content Surface):** `#FFFFFF` layered with a structural hairline border (`1px solid #E2E8F0`). Enhanced with an ambient drop: `0px 1px 3px rgba(15, 23, 42, 0.04), 0px 1px 2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active Cards & Hover Surfaces):** Active question states, draggable deck items, and flyout dropdowns. Hairline border shifts to `#CBD5E1`. Shadow: `0px 4px 6px -1px rgba(15, 23, 42, 0.06), 0px 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Overlays & Sticky Navbars):** Semi-opaque `#FFFFFF` at 85% opacity with `backdrop-filter: blur(12px)`. Deep ambient shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.08), 0px 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Level Active / Selection Glow:** Interactive elements focused or highlighted by AI generation display an inner ring or subtle external glow using `rgba(79, 70, 229, 0.15)`.

## Shapes

The geometry strikes a deliberate chord between the soft playfulness of gamified study and the structured precision of developer-grade applications.

- **Containers & Major Panels:** Implement `rounded-xl` (1.5rem / 24px) to present an inviting, modern workspace envelope without feeling toy-like.
- **Interactive Controls (Inputs, Buttons, List Rows):** Standardized on `rounded-md` (0.5rem / 8px) to maintain rigorous alignment with tabular data and text baselines.
- **Badges, Tags & Mastery Indicators:** Fully rounded pill forms (`rounded-full`) to cleanly segregate metadata chips from structural content blocks.

## Components

### Buttons
- **Primary:** Solid `#4F46E5` fill, `#FFFFFF` text, `rounded-lg` (8px), 10px 16px padding. Subtle inner-top highlight (`inset 0 1px 0 rgba(255,255,255,0.15)`), active scale-down (`0.98`).
- **Secondary / Ghost:** Transparent surface, `1px solid #E2E8F0`, `#0F172A` text. On hover: `#F1F5F9` background, `#4F46E5` border tint.
- **AI Action Variant:** Gradient fill from `#4F46E5` to `#8B5CF6`, `#FFFFFF` label with secondary Cyan sparkle icon, dynamic focus ring `0 0 0 2px #06B6D4`.

### Quiz Cards & Answer Selectors
- **Default State:** `#FFFFFF` background, `1px solid #E2E8F0`, `rounded-xl` (16px), 16px internal padding. Includes clear alphanumeric indicator (A, B, C, D) housed in a `rounded-md` `#F1F5F9` sub-box.
- **Selected State:** Border color shifts to `#4F46E5` (`2px solid`), surface tint `#EEF2FF`.
- **Correct State:** Border `#10B981` (`2px solid`), surface `#ECFDF5`, label `#065F46`.
- **Incorrect State:** Border `#F43F5E` (`2px solid`), surface `#FFF1F2`, label `#9F1239`.

### Chips & Badges
- **Chapter / Topic Chips:** `#F1F5F9` neutral fill, `#334155` text, `rounded-full`, 4px 10px padding, typography `label-sm`.
- **Difficulty Badges:**
  - *Easy:* `#ECFDF5` background, `#059669` text, dot prefix `#10B981`.
  - *Medium:* `#FEF3C7` background, `#D97706` text, dot prefix `#F59E0B`.
  - *Hard:* `#FFE4E6` background, `#E11D48` text, dot prefix `#F43F5E`.

### Progress Bars
- **Container:** Height of 8px or 12px, background `#E2E8F0`, `rounded-full`, overflow-hidden.
- **Fill Track:** Smooth easing transition (`cubic-bezier(0.4, 0, 0.2, 1)`), linear gradient from `#4F46E5` to `#06B6D4`. Streak metrics transition to `#8B5CF6`.

### Input & Document Uploader
- **Text & Prompt Fields:** Surface `#FFFFFF`, border `1px solid #CBD5E1`, `rounded-lg` (8px), padding 10px 14px. Focus state: border `#4F46E5`, outline `3px solid rgba(79, 70, 229, 0.15)`.
- **File Parsing Dropzone:** Dashed border (`2px dashed #CBD5E1`), background `#F8FAFC`, icon container with `#EEF2FF` fill and `#4F46E5` icon stroke. Drag-over state shifts border to `#4F46E5` and background to `#F5F3FF`.

### Lists & Flashcard Accordions
- Clean row separation using `border-b border-[#F1F5F9]` without full enclosing boundaries. Hover triggers a subtle `#F8FAFC` background bleed with a 2px left border accent in `#4F46E5`.