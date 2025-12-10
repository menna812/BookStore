import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";

const ToggleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  width: 240,
  height: 50,
  backgroundColor: "#e0e0e0",
  borderRadius: 25,
  position: "relative",
  margin: "20px auto",
  cursor: "pointer",
}));

const ToggleButton = styled(Box)<{ active?: boolean }>(({ active }) => ({
  width: "50%",
  height: "100%",
  borderRadius: 25,
  backgroundColor: active ? "#3f51b5" : "transparent",
  color: active ? "#fff" : "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  transition: "all 0.3s ease",
  zIndex: 1,
  position: "relative",
}));

const Slider = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 2,
  left: 2,
  width: "50%",
  height: "calc(100% - 4px)",
  backgroundColor: "#3f51b5",
  borderRadius: 25,
  transition: "all 0.3s ease",
  zIndex: 0,
}));

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"admin" | "customer">("customer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password, userType);
  };

  const toggleUserType = (type: "admin" | "customer") => {
    setUserType(type);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#ffffffcc",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontFamily: "'Roboto Slab', serif", mb: 4, color: "#3f51b5" }}
          >
            Bookstore
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Custom sliding toggle */}
            <ToggleWrapper>
              <Slider
                sx={{
                  transform:
                    userType === "admin"
                      ? "translateX(0%)"
                      : "translateX(100%)",
                }}
              />
              <ToggleButton
                active={userType === "admin"}
                onClick={() => toggleUserType("admin")}
              >
                Admin
              </ToggleButton>
              <ToggleButton
                active={userType === "customer"}
                onClick={() => toggleUserType("customer")}
              >
                Customer
              </ToggleButton>
            </ToggleWrapper>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: 16 }}
            >
              Sign In
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <Link href="#" underline="hover">
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
