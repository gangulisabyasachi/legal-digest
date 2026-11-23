# ⚖️ JURIDICA DIGEST — Scholarly Legal Reporter & Case Citator

A high-performance legal digest and research platform designed with the clean, elegant, and distraction-free academic aesthetic of **ScienceDirect**, combined with the doctrinal research capabilities of **SCC Online** and **Manupatra**.

Powered by an integrated **AI Headnote Engine (xAI Grok / Pluggable Custom Model)**, the platform automatically ingests official judgment PDFs, extracts plain text, and synthesizes structured legal headnotes, *ratio decidendi*, catchwords, and statutory cross-references.

---

## 🌟 Core Highlights

### 1. 📖 ScienceDirect Scholarly Design Aesthetic
- **3-Column Academic Layout**:
  - **Left Rail**: Sticky Document Outline for instant jump-to-section navigation (*Catchwords, Headnote, Ratio Decidendi, Questions of Law, Holding, Statutes, Precedents, Full Text*).
  - **Center Spine**: High-readability reading pane formatted with classical serif typography (*Source Serif 4 / Merriweather*).
  - **Right Rail**: Contextual research tools (One-click PDF download, Citation exporter, Coram/Bench filters, Statute chips).
- **Color Palette**: Scholarly Navy (`#00263E`), Clean Deep Blue (`#007398`), ScienceDirect Accent (`#E25822`), Parchment/Paper (`#FAF9F6`).

### 2. 🤖 AI Legal Headnote Engine (xAI Grok & Custom Models)
- **Automatic PDF Ingestion**: Drag-and-drop any official judgment PDF from Supreme Court or High Courts.
- **Doctrinal Precision**: Extracts:
  - Nominal details (Title, Court, Bench, Date, Neutral Citation)
  - Hierarchical Catchwords / Subject classification
  - **Ratio Decidendi**: The exact principle of law laid down (distinguished from *obiter dicta*)
  - **Statutory Provisions**: Acts and Sections interpreted
  - **Cases Referred**: Followed, Overruled, Distinguished, Considered
  - Operative Holding / Final Disposition
- **Pluggable Architecture**: Ready for xAI Grok API (`grok-2-latest`) or pointing directly to your own self-hosted LLM (Llama 3, Qwen 2.5, or a Python FastAPI microservice).

### 3. 🛡️ Human-in-the-Loop Editorial Studio (Admin Dashboard)
- **Side-by-Side Review Editor**: Left side shows original extracted transcript / PDF, right side provides an editable headnote form.
- **Publishing Workflow**: Draft ➔ Under Review ➔ Published to Live Digest.
- **User Governance**: Role-Based Access Control (Superadmin, Admin, Legal Editor, Subscriber).

### 4. 📂 Personal Research Workspace (SCC Online "My Briefs")
- **Folders & Briefs**: Organize saved judgments by matter or client (e.g., *"Bail Jurisprudence"*, *"IBC CIRP"*).
- **Case Notes & Annotations**: Attach private lawyer notes to any saved judgment.
- **One-Click Citation Exporter**: Standard Indian citation, Neutral citation, Bluebook 21st ed, and BibTeX.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Inside `.env.local`:
```ini
# xAI Grok API Key
GROK_API_KEY=your-xai-api-key-here
GROK_MODEL=grok-2-latest
GROK_API_BASE=https://api.x.ai/v1

# Optional MongoDB connection (default uses resilient local file storage)
MONGODB_URI=mongodb://localhost:27017/legal_digest
JWT_SECRET=super-secure-legal-digest-secret-key-32chars-min
```
> *Note: If `GROK_API_KEY` is not provided or set to mock, the app includes an intelligent local heuristic extractor that parses uploaded PDFs immediately so you can test all admin workflows without delay.*

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Superadmin** | `admin@legaldigest.org` | `Password123!` | Full control, user governance, uploads, catalog |
| **Legal Editor** | `editor@legaldigest.org` | `Password123!` | PDF Ingestion, AI headnote review, editing & publishing |
| **Subscriber / Advocate** | `lawyer@chamber.in` | `Password123!` | Public digest, personal briefs, folders, case notes |

---

## 🔌 Switching to Your Own AI/ML Model

The system uses an adapter pattern in `src/lib/ai/grokClient.ts`. To use your own Python model server or local Ollama / vLLM instance:

1. In your Python service, expose a `POST /v1/chat/completions` or `POST /extract` route returning the structured JSON schema.
2. In `.env.local`, set:
   ```ini
   GROK_API_BASE=http://localhost:8000/v1
   GROK_MODEL=your-custom-legal-model
   ```
The frontend and admin dashboard will immediately start using your own model seamlessly!
