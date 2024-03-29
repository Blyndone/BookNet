import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Header from ".././component/header";
import Footer from ".././component/footer";
import SideBar from ".././component/sidebar";

const EmpHome = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  return (
    <Grid container direction="column" spacing={2}>
      {" "}{/* Set container direction to column */}
      <Grid item>
        {" "}{/* Header takes full width of the column */}
        <Header loggedIn={loggedIn} />
      </Grid>
      <Grid container spacing={2} style={{ marginLeft: "auto" }}>
        {" "}{/* Nested container for three columns */}
        <SideBar />
        <Grid item xs={6}>
          <div>
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
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/checkoutbook");
                }}>
                Checkout Book
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/returnbook");
                }}>
                Return Book
              </Button>
            </Container>
          </div>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default EmpHome;
