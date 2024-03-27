import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Header from "./component/header";
import Footer from "./component/footer";
import SideBar from "./component/sidebar";

const LandingPage = props => {
  const { loggedIn } = props;

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
          <Typography variant="h2" sx={{ mt: 4 }}>
            Welcome to Book.net
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
            Delivering awesome solutions for you!
          </Typography>

          <Typography variant="body1" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit
            amet ligula ac libero varius ultrices ut et turpis. In hac habitasse
            platea dictumst.
          </Typography>

          <Typography variant="body1" paragraph>
            Nunc ac fringilla orci. Vivamus fringilla, urna vitae ullamcorper
            euismod, nunc turpis rhoncus quam, vel efficitur sapien odio vitae
            felis.
          </Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Learn More
          </Button>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default LandingPage;
