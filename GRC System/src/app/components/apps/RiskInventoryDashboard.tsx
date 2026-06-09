import * as React from "react";
import { Grid, Card, Stack, Typography, Box, IconButton, Tooltip, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, MoreVert } from "@mui/icons-material";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  Tooltip as RTooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const PALETTE = ["#d71e28", "#ffcd41", "#2563eb", "#059669", "#7c3aed", "#ea580c"];

function makeSeries(n = 12, base = 60, jitter = 20) {
  return Array.from({ length: n }).map((_, i) => ({
    name: `M${i + 1}`,
    value: Math.round(base + Math.sin(i / 1.5) * jitter + Math.random() * 10),
    secondary: Math.round(base * 0.7 + Math.cos(i / 1.7) * jitter + Math.random() * 8),
  }));
}

type Card = {
  title: string; description: string; stat: string; delta: string; up: boolean; color: string;
  chart: "line" | "area" | "bar" | "pie";
};

const CARDS: Card[] = [
  { title: "FRC Ownership Coverage", description: "% of business units with completed risk inventories", stat: "87%", delta: "+3.2%", up: true, color: "#d71e28", chart: "area" },
  { title: "Active Control Coverage", description: "% of identified risks mapped to at least one control", stat: "92%", delta: "+1.4%", up: true, color: "#ffcd41", chart: "line" },
  { title: "RAU Volume", description: "% of business units with completed risk inventories", stat: "1,284", delta: "+12.6%", up: true, color: "#2563eb", chart: "bar" },
  { title: "MRE Volume", description: "% of records reviewed within policy review cycle", stat: "412", delta: "-4.1%", up: false, color: "#059669", chart: "line" },
  { title: "Inventory Footprint", description: "% of records passing mandatory field and taxonomy validation", stat: "78%", delta: "+0.8%", up: true, color: "#7c3aed", chart: "area" },
  { title: "Control / FRC Ratio", description: "Median daily manual control submissions vs required inventory entry", stat: "3.4x", delta: "+0.1x", up: true, color: "#ea580c", chart: "pie" },
];

export function RiskInventoryDashboard() {
  const stats = [
    { label: "Total FRCs", value: "1,842", delta: "+5.2%" },
    { label: "Controls Mapped", value: "5,917", delta: "+2.1%" },
    { label: "Open MREs", value: "184", delta: "-3.4%" },
    { label: "Policies in Review", value: "27", delta: "+12%" },
    { label: "Avg Risk Score", value: "62.8", delta: "+0.4" },
  ];

  return (
    <Stack spacing={2}>
      {/* Stats bar */}
      <Grid container spacing={1.5}>
        {stats.map(s => (
          <Grid key={s.label} size={{ xs: 6, md: 2.4 }}>
            <Card sx={{ p: 1.5, borderRadius: 2, border: 1, borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography sx={{ fontWeight: 400, fontSize: 20 }}>{s.value}</Typography>
                <Chip size="small" label={s.delta} color={s.delta.startsWith("-") ? "error" : "success"} variant="outlined" sx={{ height: 18, fontSize: 12 }} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cards with charts */}
      <Grid container spacing={1.5}>
        {CARDS.map(c => (
          <Grid key={c.title} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{
              p: 2, borderRadius: 2, border: 1, borderColor: "divider", height: "100%",
              background: (t) => t.palette.mode === "light"
                ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(247,247,249,0.92))"
                : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              backdropFilter: "blur(8px)",
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 400, fontSize: 16 }}>{c.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>{c.description}</Typography>
                </Box>
                <Tooltip title="More"><IconButton size="small"><MoreVert fontSize="small" /></IconButton></Tooltip>
              </Stack>

              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1.25 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 26, color: c.color, lineHeight: 1 }}>{c.stat}</Typography>
                <Chip size="small" icon={c.up ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                  label={c.delta} color={c.up ? "success" : "error"} variant="outlined" sx={{ height: 20 }} />
              </Stack>

              <Box sx={{ height: 130, mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {c.chart === "line" ? (
                    <LineChart data={makeSeries()}>
                      <XAxis dataKey="name" hide /><YAxis hide />
                      <RTooltip />
                      <Line type="monotone" dataKey="value" stroke={c.color} strokeWidth={2.5} dot={false} />
                    </LineChart>
                  ) : c.chart === "area" ? (
                    <AreaChart data={makeSeries()}>
                      <defs>
                        <linearGradient id={`g-${c.title}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={c.color} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={c.color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide /><YAxis hide />
                      <RTooltip />
                      <Area type="monotone" dataKey="value" stroke={c.color} fill={`url(#g-${c.title})`} strokeWidth={2} />
                    </AreaChart>
                  ) : c.chart === "bar" ? (
                    <BarChart data={makeSeries(8)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" hide /><YAxis hide />
                      <RTooltip />
                      <Bar dataKey="value" fill={c.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie data={[{ name: "A", value: 60 }, { name: "B", value: 25 }, { name: "C", value: 15 }]}
                        innerRadius={32} outerRadius={55} paddingAngle={3} dataKey="value">
                        {PALETTE.slice(0, 3).map((p, i) => <Cell key={i} fill={p} />)}
                      </Pie>
                      <RTooltip />
                    </PieChart>
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
