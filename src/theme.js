// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50", // Green color
    },
    secondary: {
      main: "#9e9e9e", // Grey color
    },
    background: {
      default: "#ffffff", // White color
    },
    text: {
      primary: "#212121", // Dark grey color for text
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
