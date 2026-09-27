export const mockIncident = {
  id: "INC-504-001",
  title: "LIVE PRODUCTION INCIDENT",
  severity: "CRITICAL",
  endpoint: "GET /api/orders",
  httpStatus: 504,
  statusText: "504 Gateway Timeout",
  traceId: "trace-82931-prod-iad",
  cluster: "production-east-aws-eks",
  service: "order-service",
  timestamp: "2026-09-26T14:18:22Z",
  detectedDuration: "4m 12s ago",
  metrics: {
    latency: "4.8s",
    dbQueries: 101,
    errorRate: "18.4%",
    throughput: "1,284 req/s",
    dbLoad: "92%"
  },
  finops: {
    agentExecutionCost: "$0.05",
    estimatedMonthlySavings: "$140.00/mo",
    roiMultiplier: "2,800x",
    calculationDetails: "Elimination of 120M redundant DB roundtrips/mo allows downsizing RDS instance from db.r6g.2xlarge to db.r6g.large."
  },
  pipelineSteps: [
    { label: "DETECT", status: "COMPLETE", detail: "Instana APM triggered 504 threshold alert" },
    { label: "INVESTIGATE", status: "ACTIVE", detail: "Correlating trace-82931 with AST & query logs" },
    { label: "REFACTOR", status: "READY", detail: "Batch query synthesis awaiting Slack gate" },
    { label: "VERIFY", status: "READY", detail: "Sandbox isolation container staged" }
  ]
};

export const mockTraceSpans = [
  {
    id: "span-1",
    name: "GET /api/orders",
    service: "ingress-gateway",
    duration: 4800,
    startTime: 0,
    type: "http",
    status: 504,
    file: "orderController.js:18"
  },
  {
    id: "span-2",
    name: "orderController.getOrdersWithItems()",
    service: "order-service",
    duration: 4760,
    startTime: 40,
    type: "application",
    status: 504,
    file: "orderController.js:42"
  },
  {
    id: "span-3",
    name: "SELECT * FROM orders WHERE status = 'active' LIMIT 100",
    service: "postgres-primary",
    duration: 35,
    startTime: 55,
    type: "db",
    status: 200,
    file: "db.query() [Query 1 of 101]"
  },
  {
    id: "span-4",
    name: "SELECT * FROM order_items WHERE order_id = 1001",
    service: "postgres-primary",
    duration: 46,
    startTime: 95,
    type: "db-n1",
    status: 200,
    file: "orderController.js:47 [Sequential DB Query 2/101]"
  },
  {
    id: "span-5",
    name: "SELECT * FROM order_items WHERE order_id = 1002",
    service: "postgres-primary",
    duration: 48,
    startTime: 145,
    type: "db-n1",
    status: 200,
    file: "orderController.js:47 [Sequential DB Query 3/101]"
  },
  {
    id: "span-6",
    name: "SELECT * FROM order_items WHERE order_id = 1003",
    service: "postgres-primary",
    duration: 47,
    startTime: 195,
    type: "db-n1",
    status: 200,
    file: "orderController.js:47 [Sequential DB Query 4/101]"
  },
  {
    id: "span-7",
    name: "SELECT * FROM order_items WHERE order_id = 1004",
    service: "postgres-primary",
    duration: 45,
    startTime: 245,
    type: "db-n1",
    status: 200,
    file: "orderController.js:47 [Sequential DB Query 5/101]"
  },
  {
    id: "span-8",
    name: "SELECT * FROM order_items WHERE order_id = ... (96 more sequential queries)",
    service: "postgres-primary",
    duration: 4400,
    startTime: 295,
    type: "db-n1-grouped",
    status: 504,
    file: "orderController.js:47 [Sequential Queries 6 to 101 - Exceeded Gateway 5.0s Timeout]"
  }
];

export const mockAiAgents = [
  {
    id: "telemetry-detective",
    name: "Telemetry Detective",
    role: "APM & Trace Correlation",
    status: "Complete",
    badge: "✓ COMPLETE",
    color: "#22C55E",
    findings: "Trace trace-82931 shows 101 roundtrips. Latency spike directly mapped to DB pool starvation."
  },
  {
    id: "code-archaeologist",
    name: "Code Archaeologist",
    role: "AST & Git Blame Analysis",
    status: "Complete",
    badge: "✓ COMPLETE",
    color: "#22C55E",
    findings: "orderController.js line 42 introduced by commit #a8f10c without eager relation loading."
  },
  {
    id: "performance-analyst",
    name: "Performance Analyst",
    role: "Query Plan & Bottleneck Scoring",
    status: "Analyzing",
    badge: "◉ ANALYZING",
    color: "#22D3EE",
    findings: "Calculating N+1 database amplification factor: 101 DB calls per HTTP request. Latency drop projection: 91%."
  },
  {
    id: "refactor-engineer",
    name: "Refactor Engineer",
    role: "Safe Code Synthesis",
    status: "Waiting",
    badge: "○ WAITING",
    color: "#F59E0B",
    findings: "Patch synthesized: IN (...) batch query with in-memory map. Awaiting human Slack approval."
  },
  {
    id: "release-validator",
    name: "Release Validator",
    role: "Sandbox & Security Gatekeeper",
    status: "Waiting",
    badge: "○ WAITING",
    color: "#64748B",
    findings: "BobShell isolated container staged with pytest suite and Bandit SAST scanner."
  }
];

export const mockRootCause = {
  title: "ROOT CAUSE IDENTIFIED: N+1 DATABASE QUERY",
  location: "orderController.js:42",
  evidence: "101 orders → 101 database queries",
  confidence: "CORRELATED EVIDENCE — HIGH",
  confidenceScore: "99.4%",
  summary: "A sequential `for (const order of orders)` loop executes individual `SELECT * FROM order_items WHERE order_id = order.id` queries instead of batch loading item relations.",
  impact: "With 1,284 req/s traffic, this saturates the PostgreSQL connection pool (max 100 conns), leading to request queue delays and eventual 504 Gateway Timeouts."
};

export const mockCodeDiff = {
  file: "src/controllers/orderController.js",
  language: "javascript",
  beforeLines: [
    "// BEFORE (Sequential N+1 Database Query Loop - INCIDENT CAUSE)",
    "export async function getOrders(req, res) {",
    "  const orders = await db.query(",
    "    'SELECT id, customer_id, total, status FROM orders WHERE status = $1 LIMIT 100',",
    "    ['active']",
    "  );",
    "",
    "  // ❌ CRITICAL BOTTLENECK: 101 sequential database roundtrips",
    "  for (const order of orders.rows) {",
    "    const items = await db.query(",
    "      'SELECT * FROM order_items WHERE order_id = $1',",
    "      [order.id]",
    "    );",
    "    order.items = items.rows; // 100 iterations = 100 individual queries",
    "  }",
    "",
    "  return res.json({ orders: orders.rows });",
    "}"
  ],
  afterLines: [
    "// AFTER (Single Batched Query with In-Memory Map - SYNTHESIZED FIX)",
    "export async function getOrders(req, res) {",
    "  const orders = await db.query(",
    "    'SELECT id, customer_id, total, status FROM orders WHERE status = $1 LIMIT 100',",
    "    ['active']",
    "  );",
    "",
    "  if (orders.rows.length === 0) return res.json({ orders: [] });",
    "",
    "  // ✅ VERIFIED REFACTOR: 1 bulk query using IN ($1, $2, ...)",
    "  const orderIds = orders.rows.map(o => o.id);",
    "  const itemsResult = await db.query(",
    "    'SELECT * FROM order_items WHERE order_id = ANY($1)',",
    "    [orderIds]",
    "  );",
    "",
    "  // Map items to orders in-memory in O(N) time with zero extra DB roundtrips",
    "  const itemsByOrderId = new Map();",
    "  itemsResult.rows.forEach(item => {",
    "    if (!itemsByOrderId.has(item.order_id)) itemsByOrderId.set(item.order_id, []);",
    "    itemsByOrderId.get(item.order_id).push(item);",
    "  });",
    "",
    "  const enrichedOrders = orders.rows.map(order => ({",
    "    ...order,",
    "    items: itemsByOrderId.get(order.id) || []",
    "  }));",
    "",
    "  return res.json({ orders: enrichedOrders });",
    "}"
  ],
  queryReduction: "101 queries ➔ 1 query",
  estimatedLatency: "4.8s → ~420ms (ESTIMATED BEFORE VERIFICATION)",
  slackPlan: [
    "1. Extract list of order IDs from active order set in memory.",
    "2. Replace 101 sequential item queries with a single batched `WHERE order_id = ANY($1)` query.",
    "3. Group item records in-memory using Map() hash lookup to eliminate all DB pool lock contention."
  ]
};

export const mockTerminalLogs = [
  { time: "14:22:01", type: "system", text: "Initializing BobShell Sandbox environment (container: bobshell-sandbox-isolated-82931)..." },
  { time: "14:22:02", type: "system", text: "Mounting git workspace at /workspace/telemetrypulse-api (branch: fix/orders-n-plus-one)..." },
  { time: "14:22:03", type: "task-start", text: "🚀 SPAWNING 3 PARALLEL VERIFICATION PIPELINES:" },
  { time: "14:22:04", type: "task-a", text: "[Task A: Load Test] Starting k6 / autocannon benchmark against GET /api/orders (500 vUsers)..." },
  { time: "14:22:05", type: "task-b", text: "[Task B: Unit Tests] Executing pytest / jest test runner on order service test suite..." },
  { time: "14:22:06", type: "task-c", text: "[Task C: SAST Security] Initiating Bandit & Semgrep static security vulnerability scanner..." },
  { time: "14:22:07", type: "task-b", text: "[Task B: Unit Tests] test_order_controller_pagination ... PASSED [4ms]" },
  { time: "14:22:08", type: "task-b", text: "[Task B: Unit Tests] test_order_items_relation_integrity ... PASSED [6ms]" },
  { time: "14:22:09", type: "task-b", text: "[Task B: Unit Tests] test_empty_order_list_handling ... PASSED [2ms]" },
  { time: "14:22:10", type: "task-b", text: "[Task B: Unit Tests] ✓ Task B (Unit Tests): Running pytest... 24/24 tests passed ✓" },
  { time: "14:22:11", type: "task-c", text: "[Task C: SAST Security] Scanning AST for SQL injection vectors, raw string interpolations, and tainted inputs..." },
  { time: "14:22:12", type: "task-c", text: "[Task C: SAST Security] Parameterized array ANY($1) validated against PostgreSQL injection heuristics." },
  { time: "14:22:13", type: "task-c", text: "[Task C: SAST Security] ✓ Task C (SAST Security Gate): Running Bandit vulnerability scanner... 0 Security Flaws (SQL Injection Clean) ✓" },
  { time: "14:22:14", type: "task-a", text: "[Task A: Load Test] 500 virtual users sustained over 30s warmup. Total requests completed: 15,400." },
  { time: "14:22:15", type: "task-a", text: "[Task A: Load Test] Latency P50: 380ms | P95: 418ms | P99: 425ms | HTTP 200: 100.0% | HTTP 504: 0.0%" },
  { time: "14:22:16", type: "task-a", text: "[Task A: Load Test] ✓ Task A (Load Test): Benchmarking... Latency dropped to 420ms ✓" },
  { time: "14:22:17", type: "success", text: "============================================================" },
  { time: "14:22:18", type: "success", text: "✅ ALL 3 VERIFICATION GATES PASSED AUTOMATICALLY (Exit Code: 0)" },
  { time: "14:22:19", type: "success", text: "BobShell Sandbox Isolation State: CLEAN | Ready for Human Pull Request Creation." }
];

export const mockExplainAnalyze = [
  {
    metric: "Scan Type",
    beforePatch: "Sequential Scan (100k rows)",
    afterPatch: "Index Scan (12 rows)",
    improvement: "99.9% fewer rows scanned",
    highlight: true
  },
  {
    metric: "Execution Cost",
    beforePatch: "4,210.00 units",
    afterPatch: "8.42 units",
    improvement: "500x cost reduction",
    highlight: true
  },
  {
    metric: "Execution Duration",
    beforePatch: "4,520 ms (101 roundtrips)",
    afterPatch: "4.2 ms (1 roundtrip)",
    improvement: "1,076x faster execution",
    highlight: false
  },
  {
    metric: "Shared Buffer Hits",
    beforePatch: "1,840 pages (high I/O thrashing)",
    afterPatch: "24 pages (100% cache hit)",
    improvement: "98.7% buffer contention reduction",
    highlight: false
  },
  {
    metric: "Postgres Connection Lock",
    beforePatch: "Held for 4.8s across pool",
    afterPatch: "Released in 4.2ms",
    improvement: "Pool starvation eliminated",
    highlight: false
  }
];

export const mockMetricComparison = [
  {
    label: "Latency (P95)",
    before: "4,800ms",
    after: "420ms",
    delta: "-91.2%",
    unit: "ms",
    type: "positive"
  },
  {
    label: "DB Queries",
    before: "101",
    after: "1",
    delta: "-99.0%",
    unit: "queries/req",
    type: "positive"
  },
  {
    label: "HTTP Status",
    before: "504",
    after: "200",
    delta: "Resolved",
    unit: "status",
    type: "positive"
  },
  {
    label: "Error Rate",
    before: "18.4%",
    after: "0.3%",
    delta: "-98.4%",
    unit: "%",
    type: "positive"
  }
];

export const mockPostMortem = {
  incidentId: "INC-504-001",
  title: "Post-Mortem: Production 504 Gateway Timeout on GET /api/orders",
  date: "2026-09-26",
  author: "Bob AI Autonomous SRE & Tony (SRE Lead)",
  rca: "High incoming request volume (1,284 req/s) triggered concurrent execution of orderController.getOrders(). Due to an unbatched loop fetching order items on line 42, each HTTP request issued 101 sequential database queries, saturating the 100-connection PostgreSQL pool and exceeding the 5.0-second API gateway timeout.",
  fiveWhys: [
    "1. Why did users experience 504 timeouts? The API gateway timed out after waiting 5.0s for the orders service response.",
    "2. Why was the orders service taking 4.8s+? It was waiting on 101 sequential database queries to complete per request.",
    "3. Why did it execute 101 queries instead of 1? The endpoint looped over 100 orders and executed a separate query for each order's items (N+1 query anti-pattern).",
    "4. Why was this code merged? The test dataset in staging contained only 2 orders, hiding the O(N) network roundtrip latency.",
    "5. Why did CI not flag this? Unit test coverage lacked query count assertions and synthetic load thresholds."
  ],
  benchmarks: {
    beforeLatency: "4,800ms",
    afterLatency: "420ms",
    beforeQueries: 101,
    afterQueries: 1,
    beforeErrorRate: "18.4%",
    afterErrorRate: "0.3%",
    monthlySavings: "$140.00/mo"
  },
  preventionRules: [
    "Rule 1: Enforce ESLint/Semgrep rule `no-await-in-loop` on all database controller layers.",
    "Rule 2: Integrate `sql-query-counter` middleware in integration test suites to fail any single HTTP request exceeding 5 database queries.",
    "Rule 3: Require eager relation loading (`order_id = ANY($1)`) for all list/collection endpoints.",
    "Rule 4: Retain Bob AI Autonomous SRE shadow verification on all PRs modifying database access patterns."
  ]
};

export const mockPullRequest = {
  repo: "telemetrypulse-api",
  branch: "fix/orders-n-plus-one",
  baseBranch: "main",
  commitHash: "9e7d4a2",
  prNumber: 247,
  prTitle: "fix(perf): eliminate N+1 database queries on GET /api/orders [INC-504-001]",
  prDescription: `### Summary of Verified Autonomous Refactor
- Replaces 101 sequential queries with a single batched array query \`WHERE order_id = ANY($1)\`.
- O(N) in-memory grouping via \`Map\` lookup table.
- Verified in BobShell isolated sandbox: Latency reduced from 4,800ms to 420ms (-91.2%).
- 24/24 pytest tests passing | 0 SAST vulnerabilities (Bandit/Semgrep verified).

### Governance & Safety Compliance
- [x] Slack SRE Approval logged by Tony (SRE Lead)
- [x] Sandboxed load test verified
- [x] SAST injection check passed
- [x] Auto-deploy explicitly disabled (Human Merge Required)
`
};
