/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './component/header';
import Footer from './component/footer';
import SideBar from './component/sidebar';
import { useEffect } from 'react';
const Login = (props) => {
  const { loggedIn } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();
  const defaultTheme = createTheme();

  useEffect(() => {
    document.title = `Book.net: Login`;
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Set initial error values to empty
    setEmailError('');
    setPasswordError('');

    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if ('' === password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    // Check if email has an account associated with it
    checkAccountExists((accountExists) => {
      // If yes, log in
      console.log(accountExists);
      if (accountExists) logIn();
      // Else, ask user if they want to create a new account and if yes, then log in
      else if (
        window.confirm(
          'An account does not exist with this email address: ' +
            email +
            '. Do you want to create a new account?',
        )
      ) {
        logIn();
      }
    });
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  // Call the server API to check if the given email ID already exists
  const checkAccountExists = (callback) => {
    fetch('http://localhost:3006/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists);
      });
  };

  // Log in a user using email and password
  const logIn = () => {
    fetch('http://localhost:3006/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        console.log('RRR', r);
        if ('success' === r.message) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              email: r.email,
              id: r.id,
              role: r.role,
              token: r.token,
            }),
          );
          console.log(r);
          props.setLoggedIn(true);
          props.setEmail(email);
          props.setUserID(r.id);
          props.setRole(r.role);

          console.log(r.role);
          console.log(r.role == 'employee');
          console.log(r.id);
          if (r.role == 'employee') {
            console.log('dddddemployee');
            navigate('/employee/emphome');
          } else {
            navigate('/userhome');
          }
        } else {
          window.alert('Wrong email or password');
        }
      });
  };

  console.log(role);

  return (
    <Grid container direction="column" spacing={2}>
      {/* Set container direction to column */}
      <Grid item>
        {/* Header takes full width of the column */}
        <Header loggedIn={loggedIn} setLoggedIn={props.setLoggedIn} />
      </Grid>
      <Grid container spacing={2} style={{ marginLeft: 'auto' }}>
        {/* Nested container for three columns */}
        <SideBar />
        <Grid item xs={6}>
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(ev) => setEmail(ev.target.value)}
                    error={Boolean(emailError)} // Set error to true if there is an error
                    helperText={emailError} // Display the error message
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    error={Boolean(passwordError)} // Set error to true if there is an error
                    helperText={passwordError} // Display the error message
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/signUp" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Login;
