import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton'; // Import IconButton component
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from "react-router-dom";


const LandingPage = (props) => {
    const { loggedIn} = props
    const navigate = useNavigate();

    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }
  return (
    <div>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book.net
          </Typography>
            <TextField
              label="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          <Button color="inherit" onClick={onButtonClick}>Log Out</Button>
          <Button color="inherit">Profile</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container>
        <Typography variant="h2" sx={{ mt: 4 }}>
          Welcome to Book.net
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
          Delivering awesome solutions for you!
        </Typography>

        <Typography variant="body1" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet ligula ac libero
          varius ultrices ut et turpis. In hac habitasse platea dictumst.
        </Typography>

        <Typography variant="body1" paragraph>
          Nunc ac fringilla orci. Vivamus fringilla, urna vitae ullamcorper euismod, nunc turpis
          rhoncus quam, vel efficitur sapien odio vitae felis.
        </Typography>

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Learn More
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

export default LandingPage;
