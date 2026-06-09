import * as React from "react";
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack,
  Breadcrumbs, Link, Tabs, Tab, IconButton, Tooltip, Divider, Collapse,
} from "@mui/material";
import {
  Dashboard, ChevronLeft, ChevronRight, Assessment, Settings as SettingsIcon, Home,
  AccountTree, GppGood, Inventory2, Rule, Policy, FactCheck, Business, LibraryBooks,
  Warning, Insights, ManageAccounts, Hub, BugReport, MonitorHeart, Quiz, Notifications,
  Schedule, BarChart, Tune, Email, IntegrationInstructions, SmartToy, Storage, Bookmarks,
  AdminPanelSettings, Apps as AppsIcon, ExpandLess, ExpandMore, Mail,
} from "@mui/icons-material";
import { Apps, ModuleApi, useStoreVersion } from "../data/store";
import { RIM_MODULES } from "../data/defaults";

export function AppShell({
  appId, onHome, onOpenApp,
  children, activeModule, onChangeModule,
}: {
  appId: string;
  onHome: () => void;
  onOpenApp: (id: string) => void;
  children: React.ReactNode;
  activeModule: string;
  onChangeModule: (m: string) => void;
}) {
  useStoreVersion();
  const app = Apps.get(appId)!;
  const allApps = Apps.list();
  const modules = ModuleApi.list();
  const [collapsed, setCollapsed] = React.useState(false);

  const sharedModuleNames = app.modules.map(id => modules.find(m => m.id === id)?.name).filter(Boolean) as string[];
  const rimExtras = appId === "a-rim" ? RIM_MODULES.filter(m => !["Dashboard"].includes(m)) : [];
  const moduleLinks = Array.from(new Set([...rimExtras, ...sharedModuleNames]));

  const MODULE_ICONS: Record<string, React.ReactNode> = {
    "Dashboard": <Dashboard fontSize="small" />,
    "Reports": <Assessment fontSize="small" />,
    "Settings": <SettingsIcon fontSize="small" />,
    "RAUs": <AccountTree fontSize="small" />,
    "Risks": <Warning fontSize="small" />,
    "Controls": <GppGood fontSize="small" />,
    "Controls Library": <LibraryBooks fontSize="small" />,
    "MCRs": <Rule fontSize="small" />,
    "MREs": <BugReport fontSize="small" />,
    "FRCs": <FactCheck fontSize="small" />,
    "Business Units": <Business fontSize="small" />,
    "Policies": <Policy fontSize="small" />,
    "Risk Measures": <Insights fontSize="small" />,
    "Risk Events": <Notifications fontSize="small" />,
    "Risk Assessments": <Quiz fontSize="small" />,
    "Risk Monitoring": <MonitorHeart fontSize="small" />,
    "Inventory": <Inventory2 fontSize="small" />,
    "Users": <ManageAccounts fontSize="small" />,
    "Permissions": <ManageAccounts fontSize="small" />,
    "Modules": <Bookmarks fontSize="small" />,
    "API Connectors": <IntegrationInstructions fontSize="small" />,
    "Chatbot MCP": <SmartToy fontSize="small" />,
    "MCP APIs": <Hub fontSize="small" />,
    "Email Notifications": <Email fontSize="small" />,
    "Batch Jobs": <Schedule fontSize="small" />,
    "Batch Jobs & Scheduling": <Schedule fontSize="small" />,
    "Logging Levels": <Tune fontSize="small" />,
    "Form Feedback": <BarChart fontSize="small" />,
    "Workflow Designer": <AccountTree fontSize="small" />,
    "User and Access Management": <ManageAccounts fontSize="small" />,
    "Platform Configurations": <SettingsIcon fontSize="small" />,
    "Records": <Storage fontSize="small" />,
  };
  const iconFor = (name: string) => MODULE_ICONS[name] || <Hub fontSize="small" />;

  type SidebarItem = { name: string; icon: React.ReactNode; children?: { name: string; icon: React.ReactNode }[] };
  const sidebar: SidebarItem[] = [
    { name: "Dashboard", icon: iconFor("Dashboard") },
    { name: "Settings", icon: iconFor("Settings") },
    { name: "Reports", icon: iconFor("Reports") },
    {
      name: "Administration",
      icon: <AdminPanelSettings fontSize="small" />,
      children: [
        { name: "User Management", icon: <ManageAccounts fontSize="small" /> },
        { name: "My Tasks / Messages", icon: <Mail fontSize="small" /> },
        { name: "Notifications", icon: <Notifications fontSize="small" /> },
      ],
    },
    {
      name: "Modules",
      icon: <AppsIcon fontSize="small" />,
      children: moduleLinks.map(m => ({ name: m, icon: iconFor(m) })),
    },
  ];
  const [openParents, setOpenParents] = React.useState<Record<string, boolean>>({ Administration: true, Modules: true });

  const width = collapsed ? 64 : 256;

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <Box sx={{
        width, flexShrink: 0,
        borderRight: 1, borderColor: "divider",
        bgcolor: "background.paper",
        transition: "width .2s ease",
      }}>
        <Stack direction="row" alignItems="center" sx={{ p: 1.25, justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && <Typography variant="overline" color="text.secondary">{app.appShortName}</Typography>}
          <IconButton size="small" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
          </IconButton>
        </Stack>
        <Divider />
        <List dense sx={{ py: 0.5 }}>
          {sidebar.map(item => {
            const hasChildren = !!item.children?.length;
            const open = !!openParents[item.name];
            return (
              <React.Fragment key={item.name}>
                <ListItemButton
                  selected={!hasChildren && activeModule === item.name}
                  onClick={() => hasChildren
                    ? setOpenParents(p => ({ ...p, [item.name]: !open }))
                    : onChangeModule(item.name)
                  }
                  sx={{ borderRadius: 1.5, mx: 0.75, my: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.name} primaryTypographyProps={{ fontSize: 15, fontWeight: hasChildren ? 500 : 400 }} />}
                  {!collapsed && hasChildren && (open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
                </ListItemButton>
                {hasChildren && !collapsed && (
                  <Collapse in={open} unmountOnExit>
                    {item.children!.map(c => (
                      <ListItemButton key={c.name}
                        selected={activeModule === c.name}
                        onClick={() => onChangeModule(c.name)}
                        sx={{ borderRadius: 1.5, mx: 0.75, my: 0.25, pl: 4 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>{c.icon}</ListItemIcon>
                        <ListItemText primary={c.name} primaryTypographyProps={{ fontSize: 14, fontWeight: 400 }} />
                      </ListItemButton>
                    ))}
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* App nav tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper", px: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="ERC Ecosystem Home">
              <IconButton size="small" onClick={onHome}><Home fontSize="small" /></IconButton>
            </Tooltip>
            <Tabs value={appId} onChange={(_, v) => v && onOpenApp(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 44 }}>
              {allApps.map(a => (
                <Tab key={a.id} value={a.id}
                  icon={<Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: a.accentColor }} />}
                  iconPosition="start"
                  label={a.appShortName}
                  sx={{ minHeight: 44, textTransform: "none", fontSize: 14.5, gap: 0.75 }}
                />
              ))}
            </Tabs>
          </Stack>
        </Box>

        {/* Breadcrumb */}
        <Box sx={{ px: 2, py: 1, bgcolor: "background.default" }}>
          <Breadcrumbs separator="›" sx={{ fontSize: 14.5 }}>
            <Link component="button" underline="hover" color="inherit" onClick={onHome}>ERC Ecosystem</Link>
            <Link component="button" underline="hover" color="inherit" onClick={() => onChangeModule("Dashboard")}>{app.appName}</Link>
            <Typography sx={{ fontSize: 14.5, color: "text.primary", fontWeight: 400 }}>{activeModule}</Typography>
          </Breadcrumbs>
        </Box>

{/* Content */}
        <Box sx={{ p: 2, flex: 1, minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
