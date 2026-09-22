# TOOL-PERMISSIONS.md — SYSTEM INTEGRATION PERMISSION MATRIX

**Architecture**: READ / PREPARE / EXECUTE Tri-Modal Tool Gating  
**Security Mandate**: Zero raw credentials stored. All integrations use environment aliases and token-scoped permissions.  

---

## 1. Tri-Modal Permission Paradigm

For every system interface, capabilities are divided into three discrete access levels:
1. **READ**: Passive observation, status inspection, data ingestion, and log parsing.
2. **PREPARE**: Drafting changes, staging pull requests, staging email drafts, and queuing proposals.
3. **EXECUTE**: Committing changes, publishing live content, moving capital, or dispatching external messages.

---

## 2. Comprehensive Tool Permission Matrix

| Service / Tool | READ (Passive) | PREPARE (Staging) | EXECUTE (Active / Gated) | Authority Required |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub** | Inspect codebase, read issues, review PR comments, check CI build logs. | Create feature branches, write code diffs, generate pull requests, draft release notes. | Merge PRs to `main`, tag official releases, alter branch protection rules. | **RED** (Founder approval for `main` merge) |
| **Vercel** | Inspect deployment status, read build logs, monitor serverless function health. | Trigger preview deployments on non-production branches. | Promote preview build to production domain (`nihomi.com`), modify custom domain DNS, update env variables. | **RED** (Founder approval required) |
| **Supabase / PostgreSQL** | Query student progress, inspect subscription status, read course catalogs, audit error logs. | Generate SQL migration scripts, prepare schema diffs, prepare index optimizations. | Run database migrations, execute DDL (`ALTER`, `DROP`), perform manual row deletion or updates on live tables. | **RED** (Founder approval required) |
| **Google AI (Gemini)** | Query model status, check token latency, inspect AI Cost Guard counters. | Construct prompt templates, test model evaluation sets, run batch document parsing. | Invoke production inference on behalf of users, adjust per-tier token quotas, alter model fallback chains. | **YELLOW** (Bounded by `aiCostGuard`) |
| **Payment Gateways** *(bKash, SSLCommerz, Stripe)* | Read transaction history, reconcile payment status, verify IPN webhook logs. | Draft refund proposals, compile chargeback disputes, prepare payout summaries. | Disburse funds, issue manual refunds, modify webhook URLs, alter merchant bank accounts. | **RED** (Founder exclusive authority) |
| **Bank / Financial Accounts** | Read account balances and transaction exports where API supported. | Prepare ledger reconciliation entries, draft expenditure requests. | Initiate money transfers, wire payments, modify signing authorities. | **RED** (Founder exclusive authority) |
| **Meta / Google Ads** | Read campaign ROAS, inspect CPC/CPM metrics, analyze conversion funnels. | Draft ad creative copy, design image briefs, configure audience segment drafts. | Publish campaigns, increase daily spend, modify account payment credit cards. | **RED** (Founder approval required) |
| **Gmail / Email** | Read inbound student messages, classify inquiries, extract support tickets. | Draft email replies, format transactional templates, stage newsletters. | Send emails to external recipients or dispatch bulk broadcasts. | **YELLOW** (Transactional) / **RED** (Broadcast) |
| **Notion / Company Brain** | Read operational SOPs, inspect company archives, view meeting briefs. | Draft documentation updates, create project task cards, format summaries. | Publish or archive corporate policies, alter workspace access permissions. | **YELLOW** (Internal operations) |
| **Monitoring & Sentry** | Read crash alerts, inspect error stack traces, analyze latency trends. | Draft bug reports, correlate crashes with recent releases. | Mute alerts, resolve incident tickets, alter alert thresholds. | **GREEN** / **YELLOW** |

---

## 3. Strict Boundary Rules
1. **Zero Raw Secret Creation**: Under no circumstances will private API tokens, passwords, or secret keys be created or hardcoded in this repository.
2. **Credential Isolation**: All API integrations authenticate via server-side runtime injection or secrets managers outside the local workspace.
3. **Audit Trail**: Every execution at the **PREPARE** or **EXECUTE** level generates an immutable timestamped event in [MASTER-PROGRESS.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/15-SYSTEM/MASTER-PROGRESS.md).
