import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FormControl } from '@mui/base/FormControl';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Header from '.././component/header';
import Footer from '.././component/footer';
import SideBar from '.././component/sidebar';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const CheckoutBook = (props) => {
  useEffect(() => {
    document.title = `Book.net: Checkout Book`;
  }, []);

  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [userdata, setUserData] = useState({
    id: '',
    firstname: '',
    lastname: '',
  });

  const [query, setQuery] = useState('');
  const [userquery, setUserQuery] = useState('');

  useEffect(() => {
    if (query !== '' && userquery !== '') {
      const timeoutId = setTimeout(() => {
        handleSubmit();
        handleUserSubmit();
      }, 500);

      return () => clearTimeout(timeoutId); // Clear the timeout if the component is unmounted
    }
  }, [query, userquery]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    // window.alert(query);
    // if (!query) return;

    async function fetchData() {
      if (query.length == 0) {
        return;
      }
      let querystring = '?query=' + query;
      const response = await fetch(
        `http://localhost:3006/books/stock/` + querystring,
      );
      const res = await response.json();
      // const results = data[0];
      // setData(res);

      return res;
    }

    fetchData()
      .then((res) => {
        setData(res[0]);
      })
      .catch((err) => console.log(err));
  };

  const handleUserSubmit = (e) => {
    if (e) e.preventDefault();

    // window.alert(userquery);
    // if (!query) return;

    async function fetchData() {
      if (userquery.length == 0) {
        return;
      }
      const response = await fetch(`http://localhost:3006/user/` + userquery);
      const res = await response.json();
      // const results = data[0];
      return res;
    }

    fetchData()
      .then((res) => {
        setUserData(res[0]);
      })
      .catch((err) => console.log(err));
  };
  const CheckoutBook = () => {
    if (data.length == 0 || userdata.length == 0) {
      return;
    }
    async function patchbook() {
      fetch(`http://localhost:3006/checkoutbook/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockid: data.id,
          user_id: userdata.id,
        }),
      });
    }

    patchbook();
    setData({ ...data, instock: false });
  };

  return (
    <Grid container direction="column" spacing={2}>
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
        <Grid item xs={6} columns={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid container spacing={2}>
            {/* Main Content */}
            <Grid item xs={8} container>
              <Typography variant="h2" sx={{ mt: 4 }}>
                Checkout Book
              </Typography>
              <Paper
                sx={{
                  padding: 5,
                  bgcolor:
                    userdata.balance > 0
                      ? '#e08585'
                      : data.instock || Object.keys(data).length == 0
                      ? 'azure'
                      : '#00cccc',
                  width: '100%',
                }}
              >
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                  Type in the Stock ID and User ID to checkout a book!
                </Typography>
                <div />
                <div>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                      handleUserSubmit(e);
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <TextField
                        label="Stock ID"
                        type="text"
                        placeholder={data === null ? 'Stock ID' : data.id}
                        value={query}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (
                            val === '' ||
                            (Number.isInteger(Number(val)) && Number(val) > 0)
                          ) {
                            setQuery(val);
                          }
                        }}
                      />
                      <TextField
                        label="User ID"
                        type="text"
                        placeholder={data === null ? 'User ID' : userdata.id}
                        value={userquery}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (
                            val === '' ||
                            (Number.isInteger(Number(val)) && Number(val) > 0)
                          ) {
                            setUserQuery(val);
                          }
                        }}
                      />
                      {/* <Button
                        type="submit"
                        variant="contained"
                        sx={{ backgroundColor: "#00008B" }}>
                        Search
                      </Button> */}
                    </Box>
                  </form>
                </div>
                <div>
                  <Typography variant="h5" sx={{ mt: 4 }}>
                    Book Data {null === data ? '' : ' - ' + data.title}
                    <br />
                    InStock:{' '}
                    {data.instock === true
                      ? 'In Stock'
                      : data.instock === false
                      ? 'Out of Stock'
                      : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 4 }}>
                    Name:{data.title}
                    <br />
                    ISBN:{data.isbn}
                    <br />
                    Year Published:{data.publishyear}
                    <br />
                    Genre:{data.genre}
                    <br />
                    Description: <br />
                    {data.description}
                    <br />
                    <br />
                    Book Condition: {data.book_condition}
                    <br />
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 4 }}>
                    User Data
                    {null === userdata ? '' : ' - ' + userdata.firstname}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Name: {userdata.firstname} {userdata.lastname}
                    <br />
                  </Typography>{' '}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Email: {userdata.email}
                    <br />
                  </Typography>{' '}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Balance: ${userdata.balance}
                    <br /> <br /> <br />
                  </Typography>
                </div>
                {userdata.balance > 0 ? (
                  <Button
                    variant="contained"
                    sx={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '20px',
                      marginBottom: '10px',
                      backgroundColor: '#A52A2A', // Dull Red
                    }}
                    onClick={() => {
                      alert('Please pay your balance first');
                    }}
                  >
                    PAY NOW
                  </Button>
                ) : (
                  data.instock && (
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '20px',
                        marginBottom: '10px',
                        backgroundColor: '#00008B', // Medium Blue
                      }}
                      onClick={() => {
                        CheckoutBook();
                      }}
                    >
                      CHECKOUT
                    </Button>
                  )
                )}
              </Paper>
            </Grid>
            <Grid item xs={4} alignItems={'center'}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="65vh"
              >
                <Img
                  alt="Book Image"
                  onError={(e) => console.log('e', e)}
                  src={data.img}
                />
              </Box>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            sx={{
              width: '40%',
              margin: '30px',
              padding: '16px',
              fontSize: '20px',
              marginBottom: '10px',
              backgroundColor: '#00008B', // Medium Blue
            }}
            onClick={() => {
              navigate('/employee/returnbook');
            }}
          >
            Return Book
          </Button>
          <Button
            variant="contained"
            sx={{
              width: '40%',
              margin: '30px',
              padding: '16px',
              fontSize: '20px',
              marginBottom: '10px',
              backgroundColor: '#00008B', // Medium Blue
            }}
            onClick={() => {
              navigate('/employee/emphome');
            }}
          >
            Emp Landing
          </Button>
          {/* Footer */}
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};
const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '80%',
  maxHeight: '80%',
});
export default CheckoutBook;
