const colorSystem = {
  white: "#ffffff",
  black: "#000000",
  gray100: "#333333",
  gray200: "#828282",
  gray300: "#BDBDBD",
  gray400: "#E0E0E0",
  gray500: "#F2F2F2",
  gray600: "#F7F7F7",

  red: "#e02323",
  orange100: "#ed522f",
  orange200: "#F59845",
  yellow: "#f8c032",
  green100: "#0F9254",
  green200: "#00b15e",
  green300: "#28CE80",
  bluenavy: "#002F6C",
  blueprussian: "#003153",
  blue100: "#1D75BF",
  blue200: "#2a96f2",
  blue300: "#67B2F2",
  purple100: "#452f57",
  purple200: "#6610f2",
  purple300: "#9365b8",
  purple400: "#A998B6",
  pink: "#ef2985",
  salmon: "#e7abba",
  teal100: "#20c997",
  teal200: "#74cccc",
  cyan: "#4d9ace",
  lime: "#54ce4d",

  charcoal: "#353A47",
  water: "#4e5d6c",
  darkwater: "rgb(75, 78, 74)",
  brown: "rgb(108, 89, 78)",
};

const variables = {
  colors: {
    primary: colorSystem.purple300,
    secondary: colorSystem.purple400,
    success: colorSystem.purple300,
    info: colorSystem.blue200,
    warning: colorSystem.yellow,
    danger: colorSystem.red,
    dark: colorSystem.charcoal,
    light: colorSystem.gray300,
    lighter: colorSystem.gray400,
    lightest: colorSystem.gray500,
    white: colorSystem.white,
    bodyColor: colorSystem.charcoal
  },
  borderRadius: 8
};

export const colors = variables.colors;

export default variables;
