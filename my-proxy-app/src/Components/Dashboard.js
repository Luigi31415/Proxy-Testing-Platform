import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const defaultTheme = createTheme();

export default function Login() {
// https://mui.com/material-ui/react-list/
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          background: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      <Container
        component="main"
        maxWidth="xs"
        justify="flex-end"
        alignItems="center"
        style={{ background: "#ffffff" }}
      >

      </Container>
      </Box>
    </ThemeProvider>
  );
}
