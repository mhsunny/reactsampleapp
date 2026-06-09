import * as React from "react";
import { Apps, useStoreVersion } from "../data/store";
import { AppShell } from "./AppShell";
import { DataGrid } from "./DataGrid";
import { RiskInventoryDashboard } from "./apps/RiskInventoryDashboard";
import { PlatformConfig } from "./apps/PlatformConfig";
import { Box, Typography, Card, Stack } from "@mui/material";

export function AppRouter({ appId, onHome, onOpenApp }: { appId: string; onHome: () => void; onOpenApp: (id: string) => void }) {
  useStoreVersion();
  const [activeModule, setActiveModule] = React.useState("Dashboard");
  const app = Apps.get(appId);
  React.useEffect(() => setActiveModule("Dashboard"), [appId]);
  if (!app) return null;

  return (
    <AppShell appId={appId} onHome={onHome} onOpenApp={onOpenApp}
      activeModule={activeModule} onChangeModule={setActiveModule}>
      <Content appId={appId} module={activeModule} />
    </AppShell>
  );
}

function Content({ appId, module }: { appId: string; module: string }) {
  if (module === "Dashboard") {
    if (appId === "a-rim") return <RiskInventoryDashboard />;
    if (appId === "a-pc") return <PlatformConfig />;
    return <GenericDashboard appId={appId} />;
  }
  if (appId === "a-pc" && ["Modules", "API Connectors", "Email Notifications", "Batch Jobs", "Logging Levels", "Workflow Designer", "Users", "Permissions", "Entitlements", "Profiles"].includes(module)) {
    return <PlatformConfig />;
  }
  return <DataGrid appId={appId} moduleName={module} />;
}

function GenericDashboard({ appId }: { appId: string }) {
  const app = Apps.get(appId)!;
  const stats = [
    { label: "Total Records", value: "1,284", color: "#d71e28" },
    { label: "Open Items", value: "184", color: "#ffcd41" },
    { label: "This Month", value: "+12.6%", color: "#2563eb" },
    { label: "Compliance", value: "94%", color: "#059669" },
  ];
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 400 }}>{app.appName} Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">{app.description}</Typography>
      </Box>
      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        {stats.map(s => (
          <Card key={s.label} sx={{ p: 2, flex: "1 1 200px", borderRadius: 2, border: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 24, color: s.color }}>{s.value}</Typography>
          </Card>
        ))}
      </Stack>
      <Card sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
          This application is configured. Use the chip navigation above to access modules with full CRUD capabilities.
          Use the sidebar for app-level navigation.
        </Typography>
      </Card>
    </Stack>
  );
}
