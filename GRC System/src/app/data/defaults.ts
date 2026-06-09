export type Module = {
  id: string;
  name: string;
  category: string;
  active: boolean;
  description?: string;
};

export type App = {
  id: string;
  appName: string;
  appShortName: string;
  description: string;
  groupId: string;
  accentColor: string;
  tags: string[];
  active: boolean;
  modules: string[]; // module ids
  icon?: string;
  createdAt: string;
};

export type Group = {
  id: string;
  groupName: string;
  color: string;
};

export const DEFAULT_GROUPS: Group[] = [
  { id: "g-nfr", groupName: "Non-Financial Risk Management", color: "#d71e28" },
  { id: "g-audit", groupName: "Internal Audit Management", color: "#2563eb" },
  { id: "g-test", groupName: "Testing and Monitoring", color: "#059669" },
  { id: "g-common", groupName: "Common Business Capabilities", color: "#7c3aed" },
  { id: "g-config", groupName: "Configuration Capabilities", color: "#ea580c" },
];

export const DEFAULT_MODULES: Module[] = [
  "Integrated Surveillance Oversight Tool (ISOT)",
  "Case Manager System",
  "Arch. Lifecycle Status",
  "Surveillance Oversight & Monitoring (OHM)",
  "Multi-Source Data Ingestion",
  "Data Standardization & Normalization",
  "Data Definition & Lineage Mgmt.",
  "Data Authoring, Evaluation & Governance",
  "Rules Case & Workflow Orchestration",
  "Event Driven Documentation & Evidence",
  "Decision & Disclosure Assembly",
  "Reporting & Submission Integration",
  "External Submissions & Integration",
  "Access, Entitlements & Designation Management",
  "Regulatory & Policy Reference Management",
  "Auditability & Historical Records",
  "Compliance Hub",
  "Attestation",
  "Personal Trade Preclearance",
  "Enterprise Registration System",
  "Global Preclearance System",
  "Compliance Website",
  "Compliance Supervisory Control System",
  "Licensing Workflow",
  "Reg Change",
  "Reg Monitoring & Alerts Ingestions",
  "Restricted List Mgmt",
  "Advertisement Reviews",
  "Reg Inventory Management",
  "Trade Surveillance Exception Detection",
  "Surveillance Data Quality Control",
  "Compliance Oversight Management",
  "Employee Conduct, Conflict & Attestation Mgmt",
].map((name, i) => ({
  id: `m-${i + 1}`,
  name,
  category: i < 16 ? "Surveillance & Data" : i < 24 ? "Compliance" : "Risk & Regulatory",
  active: i % 7 !== 0,
  description: `${name} module - shared platform capability.`,
}));

export const DEFAULT_APPS: App[] = [
  {
    id: "a-rim",
    appName: "Risk Inventory Management",
    appShortName: "Risk Inventory",
    description: "Manage FRCs, controls, RAUs, and MREs.",
    groupId: "g-nfr",
    accentColor: "#d71e28",
    tags: ["FRC", "RAU", "MRE"],
    active: true,
    modules: ["m-1", "m-2", "m-17"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-rmm",
    appName: "Risk Measures Management",
    appShortName: "Risk Measures",
    description: "Define risk measures, KRIs, risk appetite, and governance actions.",
    groupId: "g-nfr",
    accentColor: "#d71e28",
    tags: ["KRI", "Appetite"],
    active: true,
    modules: ["m-9", "m-15"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-rem",
    appName: "Risk Events Management",
    appShortName: "Risk Events",
    description: "Manage loss events, incidents, issues, and regulatory events.",
    groupId: "g-nfr",
    accentColor: "#d71e28",
    tags: ["Incidents", "Loss"],
    active: true,
    modules: ["m-10", "m-16"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-ram",
    appName: "Risk Assessments Management",
    appShortName: "Risk Assessments",
    description: "Run operational risk, RCSA, technology, and compliance assessments.",
    groupId: "g-nfr",
    accentColor: "#d71e28",
    tags: ["RCSA", "Operational"],
    active: true,
    modules: ["m-9", "m-17"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-crm",
    appName: "Compliance Risk Management",
    appShortName: "Compliance Risk",
    description: "Manage regulatory obligations, attestations, and breaches.",
    groupId: "g-nfr",
    accentColor: "#d71e28",
    tags: ["Regulatory"],
    active: true,
    modules: ["m-17", "m-18", "m-25"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-ia",
    appName: "Internal Audit",
    appShortName: "Internal Audit",
    description: "Annual planning, fieldwork, issue management, and reporting.",
    groupId: "g-audit",
    accentColor: "#2563eb",
    tags: ["Audit"],
    active: true,
    modules: ["m-16"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-test",
    appName: "Testing",
    appShortName: "Testing",
    description: "Second-line testing lifecycle from planning through review.",
    groupId: "g-test",
    accentColor: "#059669",
    tags: ["Testing"],
    active: true,
    modules: ["m-9"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-rmo",
    appName: "Risk Monitoring and Oversight",
    appShortName: "Risk Oversight",
    description: "QA/QC monitoring, oversight routines, exception management.",
    groupId: "g-test",
    accentColor: "#059669",
    tags: ["QA", "Oversight"],
    active: true,
    modules: ["m-4"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-cap",
    appName: "Capacity Planning and Time Reporting",
    appShortName: "Capacity Planning",
    description: "Effort, utilization, time submissions, and reporting periods.",
    groupId: "g-common",
    accentColor: "#7c3aed",
    tags: ["Capacity"],
    active: true,
    modules: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-plm",
    appName: "Prompt Lifecycle Management",
    appShortName: "Prompt Mgmt",
    description: "AI prompt authoring, workflow routing, approvals, versioning.",
    groupId: "g-common",
    accentColor: "#7c3aed",
    tags: ["AI", "Prompts"],
    active: true,
    modules: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-wfd",
    appName: "Workflow Designer",
    appShortName: "Workflow Mgmt",
    description: "Design, version, and monitor enterprise workflows.",
    groupId: "g-config",
    accentColor: "#ea580c",
    tags: ["Workflow"],
    active: true,
    modules: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-uam",
    appName: "User and Access Management",
    appShortName: "User Mgmt",
    description: "Users, profiles, groups, mappings, and authorizations.",
    groupId: "g-config",
    accentColor: "#ea580c",
    tags: ["IAM"],
    active: true,
    modules: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-pc",
    appName: "Platform Configurations",
    appShortName: "Platform Config",
    description: "API connectors, notifications, batch jobs, logging controls.",
    groupId: "g-config",
    accentColor: "#ea580c",
    tags: ["Platform"],
    active: true,
    modules: [],
    createdAt: new Date().toISOString(),
  },
];

// Risk Inventory module data (seeded)
export const RIM_MODULES = [
  "Dashboard", "RAUs", "Risks", "Controls", "MCRs", "FRCs",
  "Controls Library", "MREs", "Business Units", "Policies",
];

export function seedRecords(moduleName: string, count = 24) {
  const owners = ["A. Mehta", "J. Park", "S. Khan", "L. Chen", "R. Patel", "M. Diaz"];
  const statuses = ["Active", "Under Review", "Approved", "Draft", "Retired"];
  const risks = ["Low", "Medium", "High", "Critical"];
  return Array.from({ length: count }).map((_, i) => ({
    id: `${moduleName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${1000 + i}`,
    name: `${moduleName.replace(/s$/, "")} ${1000 + i}`,
    owner: owners[i % owners.length],
    status: statuses[i % statuses.length],
    risk: risks[i % risks.length],
    bu: `BU-${(i % 8) + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    updatedAt: new Date(Date.now() - (i % 5) * 86400000).toISOString().slice(0, 10),
  }));
}
