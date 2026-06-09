import * as React from "react";
import {
  Box, Stack, Typography, TextField, IconButton, Tooltip, Chip, ToggleButton, ToggleButtonGroup,
  InputAdornment, MenuItem, Menu, Grid, Paper, LinearProgress, Card,
  Table, TableBody, TableCell, TableHead, TableRow,
} from "@mui/material";
import {
  Search, ViewModule, ViewList, ViewQuilt, Sort, Add, TrendingUp, ShieldOutlined,
  Insights, AccountTreeOutlined, DragIndicator,
} from "@mui/icons-material";
import Masonry from "react-responsive-masonry";
import { Apps, Groups, ModuleApi, useStoreVersion } from "../data/store";
import { AppCard } from "./AppCard";
import { CreateAppDialog } from "./CreateAppDialog";

type View = "tile" | "list" | "group";
type SortKey = "custom" | "name" | "createdAt" | "group";

export function Landing({ onOpenApp }: { onOpenApp: (id: string) => void }) {
  useStoreVersion();
  const [view, setView] = React.useState<View>("tile");
  const [q, setQ] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("custom");
  const [sortAnchor, setSortAnchor] = React.useState<null | HTMLElement>(null);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const apps = Apps.list();
  const groups = Groups.list();
  const modules = ModuleApi.list();
  const moduleMap = new Map(modules.map(m => [m.id, m]));
  const groupMap = new Map(groups.map(g => [g.id, g]));

  const filtered = apps
    .filter(a => {
      if (!q) return true;
      const term = q.toLowerCase();
      const moduleNames = a.modules.map(id => moduleMap.get(id)?.name || "").join(" ").toLowerCase();
      return (
        a.appName.toLowerCase().includes(term) ||
        a.appShortName.toLowerCase().includes(term) ||
        a.tags.join(" ").toLowerCase().includes(term) ||
        moduleNames.includes(term)
      );
    })
    .sort((a, b) => {
      if (sortKey === "custom") return 0;
      if (sortKey === "name") return a.appName.localeCompare(b.appName);
      if (sortKey === "createdAt") return b.createdAt.localeCompare(a.createdAt);
      return (groupMap.get(a.groupId)?.groupName || "").localeCompare(groupMap.get(b.groupId)?.groupName || "");
    });

  // drag reorder
  const dragId = React.useRef<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  function onDragStart(id: string, e?: React.DragEvent) {
    dragId.current = id;
    if (e) { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", id); }
  }
  function onDrop(targetId: string) {
    setDragOverId(null);
    if (!dragId.current || dragId.current === targetId) return;
    setSortKey("custom");
    const allIds = Apps.list().map(a => a.id);
    const from = allIds.indexOf(dragId.current);
    const to = allIds.indexOf(targetId);
    if (from < 0 || to < 0) return;
    allIds.splice(to, 0, allIds.splice(from, 1)[0]);
    Apps.reorder(allIds);
    dragId.current = null;
  }

  const stats = [
    { label: "Total Applications", value: apps.length, icon: <AccountTreeOutlined />, color: "#d71e28", delta: "+12%" },
    { label: "Active Modules", value: 28, icon: <Insights />, color: "#ffcd41", delta: "+4" },
    { label: "Compliance Score", value: "94%", icon: <ShieldOutlined />, color: "#059669", delta: "+1.2%" },
    { label: "Open Risks", value: 142, icon: <TrendingUp />, color: "#2563eb", delta: "-8%" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
{/* Stats */}
      <Grid container spacing={1} sx={{ mb: 1.5 }}>
        {stats.map(s => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 1.25, borderRadius: 1.5, border: 1, borderColor: "divider", height: "100%", bgcolor: "#ffffff", boxShadow: "none" }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 30, height: 30, borderRadius: 1, display: "grid", placeItems: "center", color: s.color, bgcolor: `${s.color}1A`, "& svg": { fontSize: 18 } }}>{s.icon}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>{s.label}</Typography>
                  <Stack direction="row" alignItems="baseline" spacing={0.75}>
                    <Typography sx={{ fontWeight: 400, fontSize: 19, lineHeight: 1 }}>{s.value}</Typography>
                    <Typography sx={{ fontSize: 12, color: s.delta.startsWith("-") ? "error.main" : "success.main" }}>{s.delta}</Typography>
                  </Stack>
                </Box>
              </Stack>
              <LinearProgress variant="determinate" value={60 + (s.label.length % 40)} sx={{ mt: 0.75, height: 3, borderRadius: 3, "& .MuiLinearProgress-bar": { bgcolor: s.color } }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toolbar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} sx={{ mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 400, fontSize: 17 }}>Applications</Typography>
          <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>{filtered.length} of {apps.length} apps</Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <TextField
          placeholder="Search apps, modules, tags…" value={q} onChange={e => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ minWidth: 220 }}
        />
        <ToggleButtonGroup exclusive size="small" value={view} onChange={(_, v) => v && setView(v)}>
          <ToggleButton value="tile"><Tooltip title="Tile view"><ViewModule fontSize="small" /></Tooltip></ToggleButton>
          <ToggleButton value="list"><Tooltip title="List view"><ViewList fontSize="small" /></Tooltip></ToggleButton>
          <ToggleButton value="group"><Tooltip title="Group view"><ViewQuilt fontSize="small" /></Tooltip></ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title="Sort">
          <IconButton onClick={e => setSortAnchor(e.currentTarget)}><Sort /></IconButton>
        </Tooltip>
        <Menu anchorEl={sortAnchor} open={!!sortAnchor} onClose={() => setSortAnchor(null)}>
          {(["custom", "name", "createdAt", "group"] as SortKey[]).map(k => (
            <MenuItem key={k} selected={sortKey === k} onClick={() => { setSortKey(k); setSortAnchor(null); }}>
              {k === "custom" ? "Custom (drag order)" : k === "createdAt" ? "Newest first" : k === "name" ? "Name (A→Z)" : "Group"}
            </MenuItem>
          ))}
        </Menu>
        <Tooltip title="Create new application">
          <IconButton onClick={() => setOpenCreate(true)}
            sx={{ background: (t) => `linear-gradient(135deg,${t.palette.primary.main},${t.palette.primary.dark})`, color: "#fff", p: 0.75, "&:hover": { opacity: 0.92 } }}>
            <Add sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {view === "tile" && (
        <Grid container spacing={1}>
          {filtered.map(a => (
            <Grid key={a.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: "flex" }}>
              <AppCard app={a} group={groupMap.get(a.groupId)} onOpen={onOpenApp}
                onEdit={(id) => { setEditingId(id); setOpenCreate(true); }}
                draggable onDragStart={(e) => onDragStart(a.id, e)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(a.id)} />
            </Grid>
          ))}
        </Grid>
      )}

      {view === "list" && (
        <Card sx={{ borderRadius: 1, border: 1, borderColor: "divider", boxShadow: "none" }}>
          <Table size="small" sx={{
            borderCollapse: "separate",
            borderSpacing: "0 2px",
            "& .MuiTableCell-root": { py: 0.25, fontSize: 14, borderBottom: "1px solid", borderColor: "divider" },
            "& .MuiTableCell-head": { py: 0.5 },
          }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell>App</TableCell><TableCell>Group</TableCell><TableCell>Tags</TableCell>
                <TableCell>Modules</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(a => (
                <TableRow
                  key={a.id}
                  hover
                  draggable
                  onDragStart={(e) => onDragStart(a.id, e)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverId(a.id); }}
                  onDragLeave={() => setDragOverId(prev => prev === a.id ? null : prev)}
                  onDrop={() => onDrop(a.id)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: dragOverId === a.id ? "action.hover" : "background.paper",
                  }}
                  onClick={() => onOpenApp(a.id)}
                >
                  <TableCell sx={{ borderLeft: `2px solid ${a.accentColor} !important` }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ cursor: "grab", color: "text.disabled", display: "flex" }}
                        onMouseDown={(e) => e.stopPropagation()}>
                        <DragIndicator sx={{ fontSize: 16 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 400, fontSize: 15 }}>{a.appName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="caption">{groupMap.get(a.groupId)?.groupName}</Typography></TableCell>
                  <TableCell><Stack direction="row" spacing={0.5}>{a.tags.map(t => <Chip key={t} label={t} size="small" sx={{ height: 18, fontSize: 12 }} />)}</Stack></TableCell>
                  <TableCell>{a.modules.length}</TableCell>
                  <TableCell><Chip size="small" label={a.active ? "Active" : "Inactive"} color={a.active ? "success" : "default"} variant="outlined" /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onOpenApp(a.id); }}><Search fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {view === "group" && (
        <Masonry columnsCount={3} gutter="0px">
          {groups.map(g => {
            const items = filtered.filter(a => a.groupId === g.id);
            if (!items.length) return null as any;
            return (
              <Box key={g.id} sx={{ p: 0.5, width: "100%" }}>
                <Box sx={{ border: 1, borderColor: "divider", borderLeft: `2px solid ${g.color}`, borderRadius: 1.5, p: 1, bgcolor: "background.paper" }}>
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75, px: 0.25 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: g.color }} />
                    <Typography sx={{ fontWeight: 400, fontSize: 15 }}>{g.groupName}</Typography>
                    <Chip label={items.length} size="small" sx={{ height: 16, fontSize: 12 }} />
                  </Stack>
                  <Stack spacing={0.5} sx={{ "& > *": { display: "flex" } }}>
                    {items.map(a => (
                      <AppCard
                        key={a.id} app={a} group={g} onOpen={onOpenApp}
                        onEdit={(id) => { setEditingId(id); setOpenCreate(true); }}
                        draggable
                        onDragStart={(e) => onDragStart(a.id, e)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop(a.id)}
                        compact
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Masonry>
      )}

      <CreateAppDialog open={openCreate} editingId={editingId} onClose={() => { setOpenCreate(false); setEditingId(null); }} onCreated={() => {}} />
    </Box>
  );
}
