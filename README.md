<div align="center">

# 🏛️ Chandra Gram Sabha (चन्द्र ग्राम सभा)
### Next-Generation Digital Village Governance & Voice-First Civic Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Runtime](https://img.shields.io/badge/Runtime-Bun-fbf0df?logo=bun)](https://bun.sh/)
[![Bilingual](https://img.shields.io/badge/Languages-Hindi_%7C_English-orange)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)

*An end-to-end civic-tech platform bridging the gap between rural citizens and local administration through bilingual accessibility, automated grievance redressal, and voice-assisted AI agents.*

**Target Deployment:** Gram Panchayat Chandra, Block Shankargarh, Prayagraj, UP *(LGD Code: 3145021064)*

---

</div>

## 📌 The Problem & Solution

Rural citizens face significant friction in accessing local government services: complex paperwork, language/literacy barriers, and lack of visibility into Gram Panchayat budgets and scheme disbursement.

**Chandra Gram Sabha** solves this with a **Voice-First, Multilingual Civic Intelligence Engine**:
- **Bilingual Interface**: Seamless 1-click toggle between Hindi (हिन्दी) and English.
- **Voice Grievance Intake**: Citizens can record grievances orally via voice agent (Vapi) or WhatsApp, automatically parsed and categorized into actionable departmental tickets.
- **Transparent Governance**: Real-time tracking of Panchayat development funds, scheme eligibility, and Gram Sabha resolutions.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   Rural Citizen        │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [ 🌐 Next.js 16 Web Portal ]                  [ 🎙️ Voice Agent / WhatsApp ]
         - Bilingual (Hindi / English)                 - Vapi AI speech pipeline
         - Public grievance tracker                    - WhatsApp webhook parsing
         - Scheme eligibility checker                  - Speech-to-text ticket intake
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              ▼
                                 [ ⚙️ API / Service Layer ]
                                 - Automated categorization
                                 - Officer routing & priority
                                 - SMS / notification triggers
                                              │
                                              ▼
                                 [ 🗄️ Database & Storage ]
                                 - Prisma ORM + SQLite
                                 - Uploads & verification audit
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **🗣️ Voice-Driven Grievances** | Integrated with conversational voice AI to let non-literate citizens report broken handpumps, road damage, or electricity issues via phone or browser. |
| **📋 Automated Ticket Routing** | Automatically extracts grievance category, severity level, and geo-locality to route tickets to the Gram Pradhan or Panchayat Secretary. |
| **💡 Welfare Scheme Matcher** | Interactive guide matching citizens to central and state welfare programs (PM-KISAN, MNREGA, Awas Yojana, Ayushman Bharat). |
| **📊 Village Asset Registry** | Digital registry of public infrastructure (solar lights, schools, water tanks, health sub-centers) with maintenance status. |
| **📜 Gram Sabha Proceedings** | Digital repository of meeting agendas, attendee records, and sanctioned development proposals for public transparency. |
| **⚡ High-Performance Edge** | Powered by Next.js 16 App Router and Bun for rapid load times even under 2G/3G connectivity. |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions)
- **Language:** TypeScript 5.0
- **Runtime:** Bun / Node.js
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons, Framer Motion
- **Database & ORM:** SQLite via Prisma ORM
- **Voice & Communication:** Vapi conversational voice API, WhatsApp webhook integration
- **State Management:** Zustand
- **Web Server:** Caddy reverse proxy with automatic HTTPS

---

## 🚀 Quick Start Guide

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js >= 18
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarshDubey23/chandragramsabha.git
   cd chandragramsabha
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or: npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env   # Configure database URL and API keys
   ```

4. **Initialize Database:**
   ```bash
   bun x prisma db push
   bun x prisma db seed   # Seeds initial Chandra Panchayat data
   ```

5. **Start Development Server:**
   ```bash
   bun run dev
   # Open http://localhost:3000
   ```

---

## 🛡️ Security & Privacy

- **Data Minimization:** Only essential contact and grievance data are captured.
- **Audit Trails:** Administrative changes, budget allocations, and ticket resolutions are timestamped and logged.
- **Role-Based Access Control:** Separate role boundaries for Citizens, Panchayat Staff, and Block Administrators.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
