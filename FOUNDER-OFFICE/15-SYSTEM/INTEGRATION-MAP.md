# INTEGRATION-MAP.md — VIRTUAL OFFICE SYSTEM INTEGRATION MAP

**System Boundary**: Blueprint & Architecture Specification Only  
**Connection Status**: Disconnected (Staged for Phase 2; zero active outbound integrations created)  

---

## 1. Enterprise Integration Matrix

| Integration Name | Current Status | READ Capability | PREPARE Capability | EXECUTE Capability | Requires Credential | Requires Founder Approval |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GitHub** | Local Git Active | Read repo, history, PRs | Create branch, PR drafts | Merge to main, tag releases | Yes (PAT / App) | **YES (for Merge)** |
| **Vercel** | Configured (`vercel.json`) | Read deployment status | Trigger preview build | Promote to production | Yes (Vercel Token) | **YES** |
| **Supabase** | Configured in App | Query data, inspect logs | Draft migration scripts | Execute DDL, delete data | Yes (Service Key) | **YES** |
| **Google AI** | Active in Codebase | Model status, quotas | Prompt & evaluation tests | User-facing inference | Yes (`GEMINI_API_KEY`) | **NO (Bounded)** |
| **Notion** | Blueprint Only | Read workspace pages | Draft documentation | Publish policy changes | Yes (Notion Token) | **NO** |
| **Gmail** | Blueprint Only | Read/triage incoming | Draft email responses | Send external emails | Yes (OAuth2 / App PW) | **YES (Broadcast)** |
| **Analytics** | Telemetry In-App | Read funnel stats | Draft metric reports | Export data sinks | Yes (Tracking IDs) | **NO** |
| **Payment Gateways** | Active in Codebase | Reconcile transactions | Draft refund proposals | Disburse funds / refunds | Yes (Merchant Keys) | **YES** |
| **Marketing** | Blueprint Only | Read social telemetry | Draft campaigns & reels | Post to social channels | Yes (Platform APIs) | **YES** |
| **Ads (Meta/Google)** | Blueprint Only | Read CPC/ROAS metrics | Draft ad copy & sets | Publish / increase spend | Yes (Ad Account IDs) | **YES** |
| **Monitoring (Sentry)** | Blueprint Only | Read error stack traces | Draft bug reports | Mute / resolve alerts | Yes (DSN Token) | **NO** |
| **Automation Crons** | Express Active | Inspect job intervals | Draft job logic updates | Modify cron schedules | No (Internal Engine) | **YES** |

---

> [!IMPORTANT]
> **Safety Directive**: All integrations listed above remain in blueprint mode within `FOUNDER-OFFICE/`. No external credentials have been created, configured, or connected in this phase.
