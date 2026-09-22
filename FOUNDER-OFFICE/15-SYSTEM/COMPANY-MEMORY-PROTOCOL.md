# COMPANY-MEMORY-PROTOCOL.md — INSTITUTIONAL KNOWLEDGE PROTOCOL

**Mandate**: Eliminate duplicate mistakes, preserve institutional wisdom, and maintain permanent context across AI context windows.  

---

## 1. Mandatory Post-Action Memory Template
Following any meaningful production release, marketing campaign, experiment conclusion, or architectural pivot, the executing agent must append a memory record to [01-COMPANY-BRAIN/COMPANY-MEMORY.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/01-COMPANY-BRAIN/COMPANY-MEMORY.md) utilizing this exact schema:

```markdown
### MEM-[YYYY]-[NNN]: [Descriptive Title]
- **Date / Timestamp**: YYYY-MM-DDTHH:MM:SS+06:00
- **Department**: [EXECUTIVE / TECH / PRODUCT / CONTENT / MARKETING / FINANCE / SECURITY]
- **What Happened**: [Concise factual summary of the event or action taken]
- **Why**: [The strategic or technical rationale initiating the action]
- **Data Used**: [Telemetry, metrics, customer feedback, or error logs informing the decision]
- **Decision**: [The specific choice made among available alternatives]
- **Result**: [Quantified outcome or state transition]
- **Learning**: [Institutional principle or caveat derived from the outcome]
- **Next Action**: [Concrete follow-up task or permanent policy change]
```

---

## 2. Preventing Repeated Failed Experiments
- Before any agent initiates a task in `03-TASKS/` or an experiment in `12-EXPERIMENTS/`, it must query `COMPANY-MEMORY.md` and `LESSONS-LEARNED.md`.
- If an identical proposal previously failed under similar conditions, the agent is blocked from repeating it unless a fundamental variable has changed.
