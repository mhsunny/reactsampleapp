import * as React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem,
  Chip, Typography, IconButton, Box, InputAdornment, Tabs, Tab, FormControlLabel, Switch, Divider
} from "@mui/material";
import { Add, Close, Search } from "@mui/icons-material";
import { Apps, Groups, ModuleApi, useStoreVersion } from "../data/store";

const ACCENTS = ["#d71e28", "#ffcd41", "#2563eb", "#059669", "#7c3aed", "#ea580c", "#0891b2"];

export function CreateAppDialog({ open, onClose, onCreated, editingId }: { open: boolean; onClose: () => void; onCreated?: (id: string) => void; editingId?: string | null }) {
  useStoreVersion();
  const groups = Groups.list();
  const modules = ModuleApi.list();
  const editing = editingId ? Apps.get(editingId) : null;

  const [tab, setTab] = React.useState(0);
  const [name, setName] = React.useState("");
  const [shortName, setShortName] = React.useState("");
  const [groupId, setGroupId] = React.useState(groups[0]?.id || "");
  const [description, setDescription] = React.useState("");
  const [accent, setAccent] = React.useState(ACCENTS[0]);
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open && editing) {
      setName(editing.appName);
      setShortName(editing.appShortName);
      setGroupId(editing.groupId);
      setDescription(editing.description);
      setAccent(editing.accentColor);
      setTags(editing.tags);
      setSelectedModules(editing.modules);
      setTab(0);
    } else if (open && !editing) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingId]);
  const [moduleSearch, setModuleSearch] = React.useState("");
  const [moduleCat, setModuleCat] = React.useState("All");
  const [showOnlyActive, setShowOnlyActive] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState("");

  const categories = React.useMemo(() => ["All", ...Array.from(new Set(modules.map(m => m.category)))], [modules]);

  const filteredModules = modules.filter(m =>
    (moduleCat === "All" || m.category === moduleCat) &&
    (!showOnlyActive || m.active) &&
    (m.name.toLowerCase().includes(moduleSearch.toLowerCase()))
  );

  function addTag() {
    if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); }
  }

  function reset() {
    setName(""); setShortName(""); setDescription(""); setTags([]); setSelectedModules([]); setTab(0);
  }

  function submit() {
    if (!name) return;
    if (editing) {
      Apps.update(editing.id, {
        appName: name,
        appShortName: shortName || name.split(" ").slice(0, 2).join(" "),
        description, groupId, accentColor: accent, tags, modules: selectedModules,
      });
      onCreated?.(editing.id);
    } else {
      const app = Apps.create({
        appName: name,
        appShortName: shortName || name.split(" ").slice(0, 2).join(" "),
        description, groupId, accentColor: accent, tags, modules: selectedModules, active: true,
      });
      onCreated?.(app.id);
    }
    reset();
    onClose();
  }

  function addGroup() {
    if (!newGroupName.trim()) return;
    const g = Groups.create({ groupName: newGroupName.trim(), color: accent });
    setGroupId(g.id);
    setNewGroupName("");
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Stack>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>{editing ? "Edit application" : "Create new application"}</Typography>
          <Typography variant="caption" color="text.secondary">{editing ? "Update application details and modules." : "Configure a new GRC application and pick shared modules."}</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <Divider />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3 }}>
        <Tab label="Details" />
        <Tab label={`Modules (${selectedModules.length})`} />
      </Tabs>
      <DialogContent sx={{ pt: 2 }}>
        {tab === 0 && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField label="App Name *" fullWidth value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Risk Inventory Management" />
              <TextField label="Short Name" fullWidth value={shortName} onChange={e => setShortName(e.target.value)} placeholder="Risk Inventory" />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField select label="Group" value={groupId} onChange={e => setGroupId(e.target.value)} sx={{ minWidth: 260 }}>
                {groups.map(g => <MenuItem key={g.id} value={g.id}>{g.groupName}</MenuItem>)}
              </TextField>
              <TextField label="Add new group" value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addGroup()}
                InputProps={{ endAdornment: <Button size="small" onClick={addGroup}>Add</Button> }} sx={{ flex: 1 }} />
            </Stack>
            <TextField label="Description" fullWidth multiline minRows={2} value={description} onChange={e => setDescription(e.target.value)} />
            <Box>
              <Typography variant="caption" color="text.secondary">Accent color</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                {ACCENTS.map(c => (
                  <Box key={c} onClick={() => setAccent(c)} sx={{
                    width: 28, height: 28, borderRadius: "50%", bgcolor: c, cursor: "pointer",
                    outline: accent === c ? "2px solid" : "none", outlineColor: "text.primary", outlineOffset: 2,
                  }} />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Tags</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap", gap: 1 }}>
                {tags.map(t => <Chip key={t} label={t} size="small" onDelete={() => setTags(tags.filter(x => x !== t))} />)}
                <TextField size="small" placeholder="Add tag" value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} />
              </Stack>
            </Box>
          </Stack>
        )}
        {tab === 1 && (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1}>
              <TextField placeholder="Search modules…" value={moduleSearch} onChange={e => setModuleSearch(e.target.value)}
                fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
              <TextField select value={moduleCat} onChange={e => setModuleCat(e.target.value)} sx={{ minWidth: 200 }}>
                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <FormControlLabel control={<Switch checked={showOnlyActive} onChange={e => setShowOnlyActive(e.target.checked)} />} label="Active only" />
            </Stack>
            <Box sx={{ maxHeight: 360, overflow: "auto", border: 1, borderColor: "divider", borderRadius: 1.5, p: 1 }}>
              <Stack spacing={0.75}>
                {filteredModules.map(m => {
                  const checked = selectedModules.includes(m.id);
                  return (
                    <Stack key={m.id} direction="row" alignItems="center" spacing={1}
                      onClick={() => setSelectedModules(checked ? selectedModules.filter(x => x !== m.id) : [...selectedModules, m.id])}
                      sx={{
                        p: 1, borderRadius: 1, cursor: "pointer",
                        bgcolor: checked ? "action.selected" : "transparent",
                        "&:hover": { bgcolor: "action.hover" },
                      }}>
                      <Box sx={{
                        width: 18, height: 18, borderRadius: "4px",
                        border: 2, borderColor: checked ? "primary.main" : "divider",
                        bgcolor: checked ? "primary.main" : "transparent",
                        display: "grid", placeItems: "center", color: "white", fontSize: 14,
                      }}>{checked ? "✓" : ""}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{m.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{m.category}</Typography>
                      </Box>
                      <Chip size="small" label={m.active ? "Active" : "Inactive"}
                        color={m.active ? "success" : "default"} variant="outlined" />
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" startIcon={<Add />} onClick={submit} disabled={!name}>{editing ? "Save changes" : "Create application"}</Button>
      </DialogActions>
    </Dialog>
  );
}
