/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const SignUp = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordverify, setPasswordVerify] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [role, setRole] = useState('employee');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  
  function Copyright(props) {
      return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
          {'Copyright © '}
          <Link color="inherit" href="https://mui.com/">
            Your Website
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      );
    }
    

 const handleSubmit = (event) => {
  console.log('handleSubmit called'); // Log when the function is called

  event.preventDefault();
  const data = new FormData(event.currentTarget);

  console.log('Form data:', data); // Log the form data

  // Set initial error values to empty
  setEmailError("");
  setPasswordError("");

  // Check if the user has entered both fields correctly
  if ("" === email) {
    setEmailError("Please enter your email");
    console.log('Email error:', emailError); // Log the email error
    return;
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    setEmailError("Please enter a valid email");
    console.log('Email error:', emailError); // Log the email error
    return;
  }

  if ("" === password) {
    setPasswordError("Please enter a password");
    console.log('Password error:', passwordError); // Log the password error
    return;
  }

  if (password.length < 7) {
    setPasswordError("The password must be 8 characters or longer");
    console.log('Password error:', passwordError); // Log the password error
    return;
  }

  if (password !== passwordverify) {
    setPasswordError("The passwords do not match");
    console.log('Password error:', passwordError); // Log the password error
    return;
  }

  // Check if email has an account associated with it
  checkAccountExists(accountExists => {
    console.log('Account exists:', accountExists); // Log whether the account exists

    // If yes, log in 
    if (accountExists)
      navigate("/login");
    else {
      console.log("signup");
      signup();
    }
  });

  console.log({
    email: data.get('email'),
    password: data.get('password'),
  });
};
  
const checkAccountExists = (callback) => {
    console.log('checkAccountExists called');
    fetch("http://localhost:3006/check-account", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    })
    .then(r => {
        console.log('Response received', r);
        return r.json();
    })
    .then(r => {
        console.log('Response processed', r);
        callback(r?.userExists);
    })
    .catch(e => {
        console.error('Error occurred', e);
    });
}
      
  

  // Log in a user using email and password
  const signup = () => {
      fetch("http://localhost:3006/signup", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
           firstName,
           lastName,
            email,
            password,
            role,
          
          })
      })
      .then(r => r.json())
      .then(r => {
        
          if ('success' === r.message) {
          
  let user = {email: r.email, id:r.id,  role: r.role, token: r.token};
console.log('Setting user in local storage:', user);




localStorage.setItem("user", JSON.stringify(user));

console.log('Setting logged in status to true');
props.setLoggedIn(true);

console.log('Setting email:', email);
props.setEmail(email);

console.log('Setting user ID:', r.id);
props.setUserID(r.id);
    
    if(role === "employee"){
        navigate("/employee/emphome")
    }else{
        navigate("/userhome")
    }
} else {
    window.alert("Wrong email or password")
}
          
      })
      .catch(error => {
        console.error("Signup error:", error);
        window.alert("An error occurred during signup. Please try again later.");
    });
  }

  return (
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={ev => setFirstName(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={ev => setLastName(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={ev => setEmail(ev.target.value)}
                autoComplete="email"
                error={Boolean(emailError)} // Set error to true if there is an error
                helperText={emailError} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={ev => setPassword(ev.target.value)}
                error={Boolean(passwordError)} // Set error to true if there is an error
                helperText={passwordError} // Display the error message
              />
            </Grid>            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="passwordverify"
                label="Verify Password"
                type="password"
                id="passwordverify"
                autoComplete="new-password"
                onChange={ev => setPasswordVerify(ev.target.value)}
                error={Boolean(passwordError)} // Set error to true if there is an error
                helperText={passwordError} // Display the error message
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                row
                aria-label="role"
                name="role"
                value={role}
                onChange={ev => setRole(ev.target.value)}
              >
                <FormControlLabel value="employee" control={<Radio />} label="Employee" />
                <FormControlLabel value="customer" control={<Radio />} label="Customer" />
              </RadioGroup>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  </ThemeProvider>
);
}

export default SignUp