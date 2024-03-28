import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Header from ".././component/header";
import Footer from ".././component/footer";
import SideBar from ".././component/sidebar";

const Profile = props => {
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
        <Container sx={{display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',}}>
            <Typography variant="h2" sx={{ mt: 4 }}>
              Profile Management
            </Typography>
            <Box component="form"  noValidate sx={{ mt: 1 }}>

            <TextField
             margin="normal"
             required
             fullWidth
             id="email"
             label="Email Address"
             name="email"
             autoComplete="email"
             autoFocus
            />
            
            <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            />
            
            <TextField
            margin="normal"
            required
            fullWidth
            id="retypePassword"
            label="Retype Password"
            type="password"
            autoComplete="current-password"
            />
           

            <Button  
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                    Edit Information</Button>
            </Box>

            <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  navigate("/home");
                }}>
                Home
              </Button>
            </Container>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Profile;