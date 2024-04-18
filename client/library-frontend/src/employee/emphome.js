import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { TextField, emphasize } from '@mui/material';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Header from '.././component/header';
import Footer from '.././component/footer';
import SideBar from '.././component/sidebar';
import { Box } from '@mui/system';
const EmpHome = (props) => {
  console.log('LOCAL', localStorage.getItem('user'));
  console.log('PROPS', props);

  useEffect(() => {
    document.title = `Book.net: Empl`;
  }, []);

  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [email, setEmail] = useState(props.email);
  const [userid, setUserId] = useState(props.userid);

  useEffect(() => {
    if (
      !loggedIn ||
      loggedIn === '' ||
      !email ||
      email === '' ||
      !userid ||
      userid === ''
    ) {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser) {
        setUserId(storedUser.id);
      }
    }
  }, []);

  const navigate = useNavigate();
  const [userdata, setUserData] = useState({
    id: '',
    firstname: '',
    lastname: '',
  });

  const getUserData = () => {
    // console.log(e);
    // e.preventDefault();
    // window.alert(userquery);
    // if (!query) return;

    async function fetchData() {
      if (userid.length == 0) {
        return;
      }

      const response = await fetch(`http://localhost:3006/user/` + userid);
      const res = await response.json();
      // const results = data[0];
      return res;
    }

    fetchData()
      .then((res) => {
        console.log('Response: ', res);
        setUserData(res[0]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log('logged in', loggedIn);
    if (!loggedIn || !userid || userid === '') {
      console.log('not logged in');
      console.log('userid', userid);
      console.log('loggedIn', loggedIn);

      // navigate("/login");
    } else {
      getUserData();
    }
  }, [userid]);

  function capitalize(s) {
    return (
      s &&
      s
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
    );
  }

  return (
    <Grid container direction="column" spacing={2} style={{ height: '100%' }}>
      {' '}
      {/* Set container direction to column */}
      <Grid item>
        {' '}
        {/* Header takes full width of the column */}
        <Header loggedIn={loggedIn} setLoggedIn={props.setLoggedIn} />
      </Grid>
      <Grid container spacing={2} style={{ marginLeft: 'auto' }}>
        {' '}
        {/* Nested container for three columns */}
        <SideBar />
        <Grid item xs={6}>
          <div>
            {/* Main Content */}

            <Grid container direction="column" spacing={2}>
              {/* Header row */}
              <Grid item>
                <Typography variant="h2" sx={{ mt: 4 }}>
                  Employee Home
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                  Your Profile Information
                </Typography>
              </Grid>

              {/* Content rows */}
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={6}
                  style={{
                    padding: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {Object.keys(userdata).map((key, index) => {
                    if (key === 'password') {
                      return null;
                    }
                    // Split the key into individual words and capitalize each word
                    const formattedKey = capitalize(
                      key.split(/(?=[A-Z])/).join(' '),
                    );
                    if (key === 'balance') {
                      return '';
                    } else {
                      return (
                        <Typography key={index} variant="h6">
                          <b>{`${formattedKey}:`}</b> {userdata[key]}
                        </Typography>
                      );
                    }
                  })}
                </Grid>

                <Grid
                  item
                  xs={6}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  <Button
                    variant="contained"
                    sx={
                      {
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B',
                      } // Medium Blue
                    }
                    onClick={() => {
                      navigate('/employee/checkoutbook');
                    }}
                  >
                    Checkout Book
                  </Button>
                  <Button
                    variant="contained"
                    sx={
                      {
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B',
                      } // Medium Blue
                    }
                    onClick={() => {
                      navigate('/employee/returnbook');
                    }}
                  >
                    Return Book
                  </Button>
                  <Box sx={{ height: '20px' }} /> {/* Space */}
                  <Button
                    variant="contained"
                    sx={
                      {
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B',
                      } // Medium Blue
                    }
                    onClick={() => {
                      navigate('/employee/addbooks');
                    }}
                  >
                    Add Book
                  </Button>
                  <Button
                    variant="contained"
                    sx={
                      {
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B',
                      } // Medium Blue
                    }
                    onClick={() => {
                      navigate('/employee/editbook');
                    }}
                  >
                    Edit Book
                  </Button>
                  <Button
                    variant="contained"
                    sx={
                      {
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B',
                      } // Medium Blue
                    }
                    onClick={() => {
                      navigate('/employee/deletebook');
                    }}
                  >
                    Delete Book
                  </Button>
                  <Box sx={{ height: '20px' }} /> {/* Space */}
                  <Button
                    variant="contained"
                    sx={
                      {
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B',
                      } // Medium Blue
                    }
                    onClick={() => {
                      navigate('/employee/stocksearch');
                    }}
                  >
                    Stock Search
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default EmpHome;
