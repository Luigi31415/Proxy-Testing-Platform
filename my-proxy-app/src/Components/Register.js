import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirst_Name(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLast_Name(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, first_name, last_name, password }),
      });
      if (response.status === 200) {
        setSnackbarMessage("Register successful");
        setOpen(true);
      } else if (response.status === 400) {
        setSnackbarMessage("Username already used");
        setOpen(true);
      } else {
        setSnackbarMessage("Network Error");
        setOpen(true);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    if (snackbarMessage === "Register successful") {
      navigate("/login");
    }
    setSnackbarMessage("");
    setOpen(false);
  };

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
        <div>
          <Snackbar
            open={open}
            autoHideDuration={1500}
            onClose={handleClose}
            message={snackbarMessage}
          />
        </div>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Register Now
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleUsernameChange}
              id="username"
              label="Username"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleFirstNameChange}
              id="first_name"
              label="first_name"
              name="first_name"
              autoComplete="given-name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleLastNameChange}
              id="last_name"
              label="last_name"
              name="last_name"
              autoComplete="family-name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handlePasswordChange}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign me up
            </Button>
          </Box>
        </Box>
      </Container>
      </Box>
    </ThemeProvider>
  );
}
