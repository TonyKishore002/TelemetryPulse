# TelemetryPulse
Autonomous agent that traces production incidents from telemetry to root cause, generates verified code fixes, and submits pull requests.

> **Detect → Refactor → Govern → Verify → Stage**

TelemetryPulse is an autonomous Site Reliability Engineering (SRE) workstation built for the **IBM Bob 2.0 Hackathon**.

It transforms production telemetry and APM incidents into verified code remediation by connecting live monitoring, AST-based code analysis, autonomous refactoring, human approval, sandbox verification, security scanning, and GitHub pull-request staging into a single workflow.

---

## 🚀 Project Overview

TelemetryPulse continuously monitors target applications and detects production performance bottlenecks.

When an incident is detected, IBM Bob 2.0 analyzes the application's source code and identifies the underlying performance problem. For the demonstrated incident, the system identifies a sequential **N+1 database query pattern**, generates an optimized batched-query refactor, and pauses execution for human approval.

After approval, the change is executed inside an isolated BobShell environment and verified through performance benchmarking, Pytest assertions, and Bandit security scanning.

Once all verification checks pass, TelemetryPulse stages a GitHub pull request containing the remediation and incident post-mortem.

```text
| Step | IBM Bob 2.0 Process | Description | Output |
|---|---|---|---|
| 01 | **Incident Detection** | Receives `INC-504-001` with 504 Gateway Timeout and database connection pool exhaustion. | Production incident identified |
| 02 | **AST Code Analysis** | Analyzes `orderController.js` and the related REST endpoint using AST analysis. | Relevant code path identified |
| 03 | **Root Cause Detection** | Detects a sequential `for...of` loop performing individual database queries, resulting in 101 database round trips. | N+1 query bottleneck identified |
| 04 | **Autonomous Refactoring** | Rewrites the sequential queries into a single optimized batched database query. | Optimized code patch |
| 05 | **API Contract Validation** | Verifies that the refactor preserves the existing API response schema. | API-compatible refactor |
| 06 | **Human Approval Gate** | Sends the generated code diff and root-cause summary to the Slack approval workflow. | SRE-approved remediation |
| 07 | **BobShell Sandbox** | Executes the approved patch inside an isolated BobShell environment. | Verified sandbox environment |
| 08 | **Performance Benchmark** | Compares the original and optimized implementations. | **1,489.1 ms → 28 ms (53.2×)** |
| 09 | **Pytest Verification** | Runs automated regression and schema tests. | **7/7 tests passed** |
| 10 | **Bandit SAST Scan** | Scans the generated code for security vulnerabilities. | **0 high-severity vulnerabilities** |
| 11 | **GitHub PR Staging** | Stages the verified fix on `fix/orders-n-plus-one` and creates PR **#247**. | GitHub Pull Request |
| 12 | **Incident Post-Mortem** | Generates the incident cause, remediation details, benchmark results, and verification summary. | Review-ready post-mortem |


Live Telemetry / APM Alert
          ↓
    Detect & Triage
          ↓
      AST Analysis
          ↓
    Root Cause Detection
          ↓
   Autonomous Refactor
          ↓
   Human Approval Gate
          ↓
    BobShell Sandbox
          ↓
 ┌───────────────────────┐
 │ Performance Benchmark │
 │ Pytest Verification   │
 │ Bandit Security Scan  │
 └───────────────────────┘
          ↓
    GitHub Pull Request
          ↓
   Incident Post-Mortem
          ↓
      Human Review
