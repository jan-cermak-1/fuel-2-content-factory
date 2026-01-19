---
name: Fuel 2.0 Prototype Plan
overview: Kompletní plán pro vytvoření high-fidelity React prototypu Fuel 2.0 - AI-native Content Factory pro správu objectives, tactics, best practices a steps s many-to-many vztahy, AI generováním a usage analytikou.
todos:
  - id: setup
    content: "Inicializace projektu: Vite + React + Tailwind + Framer Motion + dnd-kit"
    status: pending
  - id: seed-data
    content: Vytvoření seed dat s many-to-many vztahy a usage metrikami
    status: pending
  - id: layout
    content: "Layout: Sidebar, Header, SubHeader s tabs a view toggle"
    status: pending
  - id: table-view
    content: "Table View: hierarchická tabulka s 4 úrovněmi, expand/collapse"
    status: pending
  - id: workshop-view
    content: "Workshop View: Kanban s drag & drop mezi statusy"
    status: pending
  - id: detail-panel
    content: "Detail Panel: editor, targeting, quality audit, activity log"
    status: pending
  - id: ai-panel
    content: "AI Generation Panel: konfigurace, Grok simulace, výsledky"
    status: pending
  - id: analytics
    content: "Analytics Dashboard: metriky, gap analysis, predictions"
    status: pending
  - id: filters
    content: "Advanced Filters: multi-select, saved views, search"
    status: pending
  - id: polish
    content: Animace, přechody, responsivita, finální polish
    status: pending
---

# Fuel 2.0 - Plán prototypu

## 1. Co je Fuel 2.0

**Fuel 2.0** je sekce v interním nástroji Butler pro tvorbu a správu human-curated AI training content. Vytváříme zde objectives, tactics, best practices a steps, které zákazníci Emplifi používají v app.emplifi.io.

**Klíčová hodnota:** AI generuje obsah rychle (včetně variant), lidé kontrolují kvalitu a schvalují. Výsledkem je škálovatelná knihovna kurátorovaného obsahu.

---

## 2. Uživatelé

- **Elizabeth Choos** - primární persona (Content Manager)
- **5 uživatelů dnes → 30 v budoucnu**
- **Role:** Admin, Editor, Reviewer, Viewer

---

## 3. Datová struktura

### Hierarchie (4 úrovně):

```
Objective (cíl zákazníka)
  └─ Tactic (jak dosáhnout cíle, max ~10 per objective)
      └─ Best Practice (osvědčené postupy)
          └─ Step (konkrétní kroky)
```

### Many-to-Many vztahy:

- 1 Tactic může být ve více Objectives
- 1 Best Practice může být ve více Tactics
- 1 Step může být ve více Best Practices

### Targeting (pro všechny úrovně):

- **Industry:** Finance, Retail, Healthcare, Tech...
- **Region:** EMEA, NA, APAC
- **Job Role:** CMO, Social Media Manager, Analyst...
- **Account:** Nike, Ford, "All"

### Atributy:

- Name, Description
- Status (Draft, In Review, Approved, Released)
- Quality Score (0-100, AI-generated)
- Usage data (z app.emplifi.io)
- Metric (pouze Objective)
- Owner, Last edited

---

## 4. Hlavní funkce prototypu

### 4.1 Unified Hierarchical View

- Tabulka s 4-level hloubkou (expand/collapse)
- Many-to-many indikátory ("Used in 3 objectives")
- Targeting pills (Industry, Region, Job Role, Account)
- Inline editing
- Status dropdown s approval workflow

### 4.2 AI Generation (Grok)

- **[Generate]** button na každém objektu
- Konfigurace: počet, targeting varianty, custom prompt
- AI vytvoří položky ve stavu Draft
- Automatický Quality Score
- Human review a schválení

### 4.3 Workshop/Kanban View

- Přepínání mezi Table View a Kanban
- Sloupce: Draft → In Review → Approved → Released
- Drag & drop mezi sloupci
- Karty s náhledem obsahu

### 4.4 Shared Components

- Pohled na reusable best practices a steps
- "Used in X" indikátor
- Global edit vs Create variant

### 4.5 Analytics Dashboard

- Metriky: Total objectives/tactics, Quality scores, Completion rates
- Usage data z app.emplifi.io
- Gap analysis (AI-powered)
- Predictive insights

### 4.6 Detail Sidepanel

- Otevře se kliknutím na řádek
- Editor obsahu
- Targeting konfigurace
- Quality Audit
- AI akce (Generate, Variants)
- Activity log

### 4.7 Advanced Filters

- Filtrování podle typu, statusu, targeting
- Natural language search
- Saved views

---

## 5. Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** - styling
- **Framer Motion** - animace
- **@dnd-kit** - drag & drop
- **Lucide React** - ikony
- **date-fns** - formátování dat

---

## 6. Struktura souborů

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── SubHeader.jsx
│   │   └── AppLayout.jsx
│   ├── table-view/
│   │   ├── TableView.jsx
│   │   ├── HierarchyRow.jsx
│   │   ├── InlineEditor.jsx
│   │   ├── StatusDropdown.jsx
│   │   ├── TargetingPills.jsx
│   │   ├── QualityScore.jsx
│   │   └── UsedInBadge.jsx
│   ├── workshop-view/
│   │   ├── WorkshopView.jsx
│   │   ├── KanbanColumn.jsx
│   │   └── ContentCard.jsx
│   ├── shared-components/
│   │   └── SharedComponentsView.jsx
│   ├── analytics/
│   │   ├── AnalyticsView.jsx
│   │   ├── MetricsGrid.jsx
│   │   └── GapAnalysis.jsx
│   ├── panels/
│   │   ├── DetailPanel.jsx
│   │   ├── AIGenerationPanel.jsx
│   │   └── FilterPanel.jsx
│   └── common/
│       ├── SearchBar.jsx
│       ├── Badge.jsx
│       └── Modal.jsx
├── data/
│   ├── seedData.js
│   └── mockUsageData.js
├── context/
│   └── FuelContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 7. Seed Data

### Objectives (5):

1. Increase Brand Awareness
2. Drive Website Traffic
3. Improve Customer Engagement
4. Generate Leads
5. Crisis Communication Readiness

### Per Objective:

- 3-5 Tactics
- Per Tactic: 2-3 Best Practices
- Per Best Practice: 2-4 Steps

### Many-to-Many příklady:

- "Social Listening" best practice ve 4 různých tactics
- "Content Calendar Setup" step v 6 různých best practices

### Targeting coverage:

- Industries: Finance, Retail, Healthcare, Tech
- Regions: EMEA, NA, APAC
- Job Roles: CMO, Social Media Manager, Analyst
- Accounts: Nike, Ford, Adidas, Generic

### Usage data (mock):

- Adoption counts (20-300 accounts)
- Completion rates (40-95%)
- Trend data (7 dní)

---

## 8. Implementační kroky

1. **Setup projektu** - Vite, React, Tailwind, dependencies
2. **Seed data** - Kompletní hierarchie s many-to-many
3. **Layout** - Sidebar, Header, SubHeader, hlavní area
4. **Table View** - Hierarchická tabulka s expand/collapse
5. **Workshop View** - Kanban s drag & drop
6. **Detail Panel** - Editor, targeting, quality audit
7. **AI Panel** - Generování s Grok simulací
8. **Analytics** - Dashboard s metrikami
9. **Filters** - Advanced filtering a search
10. **Polish** - Animace, přechody, finální úpravy

---

## 9. Vizuální směr

- **Profesionální, čistý design** - vhodný pro interní nástroj
- **Light theme** jako základ
- **Barevné akcenty** pro AI funkce (teal/cyan)
- **Status barvy:** Zelená (Released), Modrá (Approved), Žlutá (In Review), Šedá (Draft)
- **Moderní typografie** - čitelnost pro práci s velkým množstvím dat

---

## 10. Klíčové UX principy

- **Everything in one view** - žádné přepínání mezi Excely
- **AI je kopilot** - vždy dostupné, nikdy nucené
- **Lidé schvalují** - AI generuje, člověk má kontrolu
- **Data-driven** - usage data přímo v UI
- **Many-to-many aware** - jasně viditelné sdílené komponenty