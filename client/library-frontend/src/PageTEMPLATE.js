import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Header from "./component/header";
import Footer from "./component/footer";
import SideBar from "./component/sidebar";

const PageTEMPLATE = props => {
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
            {/* INSERT CONTENT HERE */}
          </div>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default PageTEMPLATE;
