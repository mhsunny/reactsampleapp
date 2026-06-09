import { createTheme, ThemeOptions } from "@mui/material/styles";

const fontStack = `"Wells Fargo Sans Regular","Wells Fargo Sans",Arial,Helvetica,sans-serif`;

const base: ThemeOptions = {
  shape: { borderRadius: 7 },
  typography: {
    fontFamily: fontStack,
    fontSize: 16,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
    button: { textTransform: "none", fontWeight: 500 },
    h1: { fontWeight: 400, letterSpacing: -0.5 },
    h2: { fontWeight: 400, letterSpacing: -0.4 },
    h3: { fontWeight: 400 },
    h4: { fontWeight: 400 },
    h5: { fontWeight: 400 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 300 },
    body2: { fontWeight: 300 },
    caption: { fontWeight: 300 },
    subtitle1: { fontWeight: 400 },
    subtitle2: { fontWeight: 400 },
  },
  components: {
    MuiButton: { defaultProps: { size: "small" }, styleOverrides: { root: { borderRadius: 6, paddingTop: 6, paddingBottom: 6, fontSize: 14.5 } } },
    MuiIconButton: { defaultProps: { size: "small" }, styleOverrides: { sizeSmall: { padding: 7 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none", fontFamily: fontStack } } },
    MuiDialog: { styleOverrides: { paper: { fontFamily: fontStack } } },
    MuiCssBaseline: { styleOverrides: { body: { fontFamily: fontStack } } },
    MuiChip: { defaultProps: { size: "small" }, styleOverrides: { root: { borderRadius: 5, fontWeight: 400, fontSize: 13 }, sizeSmall: { height: 24 } } },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiInputBase: { styleOverrides: { input: { fontSize: 15, fontFamily: fontStack } } },
    MuiToggleButton: { styleOverrides: { root: { padding: "6px 10px" } } },
    MuiTab: { styleOverrides: { root: { minHeight: 42, fontSize: 14.5, padding: "7px 13px" } } },
    MuiTableCell: { styleOverrides: { root: { fontSize: 14.5, paddingTop: 8, paddingBottom: 8 }, head: { fontSize: 13.5, fontWeight: 500 } } },
    MuiListItemButton: { styleOverrides: { root: { paddingTop: 6, paddingBottom: 6 } } },
    MuiTooltip: { styleOverrides: { tooltip: { fontSize: 13 } } },
    MuiSvgIcon: { styleOverrides: { fontSizeSmall: { fontSize: 19 } } },
  },
};

export const lightTheme = createTheme({
  ...base,
  palette: {
    mode: "light",
    primary: { main: "#d71e28", dark: "#a8161e", contrastText: "#fff" },
    secondary: { main: "#ffcd41", dark: "#e0b22f", contrastText: "#1a1a1a" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#1a1a1a", secondary: "#5a6068" },
    divider: "rgba(0,0,0,0.08)",
  },
});

export const darkTheme = createTheme({
  ...base,
  palette: {
    mode: "dark",
    primary: { main: "#ff4750", dark: "#d71e28", contrastText: "#fff" },
    secondary: { main: "#ffcd41", contrastText: "#1a1a1a" },
    background: { default: "#0d1117", paper: "#161b22" },
    text: { primary: "#eaecef", secondary: "#9aa4b2" },
    divider: "rgba(255,255,255,0.08)",
  },
});
