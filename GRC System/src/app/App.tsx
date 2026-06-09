import * as React from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { Header } from "./components/Header";
import { Landing } from "./components/Landing";
import { AppRouter } from "./components/AppRouter";
import { Apps, useStoreVersion } from "./data/store";
import "../styles/fonts.css";

export default function App() {
  const [mode, setMode] = React.useState<"light" | "dark">(() => (localStorage.getItem("grc.theme") as any) || "light");
  const [openAppId, setOpenAppId] = React.useState<string | null>(null);
  useStoreVersion();

  React.useEffect(() => { localStorage.setItem("grc.theme", mode); }, [mode]);

  const app = openAppId ? Apps.get(openAppId) : null;
  const subtitle = app
    ? `A total solution of ${app.appName.replace(/ Management$/, "").toLowerCase()}`
    : "A total solution of Governance, Risk & Compliance";

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <Header
          mode={mode}
          onToggleMode={() => setMode(m => m === "light" ? "dark" : "light")}
          appName={app?.appName}
          subtitle={subtitle}
        />
        {openAppId ? (
          <AppRouter appId={openAppId} onHome={() => setOpenAppId(null)} onOpenApp={setOpenAppId} />
        ) : (
          <Landing onOpenApp={setOpenAppId} />
        )}
      </Box>
    </ThemeProvider>
  );
}
