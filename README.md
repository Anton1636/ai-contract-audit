<div align="center">

<img src="https://img.shields.io/badge/AI_Powered-Gemini_3_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Framework-Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Language-Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" />
<img src="https://img.shields.io/github/license/Anton1636/ai-contract-audit?style=for-the-badge&color=10b981" />

<br />
<br />

<h1>🛡️ AI Contract Auditor</h1>

<p align="center">
  <strong>AI-powered smart contract security auditor combining methodologies from OpenZeppelin, CertiK, and Trail of Bits</strong>
</p>

<p align="center">
  <a href="https://github.com/Anton1636/ai-contract-audit/actions">
    <img src="https://github.com/Anton1636/ai-contract-audit/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
</p>

</div>

---

## ✨ Features

- **AI Security Analysis** — Detects vulnerabilities using combined OpenZeppelin, CertiK, and Trail of Bits methodology
- **9 Vulnerability Categories** — Access Control, Reentrancy, Math Errors, Logic Errors, State Issues, Oracle attacks, Missing Events, Integration Risks, Code Quality
- **Proof of Concept** — Step-by-step attack scenarios for each vulnerability
- **Real-World References** — Links every finding to actual hacks (The DAO, Ronin Bridge, etc.)
- **Gas Optimizations** — Separate analysis with estimated savings
- **PDF Export** — Professional audit report download
- **Audit History** — All previous audits saved locally
- **AI Chat Assistant** — Ask questions about your contract with full context
- **Monaco Editor** — VS Code-quality code editing experience

---

## 🛠️ Tech Stack

| Category    | Technology                     |
| ----------- | ------------------------------ |
| Framework   | Next.js 15 (App Router)        |
| Language    | TypeScript                     |
| AI Model    | Google Gemini 3 Flash          |
| Code Editor | Monaco Editor (VS Code engine) |
| Styling     | Tailwind CSS                   |
| PDF Export  | @react-pdf/renderer            |
| Testing     | Jest + React Testing Library   |
| CI/CD       | GitHub Actions                 |
| Deployment  | Vercel                         |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/Anton1636/ai-contract-audit.git
cd ai-contract-audit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 How It Works

1. **Paste** your Solidity contract into the Monaco editor
2. **Click** "Audit Smart Contract"
3. **Wait** while AI analyzes your code
4. **Review** the detailed security report with:
   - Security score (0-100) and grade (A-F)
   - Categorized vulnerabilities with severity levels
   - Proof of concept attack scenarios
   - Fixed code examples
   - Gas optimization suggestions
5. **Chat** with the AI assistant about specific findings
6. **Export** the full report as PDF

---

## 🏗️ Architecture

```
ai-contract-audit/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── audit/route.ts    # Gemini API + caching + rate limiting
│   │   │   └── chat/route.ts     # AI chat with contract context
│   │   ├── page.tsx              # Main application page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── AuditReport.tsx       # Full audit report display
│   │   ├── VulnerabilityCard.tsx # Expandable vulnerability cards
│   │   ├── ScoreRing.tsx         # Animated score visualization
│   │   ├── SeverityBadge.tsx     # Severity level badges
│   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   ├── AuditButton.tsx       # Audit trigger button
│   │   ├── ChatPanel.tsx         # Floating AI chat
│   │   ├── HistoryPanel.tsx      # Audit history
│   │   ├── LoadingOverlay.tsx    # Loading screen with progress
│   │   └── AuditPdfDocument.tsx  # PDF report generator
│   ├── lib/
│   │   ├── prompts.ts            # AI prompts (OpenZeppelin/CertiK methodology)
│   │   ├── utils.ts              # Utility functions
│   │   ├── constants.ts          # App constants
│   │   ├── historyStorage.ts     # LocalStorage management
│   │   └── exportPdf.ts          # PDF export logic
│   └── types/
│       └── audit.ts              # TypeScript interfaces
├── tests/
│   └── unit/                     # Jest unit tests
└── .github/
    └── workflows/ci.yml          # CI/CD pipeline
```

---

## 🔐 Security Methodology

This auditor combines approaches from three leading firms:

| Firm              | Contribution                                                |
| ----------------- | ----------------------------------------------------------- |
| **OpenZeppelin**  | Report structure: Summary → Scope → Findings                |
| **CertiK**        | Finding format: Description → Impact → PoC → Recommendation |
| **Trail of Bits** | Vulnerability categories and severity definitions           |
| **Rekt.news**     | Real-world loss-based impact assessment                     |

### Vulnerability Categories

| Category         | Examples                                  |
| ---------------- | ----------------------------------------- |
| Access Control   | Missing onlyOwner, incorrect roles        |
| Reentrancy       | Cross-function, cross-contract attacks    |
| Math Errors      | Overflow, underflow, precision loss       |
| Logic Errors     | Incorrect business logic, validation gaps |
| State Issues     | Race conditions, double updates           |
| Oracle Attacks   | Price manipulation, flash loan exploits   |
| Missing Events   | No emission after state changes           |
| Integration Risk | Unsafe external calls, dependency issues  |
| Code Quality     | Documentation, best practice violations   |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**25 tests** covering:

- Utility functions (score colors, grades, severity counts)
- localStorage history management
- React component rendering

---

## 📡 API Reference

### `POST /api/audit`

Analyzes a Solidity smart contract.

**Request:**

```json
{
	"code": "pragma solidity ^0.8.0; contract MyContract { ... }"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "score": 75,
    "grade": "B",
    "contractName": "MyContract",
    "summary": "...",
    "vulnerabilities": [...],
    "gasOptimizations": [...],
    "overallRecommendation": "..."
  }
}
```

**Rate Limit:** 10 requests per hour per IP

---

### `POST /api/chat`

Chat with AI about the audited contract.

**Request:**

```json
{
  "contractCode": "...",
  "auditReport": {...},
  "message": "Explain the reentrancy vulnerability",
  "history": [...]
}
```

**Response:**

```json
{
	"success": true,
	"message": "The reentrancy vulnerability occurs when..."
}
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>
    <a href="https://github.com/Anton1636/ai-contract-audit/issues">Report Bug</a>
    ·
    <a href="https://github.com/Anton1636/ai-contract-audit/issues">Request Feature</a>
  </p>
</div>
