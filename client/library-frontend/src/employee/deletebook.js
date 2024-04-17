import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FormControl } from '@mui/base/FormControl';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Header from '.././component/header';
import Footer from '.././component/footer';
import SideBar from '.././component/sidebar';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const DeleteBook = (props) => {
  useEffect(() => {
    document.title = `Book.net: Return Books`;
  }, []);

  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [data, setData] = useState({
    book_id: '',
    title: '',
    author_id: '',
    publisher: '',
    isbn: '',
    publication_year: '',
    genre: '',
    img: '',
    count: '',
  });
  const [userdata, setUserData] = useState({
    id: '',
    firstname: '',
    lastname: '',
  });

  const [query, setQuery] = useState('');
  const [userquery, setUserQuery] = useState('');

  useEffect(() => {
    if (query !== '') {
      const timeoutId = setTimeout(() => {
        handleSubmit();
      }, 500);

      return () => clearTimeout(timeoutId); // Clear the timeout if the component is unmounted
    } else {
      setData({});
      setUserData({});
    }
  }, [query]);
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
      return res;
    }

    async function fetchuser() {
      if (query.length == 0) {
        return;
      }
      const response = await fetch(`http://localhost:3006/stockuser/` + query);
      const res = await response.json();
      // const results = data[0];
      return res;
    }

    fetchuser()
      .then((res) => {
        if (res.length != 0) {
          setUserData(res[0]);
        } else {
          setUserData({});
        }
      })
      .catch((err) => console.log(err));

    fetchData()
      .then((res) => {
        if (res.length != 0) {
          setData(res[0]);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteBook = () => {
    if (data.length == 0) {
      return;
    }


    async function patchbook() {
      console.log('data', data);
      
      fetch(`http://localhost:3006/deletebook/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockid: data.id,        
        }),
      });
    }

    patchbook();
    setData({});

    setUserData({});
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
            <Grid item xs={8} container alignItems="flex-start">
              <Typography variant="h2" sx={{ mt: 4 }}>
                Delete Books
              </Typography>
              <Paper
                sx={{
                  padding: 5,
                  bgcolor:
                    data.instock || Object.keys(data).length == 0
                      ? 'azure'
                      : '#00cccc',
                  width: '100%',
                  height: '90%',
                }}
              >
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                  Type in the Stock ID of the book you want to return!
                </Typography>
                <div />
                <div>
                  {/* ... rest of your code ... */}
                  <form onSubmit={handleSubmit}>
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
                    </Box>
                  </form>
                  <Typography variant="h5" sx={{ mt: 4 }}>
                 Book Data{data == null || Object.keys(data).length === 0 ? '' : ' - ' + data.title}
                    <br />
                    InStock:{' '}
                    {data.instock === true
                      ? 'In Stock'
                      : data.instock === false
                      ? 'Out of Stock'
                      : ''}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Name:{data.title}
                    <br />
                    ISBN:{data.isbn}
                    <br />
                    <br />
                    DUE DATE:{' '}
                    {isNaN(new Date(data.due_date).getTime())
                      ? ''
                      : new Date(data.due_date).toLocaleDateString()}
                    <br />
                  </Typography>
                  {userdata && Object.keys(userdata).length !== 0 && (
                    <>
                      <Typography variant="h5" sx={{ mt: 4 }}>
                        User Data-
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 4 }}>
                        User Name:{userdata.firstname} {userdata.lastname}
                        <br />
                      </Typography>{' '}
                      <Typography variant="h6" sx={{ mt: 4 }}>
                        Email: {userdata.email}
                        <br />
                      </Typography>{' '}
                      <Typography variant="h6" sx={{ mt: 4 }}>
                        BALANCE: ${userdata.balance}
                        <br />
                        <br />
                      </Typography>
                    </>
                  )}
                </div>
                <Grid
                  item
                  xs={12}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  {Object.keys(data).length !== 0 && (
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
                        deleteBook();
                        setQuery('');
                        setData({});
                      }}
                    >
                      Delete Book
                    </Button>
                  )}
                </Grid>
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
              navigate('/employee/checkoutbook');
            }}
          >
            Checkout Book
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
            Employee Home Page
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
export default DeleteBook;
