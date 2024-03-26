import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Header from ".././component/header";
import { useNavigate } from "react-router-dom";

const EmpHome = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  return (
    <div>
      {/* Header */}
      <Header loggedIn={loggedIn} />

      {/* Main Content */}
      <Container>
        <Typography variant="h2" sx={{ mt: 4 }}>
          EMP HOME
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
          Delivering awesome solutions for you!
        </Typography>

        <div />

        <Button
          variant="contained"
          onClick={() => {
            navigate("/");
          }}>
          Home
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/editbook");
          }}>
          Edit Book
        </Button>
      </Container>

      {/* Footer */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Container>
    </div>
  );
};

export default EmpHome;
