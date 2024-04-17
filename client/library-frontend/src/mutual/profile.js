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
import Modal from '@mui/material/Modal';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

const StyledTable = styled(Table)({
  minWidth: 650,
});

const StyledTableCell = styled(TableCell)({
  backgroundColor: '#add8e6',
  fontWeight: 'bold',
});

const StyledTableRow = styled(TableRow)(({ theme, instock }) => ({
 
}));

const Profile = (props) => {
  useEffect(() => {
    document.title = `Book.net: Profile PAge`;
  }, []);

  console.log('LOCAL', localStorage.getItem('user'));
  console.log('PROPS', props);

  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [email, setEmail] = useState(props.email);
  const [userid, setUserId] = useState(props.userid);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

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

  useEffect(() => {
    console.log('userdata', userdata);
    console.log('fetching data');
    if (userdata === undefined || Object.keys(userdata).length === 0 || userdata.id =='') {
      return;
    }
    async function fetchData() {
      try {
        fetch(`http://localhost:3006/checkedout/` + userdata.id)
          .then(response => response.json())
          .then(res => {
            setData(res);
            console.log(res);
          });
      } catch (error) { console.log('Error:', error); }
    }
    fetchData();
  }, [userdata]);

  function capitalize(s) {
    return (
      s &&
      s
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
    );
  }

  return <Grid container direction="column" spacing={2} style={{ height: "100%" }}>
      {" "}{/* Set container direction to column */}
      <Grid item>
        {" "}{/* Header takes full width of the column */}
        <Header loggedIn={loggedIn} setLoggedIn={props.setLoggedIn} />
      </Grid>
      <Grid container spacing={2} style={{ marginLeft: "auto" }}>
        {" "}{/* Nested container for three columns */}
        <SideBar />
        <Grid item xs={6}>
          <div>
            {/* Main Content */}

            <Grid container direction="column" spacing={2} style={{ flexGrow: 1 }}>
              {/* Header row */}
              <Grid item>
                <Typography variant="h2" sx={{ mt: 4 }}>
                  Hello {userdata.firstname} {userdata.lastname}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                  Your Profile Information
                </Typography>
              </Grid>
              {/* Content rows */}
              <Grid container spacing={2}>
                <Grid item xs={6} style={{ padding: "50px", display: "flex", flexDirection: "column" }}>
                  {Object.keys(userdata).map((key, index) => {
                    if (key === "password") {
                      return null;
                    }
                    // Split the key into individual words and capitalize each word
                    const formattedKey = capitalize(key
                        .split(/(?=[A-Z])/)
                        .join(" "));
                    if (key === "balance") {
                      return <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                          <Paper key={index} elevation={3} style={{ padding: "20px", backgroundColor: "#ADD8E6" }}>
                            <Typography variant="h4" align="center">
                              <b>{`${formattedKey}:`}</b> ${userdata[key]}
                            </Typography>
                          </Paper>
                        </Box>;
                    } else {
                      return <Typography key={index} variant="h6">
                          <b>{`${formattedKey}:`}</b> {userdata[key]}
                        </Typography>;
                    }
                  })}
                </Grid>

                <Grid item xs={6} style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
                  <Box sx={{ height: "20px" }} /> {/* Space */}
                  {userdata.balance > 0 && <Button variant="contained" sx={{ width: "100%", padding: "16px", fontSize: "20px", marginBottom: "50px", backgroundColor: "#8B0000" } // Add more space after the button // Deep red
                      } onClick={() => setOpen(true)}>
                      Pay My Balance
                    </Button>}
                  <PaymentModal open={open} setOpen={setOpen} userdata={userdata} setUserData={setUserData} />
                  <Button variant="contained" sx={{ width: "100%", padding: "16px", fontSize: "20px", marginBottom: "10px", backgroundColor: "#00008B" }} onClick={() => {
                      navigate("/booksearch");
                    }}>
                    Book Search
                  </Button>
                  <Button variant="contained" sx={{ width: "100%", padding: "16px", fontSize: "20px", backgroundColor: "#00008B" }} onClick={() => {
                      navigate("/userhome");
                    }}>
                    Home
                  </Button>
                </Grid>
              </Grid>

              {/* ======================================================= */}
              {!data || Object.keys(data).length === 0 ? <Typography variant="h6">
                    No Checked out books
                  </Typography> : <Container style={{ padding: "20px" }}>
                    <Typography variant="h4" align="center" gutterBottom>
                      Currently Checked Out Books
                    </Typography>
                    <StyledTable aria-label="simple table">
                      <TableHead>
                        <TableRow>
        
                          <StyledTableCell>Title</StyledTableCell>
                          <StyledTableCell>Author Name</StyledTableCell>
                          <StyledTableCell>Genre</StyledTableCell>
     
                          <StyledTableCell>Due Date</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map(book =>
                          <StyledTableRow
                            key={book.bookId}
                            instock={book.instock}>
                           
                            <TableCell
                              style={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}>
                              {book.title}
                            </TableCell>
                            <TableCell
                              style={{
                                maxWidth: "150px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}>
                              {book.author_name}
                            </TableCell>
                            <TableCell
                              style={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}>
                              {book.genre}
                            </TableCell>

                            <TableCell
                              style={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}>
                              {book.due_date
                                ? new Date(
                                    book.due_date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })
                                : "--"}
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </StyledTable>
                  </Container>}
              {/* ======================================================= */}
            </Grid>
          </div>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>;
};

const PaymentModal = (props) => {
  const { open, setOpen, userdata, setUserData } = props;
  const [paymentAmount, setPaymentAmount] = useState(userdata.balance);

  const submitPayment = async () => {
    if (paymentAmount < 0 || paymentAmount > userdata.balance) {
      alert('Invalid payment amount');
      return;
    }
    fetch('http://localhost:3006/user/payment/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: paymentAmount, id: userdata.id }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Payment successful');
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        console.log(data);
        setUserData({
          ...userdata,
          balance: data.user[0].balance,
        });
        setPaymentAmount('');
        window.alert('Payment successful');
        setOpen(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    // const data = await response.json();

    // // Update the user data with the new balance
    // setUserData({
    //   ...userdata,
    //   balance: data.newBalance,
    // });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30vw', // 30% of the viewport width
          height: '40vh', // 40% of the viewport height
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex', // Make this a flex container
          flexDirection: 'column', // Arrange the children vertically
          justifyContent: 'space-between', // Add space between the children
        }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ fontWeight: 'bold' }}
        >
          Balance Payment
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{ textAlign: 'center', marginBottom: '20px' }}
        >
          Balance: ${userdata.balance}
        </Typography>
        <TextField
          id="modal-input"
          label="Payment Amount"
          variant="outlined"
          value={paymentAmount}
          onChange={(event) => {
            const value = event.target.value;
            if (/^\d*(\.\d{0,2})?$/.test(value)) {
              setPaymentAmount(value);
            }
          }}
        />
        <Box
          sx={{
            display: 'flex', // Make this a flex container
            justifyContent: 'center', // Center the children horizontally
          }}
        >
          <Button
            variant="contained"
            sx={{
              fontSize: '20px', // Make the button larger
              backgroundColor: '#00008B', // Make the button darker blue
              '&:hover': {
                backgroundColor: '#00008B',
              },
              margin: '0 10px', // Add some margin around the button
            }}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontSize: '20px', // Make the button larger
              backgroundColor: '#00008B', // Make the button darker blue
              '&:hover': {
                backgroundColor: '#00008B',
              },
              margin: '0 10px', // Add some margin around the button
            }}
            onClick={() => submitPayment()}
          >
            Submit Payment
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default Profile;
