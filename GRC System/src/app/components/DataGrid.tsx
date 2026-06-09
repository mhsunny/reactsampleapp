import * as React from "react";
import {
  Box, Stack, TextField, IconButton, Tooltip, Chip, ToggleButtonGroup, ToggleButton,
  InputAdornment, Card, Table, TableBody, TableCell, TableHead, TableRow, Pagination,
  Menu, MenuItem, Checkbox, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Collapse,
} from "@mui/material";
import {
  Search, Add, Download, FilterAlt, ViewModule, ViewList, Settings, Sort,
  Edit, Delete, ExpandMore, ExpandLess,
} from "@mui/icons-material";
import { Records, Row } from "../data/store";

const DEFAULT_COLS = ["name", "owner", "status", "risk", "bu", "createdAt", "updatedAt"];

export function DataGrid({ appId, moduleName }: { appId: string; moduleName: string }) {
  const [rows, setRows] = React.useState<Row[]>(() => Records.list(appId, moduleName));
  const [view, setView] = React.useState<"list" | "tile">("list");
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [colsAnchor, setColsAnchor] = React.useState<null | HTMLElement>(null);
  const [visibleCols, setVisibleCols] = React.useState<string[]>(DEFAULT_COLS);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [riskFilter, setRiskFilter] = React.useState<string>("All");
  const [editRow, setEditRow] = React.useState<Row | null>(null);
  const [sortKey, setSortKey] = React.useState<string>("updatedAt");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  React.useEffect(() => { setRows(Records.list(appId, moduleName)); setPage(1); }, [appId, moduleName]);

  const filtered = rows
    .filter(r => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))
    .filter(r => statusFilter === "All" || r.status === statusFilter)
    .filter(r => riskFilter === "All" || r.risk === riskFilter)
    .sort((a, b) => {
      const av = String(a[sortKey] ?? ""), bv = String(b[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const total = filtered.length;
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function refresh() { setRows(Records.list(appId, moduleName)); }
  function addNew() {
    setEditRow({ id: "", name: "", owner: "", status: "Draft", risk: "Low", bu: "BU-1", createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) });
  }
  function saveRow(r: Row) {
    if (r.id) Records.update(appId, moduleName, r.id, r);
    else Records.create(appId, moduleName, r);
    setEditRow(null); refresh();
  }
  function delRow(id: string) { Records.remove(appId, moduleName, id); refresh(); }

  function download() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${moduleName}-export.json`; a.click();
    URL.revokeObjectURL(url);
  }

  const statusColors: any = { Active: "success", Approved: "success", "Under Review": "warning", Draft: "default", Retired: "error" };
  const riskColors: any = { Low: "success", Medium: "warning", High: "error", Critical: "error" };

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>{moduleName}</Typography>
          <Typography variant="caption" color="text.secondary">{total} records</Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <TextField placeholder={`Search ${moduleName.toLowerCase()}…`} value={q} onChange={e => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ minWidth: 260 }} />
        <ToggleButtonGroup exclusive size="small" value={view} onChange={(_, v) => v && setView(v)}>
          <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
          <ToggleButton value="tile"><ViewModule fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
        <Tooltip title="Filters"><IconButton onClick={() => setFiltersOpen(o => !o)}><FilterAlt /></IconButton></Tooltip>
        <Tooltip title="Column settings"><IconButton onClick={e => setColsAnchor(e.currentTarget)}><Settings /></IconButton></Tooltip>
        <Tooltip title="Sort"><IconButton onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}><Sort /></IconButton></Tooltip>
        <Tooltip title="Download"><IconButton onClick={download}><Download /></IconButton></Tooltip>
        <Tooltip title="Add new">
          <IconButton onClick={addNew} sx={{ background: (t) => `linear-gradient(135deg,${t.palette.primary.main},${t.palette.primary.dark})`, color: "#fff", "&:hover": { opacity: 0.92 } }}>
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>

      <Collapse in={filtersOpen}>
        <Card sx={{ p: 1.5, border: 1, borderColor: "divider", borderRadius: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" color="text.secondary">Quick filters:</Typography>
            <TextField select size="small" label="Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ minWidth: 160 }}>
              {["All", "Active", "Under Review", "Approved", "Draft", "Retired"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Risk" value={riskFilter} onChange={e => setRiskFilter(e.target.value)} sx={{ minWidth: 140 }}>
              {["All", "Low", "Medium", "High", "Critical"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Button size="small" onClick={() => { setStatusFilter("All"); setRiskFilter("All"); setQ(""); }}>Reset</Button>
          </Stack>
        </Card>
      </Collapse>

      <Menu anchorEl={colsAnchor} open={!!colsAnchor} onClose={() => setColsAnchor(null)}>
        {DEFAULT_COLS.map(c => (
          <MenuItem key={c} onClick={() => setVisibleCols(v => v.includes(c) ? v.filter(x => x !== c) : [...v, c])}>
            <Checkbox checked={visibleCols.includes(c)} size="small" />{c}
          </MenuItem>
        ))}
      </Menu>

      {view === "list" && (
        <Card sx={{ borderRadius: 2, border: 1, borderColor: "divider", overflow: "hidden" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                {visibleCols.map(c => (
                  <TableCell key={c} onClick={() => { setSortKey(c); setSortDir(d => sortKey === c && d === "asc" ? "desc" : "asc"); }}
                    sx={{ cursor: "pointer", textTransform: "capitalize", fontWeight: 400 }}>
                    {c} {sortKey === c ? (sortDir === "asc" ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />) : ""}
                  </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map(r => (
                <TableRow key={r.id} hover>
                  {visibleCols.map(c => (
                    <TableCell key={c}>
                      {c === "status" ? <Chip size="small" label={r[c]} color={statusColors[r[c]] || "default"} variant="outlined" />
                        : c === "risk" ? <Chip size="small" label={r[c]} color={riskColors[r[c]] || "default"} />
                        : <Typography variant="body2">{String(r[c] ?? "")}</Typography>}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setEditRow(r)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => delRow(r.id)} color="error"><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!pageRows.length && <TableRow><TableCell colSpan={visibleCols.length + 1} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No records</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      )}

      {view === "tile" && (
        <Grid container spacing={1.5}>
          {pageRows.map(r => (
            <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{ p: 1.5, borderRadius: 2, border: 1, borderColor: "divider" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography sx={{ fontWeight: 400, fontSize: 15 }}>{r.name}</Typography>
                  <Chip size="small" label={r.risk} color={riskColors[r.risk] || "default"} />
                </Stack>
                <Typography variant="caption" color="text.secondary">{r.bu} • {r.owner}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <Chip size="small" label={r.status} color={statusColors[r.status] || "default"} variant="outlined" />
                  <Box>
                    <IconButton size="small" onClick={() => setEditRow(r)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => delRow(r.id)} color="error"><Delete fontSize="small" /></IconButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</Typography>
        <Pagination size="small" count={Math.max(1, Math.ceil(total / pageSize))} page={page} onChange={(_, p) => setPage(p)} />
      </Stack>

      <RecordDialog row={editRow} onClose={() => setEditRow(null)} onSave={saveRow} />
    </Stack>
  );
}

function RecordDialog({ row, onClose, onSave }: { row: Row | null; onClose: () => void; onSave: (r: Row) => void }) {
  const [draft, setDraft] = React.useState<Row | null>(row);
  React.useEffect(() => setDraft(row), [row]);
  if (!draft) return null;
  return (
    <Dialog open={!!row} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{draft.id ? "Edit record" : "Create record"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <TextField label="Owner" value={draft.owner} onChange={e => setDraft({ ...draft, owner: e.target.value })} />
          <Stack direction="row" spacing={2}>
            <TextField select label="Status" value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })} fullWidth>
              {["Active", "Under Review", "Approved", "Draft", "Retired"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField select label="Risk" value={draft.risk} onChange={e => setDraft({ ...draft, risk: e.target.value })} fullWidth>
              {["Low", "Medium", "High", "Critical"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Stack>
          <TextField label="Business Unit" value={draft.bu} onChange={e => setDraft({ ...draft, bu: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave({ ...draft, updatedAt: new Date().toISOString().slice(0, 10) })}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
