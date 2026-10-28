# Sock Pilling Resolution System (FSD Implementation)

A comprehensive, production-grade implementation of the Functional Specification Document (FSD) for textile sock pilling lifecycle management, uniting customer transparency, computer vision grading, automated dispute resolution, supply chain MES root-cause traceability, and executive BI monitoring.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed through Phase 1 user alignment:

- **Navigation & Experience Structure**: An all-in-one portal with instant role-switching tabs (Customer Storefront, AI Customer Service, QA & Supply Chain MES Traceability, and BI Operations Executive Dashboard) along with guided end-to-end interactive flows.
- **Visual Style & Brand Aesthetic**: Minimalist apparel style with warm neutral tones (oatmeal canvas `#FAF8F5`, textured ecru surfaces, deep slate typography, terracotta primary accent) and soft badges adhering strictly to zero-pill typographic discipline.
- **AI Inspection & Customer Service Input**: Real user photo upload powered by Gemini 3.8 Flash multimodal vision analysis, supplemented by curated high-resolution textile sample presets across Grades 1 through 5.

---

## 1. Overview & Core Concept

### What It Does
This system translates the complete 4-module functional specification for hosiery pilling management into an interactive full-stack web application:
1. **Module 1 (Customer Front-end & Education)**: Dynamic Martindale abrasion ratings, scenario footwear compatibility checker, and interactive mobile-view care card with QR generation.
2. **Module 2 (AI Customer Service & Automated After-Sales)**: Multimodal Gemini vision grading (1.0–5.0 pilling scale), textile physics-grounded empathy reply generator, and instant $50 voucher auto-issuance with CRM ticket resolution.
3. **Module 3 (AI AOI & Supply Chain MES Traceability)**: Factory inline surface scanning, complaints-to-yarn batch & knitting machine tension correlation engine, and automated >3% complaint threshold inventory quarantine.
4. **Module 4 (Analytics Dashboard & Social Listening)**: Cross-platform NLP sentiment and keyword monitoring ("起毛", "毛球"), coupled with RMA dispute rate, AHT, and resolution ROI financial dashboards with CSV export.

### Target Personas
- **Consumer / Shopper**: Seeks transparent fabric durability info, shoe styling compatibility, and seamless warranty claim without return friction.
- **Customer Service Agent / Lead**: Requires instant automated photographic triage, textile scientific rationale, and automated coupon generation.
- **Plant Manager & Quality Assurance Engineer**: Investigates yarn lot defects, circular knitting machine tension drift, and initiates lot containment.
- **Operations & Brand Director**: Evaluates return costs, customer retention after compensation, and market sentiment trends.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Top Bar: Brand Wordmark & Mode Switcher              │
│   [Storefront Experience] [AI Customer Service] [QA Traceability] [BI] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
[Module 1: Storefront]    [Module 2: AI CS & Claim]   [Module 3: MES Trace]
- Martindale Test Bar     - Photo Upload or Preset    - AOI Scan Visualizer
- Shoe Pairing Matrix     - Gemini 1-5 Scale Rating   - Batch/Tension Linkage
- Interactive Care Card   - Empathetic Physics Script - Auto WMS Quarantine
                          - Auto $50 Voucher Code
```

1. **Storefront & Education Flow**:
   - User browses sock models (e.g., Merino Wool Hiker, Combed Cotton Crew, Mercerized Dress Sock).
   - Dynamic Martindale slider shows lab test revolutions (e.g. 20,000 cycles) and pilling grade rating with visual comparison.
   - Shoe matching selector tests pairings (Running shoes vs. Rough leather workboots), presenting suitability alerts (e.g., "High internal friction warning").
   - Click "Digital Care Guide" opens a phone mockup with 15-second laundry guide (turn inside out, mesh bag, air dry) and downloadable QR code.

2. **AI Customer Service & Claim Flow**:
   - Customer submits a complaint ticket: selects purchase order, uploads or picks a sock photo.
   - Multimodal Gemini Vision analyzes the image, identifies pilling density, affected area (heel, ball of foot), and outputs a rating (1.0–5.0) with confidence percentage.
   - If Grade $\le 3.0$ (noticeable or severe pilling) and within 30-day warranty:
     - Generates empathetic customer reply detailing the physics of short-staple fiber migration.
     - Automatically generates a unique `$50` promotional discount code (`PILL-FREE-XXXXX`).
     - Closes the claim ticket with zero-return hassle, logging the claim directly into the MES traceability queue.

3. **QA Inspection & Traceability Flow**:
   - Industrial AOI inspector visualizer simulates live factory roll scanning with defect bounding boxes.
   - Complaint lookup engine cross-references the customer ticket with SKU, production date, Yarn Batch ID (e.g., `YB-2026-088`), Knitting Machine Number (`KM-04`), and Cylinder Tension settings (`4.2 N`).
   - When complaint rate exceeds 3.0%, the system flags a high-priority "Automated Inventory Freeze Alert" to prevent shipping remaining warehouse inventory.

4. **BI & Social Listening Flow**:
   - Real-time sentiment gauge scanning Shopee, Dcard, Facebook, and brand website reviews.
   - Pilling keyword frequency cloud and sentiment polarization chart.
   - Financial impact cards: RMA replacement savings, Average Handling Time reduction (from 48h to 3 seconds), and Customer Repurchase Retention Rate (+22%).
   - Export full compliance and complaint audit report as CSV.

### Visual Identity & Theme
- **Aesthetic Direction**: Minimalist Japanese/Nordic lifestyle apparel aesthetic with clean structural whitespace, refined typography, and soft warm surfaces.
- **Palette Tokens**:
  - Background Canvas: Warm Oatmeal `#FAF8F5`
  - Container Surfaces: Warm Ecru White `#FFFFFF` with hairline borders `#E7E1D8`
  - Primary Text: Deep Charcoal Graphite `#262422`
  - Muted Metadata: Warm Stone `#78716C`
  - Accent / Primary Action: Terracotta Ochre `#C86D51` / `#B45339`
  - Quality Pass / Healthy: Soft Loden Sage `#4D7C5F`
  - Warning / Quarantine: Deep Amber `#C2671A`
- **Typographic Discipline**:
  - Clean display headlines with `text-wrap: balance` and zero orphan words.
  - Numbers, batch IDs, tension values, and test cycles formatted with `tabular-nums` and clean font-mono styling.
  - Zero-pill rule strictly enforced: statuses and metadata styled as unboxed inline prose with `·` separators.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Server with Gemini 3.8 Flash**
  - *Chosen Approach*: Implement server-side proxy routes (`/api/inspect-pilling`, `/api/generate-reply`, `/api/mes-trace`) in `server.ts` utilizing `@google/genai` with `gemini-3.8-flash`. Include realistic local fallback models if API keys are absent or network requests time out.
  - *Why*: Adheres to AI Studio server-side security guidelines, guarantees sub-3s response time for image analysis, and provides authentic AI-driven pilling scoring.
  - *Alternatives Considered*: Pure client-side simulation (lacks genuine AI vision capability) vs heavy external CV server (unnecessary complexity).

- **Decision 2: Unified Multi-Perspective Navigation**
  - *Chosen Approach*: A clean top-level role switcher allowing evaluators to jump between Consumer View, CS Ticket Desk, Factory MES Traceability, and BI Operations.
  - *Why*: Fulfills the requirement for an all-in-one portal while making every individual FSD module (FE-01~03, CS-01~03, QA-01~03, BI-01~02) directly testable.
  - *Alternatives Considered*: Isolated standalone pages requiring multiple browser tabs.

- **Decision 3: Integrated Traceability Data Bus**
  - *Chosen Approach*: Unified in-memory and reactive state store where an action taken in Module 2 (filing an AI complaint) immediately updates Module 3 (MES batch complaint counts) and Module 4 (BI dispute rate and compensation costs).
  - *Why*: Demonstrates the real-time cross-module integration emphasized in the FSD.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Vite React Client (Port 3000)                   │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Role Switcher · Live Status)         │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐                  │
│  │ Module 1: Storefront  │  │ Module 2: AI CS Claim │                  │
│  │ - Martindale Ratings  │  │ - Photo & Presets     │                  │
│  │ - Shoe Fitting Matrix │  │ - Gemini CV Grader    │                  │
│  │ - Care Card & QR Web  │  │ - $50 Auto-Voucher    │                  │
│  └───────────────────────┘  └───────────────────────┘                  │
│  ┌───────────────────────┐  ┌───────────────────────┐                  │
│  │ Module 3: MES Trace   │  │ Module 4: BI Analytics│                  │
│  │ - AOI Line Inspector  │  │ - NLP Social Monitor  │                  │
│  │ - Batch Root-Cause    │  │ - RMA / ROI Dashboards│                  │
│  │ - WMS Quarantine Alert│  │ - CSV Audit Export    │                  │
│  └───────────────────────┘  └───────────────────────┘                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (/api/*)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Express Node Server (server.ts)                       │
├────────────────────────────────────────────────────────────────────────┤
│  - POST /api/inspect-pilling      -> Gemini 3.8 Flash Vision (1-5 scale)│
│  - POST /api/generate-reply       -> Gemini 3.8 Flash Empathy Script   │
│  - GET  /api/mes/batch/:id        -> MES Production & Tension Data     │
│  - POST /api/mes/quarantine       -> WMS Inventory Containment Trigger │
│  - GET  /api/bi/metrics           -> NLP Sentiment & ROI Analytics     │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Entities & Data Models
- **ProductSKU**: id, name, materialComposition, martindaleCycles, pillingGrade (1-5), recommendedShoes, incompatibleShoes, careInstructions.
- **ComplaintTicket**: id, orderId, sku, customerName, purchaseDate, imageUri, pillingGradeScore, confidence, affectedZone, aiExplanation, voucherCode, status (`resolved_auto`, `manual_review`), timestamp.
- **ProductionBatch**: batchId, sku, yarnSupplier, yarnLot, machineId, operator, knittingTension, rpm, productionDate, totalUnitsShipped, complaintCount, quarantineStatus.
- **SocialReview**: id, platform (Shopee, Dcard, Official), rating, snippet, sentimentPolarity, keywordsMatched, timestamp.

---

## 5. Verification Plan

### Automated & Manual Verification Steps
1. **Compilation & Type Check**:
   - Run `npm run lint` (`tsc --noEmit`) and `npm run build` to ensure clean TypeScript compilation with zero errors.
2. **Module 1 (Customer Front-end)**:
   - Verify Martindale visual bar reflects real cycle thresholds (5,000 to 40,000 cycles).
   - Test shoe pairing engine with both compatible and incompatible leather/rough boot combinations.
   - Verify interactive Care Card modal and QR code render cleanly.
3. **Module 2 (AI CS & Automated After-Sales)**:
   - Test photo upload and sample preset inspection with both severe pilling (Grade 2/3) and smooth fabric (Grade 5).
   - Verify sub-3s response time, visual rating badge, empathy script generation, and auto-generated `$50` voucher.
4. **Module 3 (AOI & MES Traceability)**:
   - Verify live AOI canvas simulates surface defect identification.
   - Verify that adding complaints to a batch triggers the >3% threshold alert and toggles warehouse quarantine.
5. **Module 4 (BI Analytics & Export)**:
   - Verify real-time NLP sentiment breakdown and keyword cloud.
   - Test CSV export button downloading compliant audit data.
