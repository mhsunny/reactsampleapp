import * as React from "react";
import {
  Stack, Tabs, Tab, Grid, Card, Typography, Box, Chip, IconButton, Tooltip,
  TextField, InputAdornment, Button, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Switch, FormControlLabel,
  ToggleButtonGroup, ToggleButton,
} from "@mui/material";
import {
  Search, Add, Download, FilterAlt, ViewModule, ViewList, Settings, Edit, Delete,
  TrendingUp, BoltOutlined, BugReportOutlined, ApiOutlined,
} from "@mui/icons-material";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip } from "recharts";
import { ModuleApi, useStoreVersion } from "../../data/store";
import { Module } from "../../data/defaults";

const TABS = ["Dashboard", "Modules", "API Connectors", "Chatbot MCP", "MCP APIs", "Email Notifications", "Batch Jobs & Scheduling", "Logging Levels", "Form Feedback"];

export function PlatformConfig() {
  const [tab, setTab] = React.useState(0);
  return (
    <Stack spacing={2}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
        {TABS.map(t => <Tab key={t} label={t} sx={{ textTransform: "none" }} />)}
      </Tabs>
      {tab === 0 && <ConfigDashboard />}
      {tab === 1 && <ModulesCrud />}
      {tab > 1 && <GenericCrud title={TABS[tab]} />}
    </Stack>
  );
}

function ConfigDashboard() {
  const data = Array.from({ length: 12 }).map((_, i) => ({ name: `M${i + 1}`, value: 40 + Math.round(Math.random() * 60) }));
  const cards = [
    { title: "API Connector Connectivity", stat: "98.4%", delta: "+0.3%", color: "#d71e28", icon: <ApiOutlined /> },
    { title: "Batch Job Readiness", stat: "112", delta: "+8", color: "#ffcd41", icon: <BoltOutlined /> },
    { title: "Error Logging Coverage", stat: "87%", delta: "+1.1%", color: "#2563eb", icon: <BugReportOutlined /> },
    { title: "Configurable Object Count", stat: "1,284", delta: "+24", color: "#059669", icon: <TrendingUp /> },
  ];
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <ToggleButtonGroup exclusive size="small" value="tile">
          <ToggleButton value="tile"><ViewModule fontSize="small" /></ToggleButton>
          <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Grid container spacing={1.5}>
        {cards.map((c, i) => (
          <Grid key={c.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ p: 2, borderRadius: 2, border: 1, borderColor: "divider", height: "100%" }}>
              <Stack direction="row" justifyContent="space-between">
                <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: `${c.color}1A`, color: c.color, display: "grid", placeItems: "center" }}>{c.icon}</Box>
                <Tooltip title="Download"><IconButton size="small"><Download fontSize="small" /></IconButton></Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.25, display: "block" }}>{c.title}</Typography>
              <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography sx={{ fontWeight: 500, fontSize: 22, color: c.color }}>{c.stat}</Typography>
                <Chip label={c.delta} size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: 12 }} />
              </Stack>
              <Box sx={{ height: 70, mt: 1 }}>
                <ResponsiveContainer>
                  {i % 2 === 0 ? (
                    <AreaChart data={data}>
                      <defs><linearGradient id={`pc-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c.color} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={c.color} stopOpacity={0.05} />
                      </linearGradient></defs>
                      <XAxis dataKey="name" hide /><YAxis hide /><RTooltip />
                      <Area dataKey="value" stroke={c.color} fill={`url(#pc-${i})`} strokeWidth={2} />
                    </AreaChart>
                  ) : (
                    <BarChart data={data}>
                      <XAxis dataKey="name" hide /><YAxis hide /><RTooltip />
                      <Bar dataKey="value" fill={c.color} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

function ModulesCrud() {
  useStoreVersion();
  const all = ModuleApi.list();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [activeOnly, setActiveOnly] = React.useState(false);
  const [view, setView] = React.useState<"list" | "tile">("list");
  const [edit, setEdit] = React.useState<Partial<Module> | null>(null);
  const cats = ["All", ...Array.from(new Set(all.map(m => m.category)))];

  const filtered = all
    .filter(m => !q || m.name.toLowerCase().includes(q.toLowerCase()))
    .filter(m => cat === "All" || m.category === cat)
    .filter(m => !activeOnly || m.active);

  function save() {
    if (!edit || !edit.name) return;
    if (edit.id) ModuleApi.update(edit.id, edit);
    else ModuleApi.create({ name: edit.name!, category: edit.category || "General", active: edit.active ?? true, description: edit.description });
    setEdit(null);
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>Modules <Typography component="span" variant="caption" color="text.secondary">({filtered.length})</Typography></Typography>
        <Box sx={{ flex: 1 }} />
        <TextField placeholder="Search modules…" value={q} onChange={e => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ minWidth: 240 }} />
        <TextField select value={cat} onChange={e => setCat(e.target.value)} size="small" sx={{ minWidth: 180 }}>
          {cats.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <FormControlLabel control={<Switch checked={activeOnly} onChange={e => setActiveOnly(e.target.checked)} />} label="Active only" />
        <ToggleButtonGroup exclusive size="small" value={view} onChange={(_, v) => v && setView(v)}>
          <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
          <ToggleButton value="tile"><ViewModule fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title="Filters"><IconButton><FilterAlt /></IconButton></Tooltip>
        <Tooltip title="Column settings"><IconButton><Settings /></IconButton></Tooltip>
        <Tooltip title="Download"><IconButton><Download /></IconButton></Tooltip>
        <Tooltip title="Add module">
          <IconButton onClick={() => setEdit({ name: "", category: "General", active: true })}
            sx={{ background: (t) => `linear-gradient(135deg,${t.palette.primary.main},${t.palette.primary.dark})`, color: "#fff", "&:hover": { opacity: 0.92 } }}>
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>

      {view === "list" ? (
        <Card sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
          <Table size="small">
            <TableHead><TableRow sx={{ bgcolor: "action.hover" }}>
              <TableCell>Name</TableCell><TableCell>Category</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 400, fontSize: 15 }}>{m.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{m.description}</Typography>
                  </TableCell>
                  <TableCell><Chip label={m.category} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Chip label={m.active ? "Active" : "Inactive"} size="small" color={m.active ? "success" : "default"} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => ModuleApi.update(m.id, { active: !m.active })}><Switch checked={m.active} size="small" /></IconButton>
                    <IconButton size="small" onClick={() => setEdit(m)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => ModuleApi.remove(m.id)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Grid container spacing={1.5}>
          {filtered.map(m => (
            <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{ p: 1.5, borderRadius: 2, border: 1, borderColor: "divider", height: "100%" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Chip label={m.category} size="small" variant="outlined" />
                  <Chip label={m.active ? "Active" : "Inactive"} size="small" color={m.active ? "success" : "default"} variant="outlined" />
                </Stack>
                <Typography sx={{ fontWeight: 400, mt: 1, fontSize: 15 }}>{m.name}</Typography>
                <Typography variant="caption" color="text.secondary">{m.description}</Typography>
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                  <IconButton size="small" onClick={() => setEdit(m)}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => ModuleApi.remove(m.id)}><Delete fontSize="small" /></IconButton>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{edit?.id ? "Edit module" : "Add module"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={edit?.name || ""} onChange={e => setEdit({ ...edit, name: e.target.value })} />
            <TextField label="Category" value={edit?.category || ""} onChange={e => setEdit({ ...edit, category: e.target.value })} />
            <TextField label="Description" multiline minRows={2} value={edit?.description || ""} onChange={e => setEdit({ ...edit, description: e.target.value })} />
            <FormControlLabel control={<Switch checked={edit?.active ?? true} onChange={e => setEdit({ ...edit, active: e.target.checked })} />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function GenericCrud({ title }: { title: string }) {
  const [rows, setRows] = React.useState(() => Array.from({ length: 12 }).map((_, i) => ({
    id: `r-${i}`, name: `${title} #${1000 + i}`, env: ["DEV", "UAT", "PROD"][i % 3], status: ["OK", "Warning", "Error"][i % 3], updatedAt: new Date().toISOString().slice(0, 10),
  })));
  const [q, setQ] = React.useState("");
  const filtered = rows.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 400 }}>{title}</Typography>
        <Box sx={{ flex: 1 }} />
        <TextField placeholder={`Search ${title}…`} value={q} onChange={e => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ minWidth: 240 }} />
        <Tooltip title="Add"><IconButton color="primary" onClick={() => setRows([{ id: `r-${Date.now()}`, name: `${title} new`, env: "DEV", status: "OK", updatedAt: new Date().toISOString().slice(0, 10) }, ...rows])}><Add /></IconButton></Tooltip>
      </Stack>
      <Card sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
        <Table size="small">
          <TableHead><TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell>Name</TableCell><TableCell>Environment</TableCell><TableCell>Status</TableCell><TableCell>Updated</TableCell><TableCell align="right">Actions</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.name}</TableCell>
                <TableCell><Chip label={r.env} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={r.status} size="small" color={r.status === "OK" ? "success" : r.status === "Warning" ? "warning" : "error"} variant="outlined" /></TableCell>
                <TableCell>{r.updatedAt}</TableCell>
                <TableCell align="right">
                  <IconButton size="small"><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => setRows(rows.filter(x => x.id !== r.id))}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}
