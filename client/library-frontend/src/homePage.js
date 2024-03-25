import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Header from './component/header';


const LandingPage = (props) => {
    const { loggedIn} = props
   
  return (
    <div>
      {/* Header */}
      <Header  loggedIn={loggedIn} />

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
