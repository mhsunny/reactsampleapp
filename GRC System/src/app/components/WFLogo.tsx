import * as React from "react";
import { Box, Typography, Stack } from "@mui/material";

const SERIF = `"Wells Fargo Serif","Times New Roman",Georgia,serif`;

export function WFLogo({ subtitle, appName }: { subtitle?: string; appName?: string }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography
        sx={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: 0.5,
          color: "#fff",
          lineHeight: 1,
        }}
      >
        WELLS FARGO
      </Typography>
      <Box sx={{ width: "1px", height: 22, bgcolor: "rgba(255,255,255,0.4)" }} />
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {appName ? (
            <>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 0.3, lineHeight: 1.1, textTransform: "uppercase" }}>{appName}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>— ERC ECOSYSTEM</Typography>
            </>
          ) : (
            <>
              <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: 14, letterSpacing: 0.3, lineHeight: 1.1 }}>
                ERC ECOSYSTEM
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#ffe48a", fontWeight: 400, lineHeight: 1.1 }}>
                — {subtitle || "A total solution of Governance, Risk & Compliance"}
              </Typography>
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
