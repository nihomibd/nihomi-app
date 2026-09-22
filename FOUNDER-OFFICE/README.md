# NIHOMI FOUNDER OFFICE (にほみ 創業者オフィス)
**Virtual Corporate Office & Executive Control Room**

---

## 1. Executive Purpose
The `FOUNDER-OFFICE/` directory serves as the dedicated local control room and operational command center for the Founder of **NIHOMI.COM**. It bridges high-level strategic direction, company intelligence, operational oversight, and future AI workforce orchestration without altering or endangering the core production codebase.

---

## 2. Directory Architecture

```text
FOUNDER-OFFICE/
├── 00-FOUNDER/            # Executive vision, founder journal, strategic priorities, and personal mandates
├── 01-COMPANY-BRAIN/       # Knowledge base, institutional memory, market intelligence, competitor analysis
├── 02-AI-ORGANIZATION/     # AI workforce schemas, department definitions, agent roles, and capabilities
├── 03-TASKS/              # Executive task boards, sprint items, backlog, and delegation tracker
├── 04-APPROVALS/          # Human-in-the-loop gates: payments, content publishing, role upgrades, deployments
├── 05-FINANCE/            # Financial models, revenue projections, bKash/Stripe logs, unit economics
├── 06-MARKETING/          # Growth funnels, acquisition campaigns, UTM tracking, social media strategies
├── 07-PRODUCT/            # Product roadmap, feature specs, JLPT curriculum requirements, user stories
├── 08-CONTENT/            # Content pipelines, video masterclasses, PDF materials, lesson review queues
├── 09-OPERATIONS/         # Day-to-day administrative runbooks, student onboarding, operational checklists
├── 10-SECURITY/           # Access control policies, audit reports, credential safety protocols, threat models
├── 11-REPORTS/            # Weekly/monthly business metrics, active user reports, conversion summaries
├── 12-EXPERIMENTS/        # Growth hypotheses, A/B test definitions, pricing experiments, conversion pilots
├── 13-SOP-LIBRARY/        # Standard Operating Procedures for curriculum, support, payments, and releases
├── 14-BRAND/              # Brand identity, Neo-Tokyo design language, tone of voice, visual assets
└── 15-SYSTEM/             # Office system state, master progress tracking, and environment status
```

---

## 3. Operational Protocols & Rules of Engagement

1. **Production Isolation**:
   - Files within `FOUNDER-OFFICE/` are executive, operational, and organizational resources.
   - They do not directly mutate production application logic unless an explicit, approved deployment or code change task is executed.

2. **Security & Privacy Shield**:
   - Zero storage of raw credentials, API secrets, database passwords, payment PINs, or private keys.
   - All references to sensitive systems utilize environment variable names (`.env.example` schema) rather than raw values.

3. **Master Progress Discipline**:
   - All strategic phases, gates, pending actions, and blocker statuses are synchronized through [MASTER-PROGRESS.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/15-SYSTEM/MASTER-PROGRESS.md).
   - System and tool readiness is documented in [OFFICE-STATUS.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/15-SYSTEM/OFFICE-STATUS.md).

---

*NIHOMI.COM — Commercial Japanese Learning & Relocation Platform*
