import * as React from "react";
import { Card, CardContent, Stack, Typography, Box, IconButton, Chip, Tooltip, Menu, MenuItem } from "@mui/material";
import { MoreVert, Edit, Delete, Settings, OpenInNew, Apps as AppsIcon, DragIndicator } from "@mui/icons-material";
import { App, Group } from "../data/defaults";
import { Apps, ModuleApi } from "../data/store";

export function AppCard({ app, group, onOpen, onEdit, draggable, onDragStart, onDragOver, onDrop, compact }: {
  app: App; group?: Group; onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  draggable?: boolean; compact?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const modules = ModuleApi.list();
  const activeMods = app.modules.map(id => modules.find(m => m.id === id)).filter(Boolean);
  return (
    <Card
      elevation={0}
      draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
      sx={{
        position: "relative", borderRadius: 1.5,
        width: "100%", display: "flex", flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderLeft: compact ? undefined : `1px solid ${app.accentColor}`,
        background: (t) => t.palette.mode === "light" ? "#ffffff" : "rgba(255,255,255,0.03)",
        boxShadow: "none",
        transition: "all .15s ease",
        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderColor: app.accentColor },
        cursor: "pointer",
      }}
      onClick={() => onOpen(app.id)}
    >
      <CardContent sx={{ p: compact ? 1.25 : 1.5, "&:last-child": { pb: compact ? 1.25 : 1.5 }, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              draggable={draggable}
              onDragStart={onDragStart}
              sx={{
                width: compact ? 28 : 34, height: compact ? 28 : 34, borderRadius: 1, display: "grid", placeItems: "center",
                background: `${app.accentColor}1A`, color: app.accentColor, flexShrink: 0,
                cursor: draggable ? "grab" : "default",
                "&:active": { cursor: draggable ? "grabbing" : "default" },
              }}
            >
              <AppsIcon sx={{ fontSize: compact ? 16 : 18 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }} noWrap>{app.appName}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.25}>
            {draggable && <Tooltip title="Drag"><IconButton size="small" sx={{ cursor: "grab", p: 0.25 }}><DragIndicator sx={{ fontSize: 16 }} /></IconButton></Tooltip>}
            <Tooltip title="Open"><IconButton size="small" sx={{ p: 0.25 }} onClick={(e) => { e.stopPropagation(); onOpen(app.id); }}><OpenInNew sx={{ fontSize: 16 }} /></IconButton></Tooltip>
            <Tooltip title="More"><IconButton size="small" sx={{ p: 0.25 }} onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget); }}><MoreVert sx={{ fontSize: 16 }} /></IconButton></Tooltip>
          </Stack>
        </Stack>

        {!compact && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontSize: 13.5, minHeight: 28,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {app.description}
          </Typography>
        )}

<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto", pt: 0.75 }}>
          <Chip size="small" label={app.active ? "Active" : "Inactive"} color={app.active ? "success" : "default"} variant="outlined" sx={{ height: 18, fontSize: 11.5 }} />
          <Typography sx={{ fontSize: 12, color: "text.secondary" }} noWrap>{group?.groupName}</Typography>
        </Stack>
      </CardContent>

      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={() => { onOpen(app.id); setAnchor(null); }}><OpenInNew fontSize="small" sx={{ mr: 1 }} /> Open</MenuItem>
        <MenuItem onClick={() => setAnchor(null)}><Settings fontSize="small" sx={{ mr: 1 }} /> Configure</MenuItem>
        <MenuItem onClick={() => { onEdit?.(app.id); setAnchor(null); }}><Edit fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={() => { Apps.update(app.id, { active: !app.active }); setAnchor(null); }}>
          {app.active ? "Deactivate" : "Activate"}
        </MenuItem>
        <MenuItem onClick={() => { Apps.remove(app.id); setAnchor(null); }} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
