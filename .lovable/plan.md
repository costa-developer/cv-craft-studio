
# CVCraft — Professional CV Builder SaaS

A modern, premium CV builder web app with a calm green-toned design system, built with React + Vite + Tailwind + ShadCN, powered by Lovable Cloud for backend.

---

## Phase 1: Foundation & Design System

**Custom Color Palette & Theme**
- `#FFFDF6` → Main background
- `#FAF6E9` → Card/section backgrounds
- `#DDEB9D` → Hover states, soft highlights
- `#A0C878` → Primary accent (buttons, links, active states)
- Clean, whitespace-heavy typography with soft shadows and rounded-xl cards
- Subtle animations using Framer Motion throughout

**Core Layout**
- Responsive SaaS shell: top navbar with logo, navigation, user menu
- Landing/marketing page with hero, feature highlights, pricing section, and CTA

---

## Phase 2: Authentication & User Dashboard

**Authentication (Lovable Cloud)**
- Email/password signup & login
- User profiles table for display name, avatar, subscription status
- Protected routes for dashboard, editor, and admin

**User Dashboard**
- Grid of CV cards showing title, last edited, template used
- Actions per CV: Edit, Duplicate, Delete, Download PDF, Export DOCX, Share public link
- "Create New CV" button prominently placed
- Dashboard styled with the custom palette: `#FAF6E9` cards on `#FFFDF6` background, `#A0C878` buttons

---

## Phase 3: CV Editor — Live Split Layout

**Left Panel (Editor Form)**
Sections (all repeatable/reorderable via drag & drop):
- Personal Info (name, title, location, phone, email, photo upload)
- Professional Summary
- Skills (tag-style input)
- Work Experience (repeatable blocks with company, role, dates, bullet points)
- Featured Projects (repeatable)
- Education (repeatable)
- Certifications
- Links (portfolio, social media)
- Languages

Features:
- Toggle section visibility on/off
- Drag & drop to reorder sections
- Real-time autosave to database
- AI Summary Generator — auto-generate a professional summary from work history
- AI Bullet Point Improver — enhance individual bullet points
- Resume Strength Score — live score based on completeness, keyword density, and structure

**Right Panel (Live Preview)**
- Instant preview updates as user types
- Realistic A4 page rendering with proper margins
- Template switcher dropdown — switch between all 5 templates without losing content
- Accent color picker (default `#A0C878`)
- Print-ready white page layout

---

## Phase 4: Five ATS-Friendly CV Templates

All templates share: clean typography, consistent spacing, accent color customization, A4 & US Letter support.

1. **Modern Minimal** — Single-column, generous whitespace, modern sans-serif typography
2. **Corporate Executive** — Traditional two-column header, formal structure, suited for senior roles
3. **Tech Professional** — Inspired by the uploaded CV: two-column layout with left sidebar (photo, details, skills, languages) and main content area (profile, employment history, projects, education), with decorative section icons
4. **Creative Clean** — Asymmetric layout with subtle color blocks, creative section separators
5. **Compact Professional** — Dense single-column layout optimized for fitting maximum content on one page

---

## Phase 5: Export & Sharing

**Server-Side PDF Export (Edge Function)**
- Edge function that renders CV HTML to high-quality PDF
- Supports A4 and US Letter sizes
- Watermark overlay for free-plan users

**DOCX Export (Edge Function)**
- Edge function generating structured DOCX files from CV data

**Public Sharing**
- Generate a unique public URL per CV
- Read-only rendered view of the CV at that URL
- Toggle sharing on/off from dashboard

---

## Phase 6: AI Features (Lovable AI)

Powered by Lovable AI Gateway via edge functions:

- **AI Summary Generator** — Takes work experience and skills, generates a polished professional summary
- **AI Bullet Point Improver** — Rewrites individual bullet points to be more impactful with action verbs and metrics
- **Resume Strength Score** — Analyzes CV completeness, keyword usage, formatting, and provides improvement suggestions

AI features locked behind Pro plan.

---

## Phase 7: Stripe Subscription & Monetization

**Free Plan:**
- 1 CV limit
- Watermark on PDF downloads
- Basic templates only (1-2)
- No AI features

**Pro Plan:**
- Unlimited CVs
- No watermark
- All 5 templates unlocked
- AI features (summary generator, bullet improver, strength score)
- Stripe subscription with billing portal

---

## Phase 8: Admin Panel

Protected admin-only section:
- View all registered users and their subscription status
- View active Stripe subscriptions
- Manage templates (enable/disable)
- Toggle feature flags (AI features, sharing, export formats)
- Simple table-based UI with the same design system
