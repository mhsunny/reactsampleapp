import * as React from "react";
import { AppBar, Toolbar, IconButton, Tooltip, Stack, Avatar, Badge, Box } from "@mui/material";
import { DarkMode, LightMode, Notifications, Settings, RestartAlt, HelpOutline } from "@mui/icons-material";
import { WFLogo } from "./WFLogo";
import { resetDemoData } from "../data/store";

export function Header({
  mode, onToggleMode, appName, subtitle,
}: { mode: "light" | "dark"; onToggleMode: () => void; appName?: string; subtitle?: string }) {
  return (
    <AppBar position="sticky" elevation={0}
      sx={{
        bgcolor: "#d71e28",
        backgroundImage: "none",
        color: "#fff",
        borderBottom: "4px solid #ffcd41",
      }}>
      <Toolbar sx={{ minHeight: 64, gap: 2 }}>
        <WFLogo appName={appName} subtitle={subtitle} />
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={0.5} sx={{ color: "#fff" }}>
          <Tooltip title="Reset demo data">
            <IconButton size="small" onClick={() => { resetDemoData(); }} sx={{ color: "#fff" }}><RestartAlt /></IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton size="small" sx={{ color: "#fff" }}><HelpOutline /></IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: "#fff" }}>
              <Badge badgeContent={4} sx={{ "& .MuiBadge-badge": { bgcolor: "#ffcd41", color: "#1a1a1a" } }}><Notifications /></Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
            <IconButton size="small" onClick={onToggleMode} sx={{ color: "#fff" }}>
              {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings"><IconButton size="small" sx={{ color: "#fff" }}><Settings /></IconButton></Tooltip>
          <Tooltip title="Hasan Mahamudul">
            <Avatar sx={{ width: 34, height: 34, ml: 0.5, bgcolor: "#ffcd41", color: "#1a1a1a", fontSize: 15, fontWeight: 500 }}>HM</Avatar>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
