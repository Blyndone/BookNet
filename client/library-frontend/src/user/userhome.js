import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Header from ".././component/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";

import Footer from ".././component/footer";
import SideBar from ".././component/sidebar";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton"; // Import IconButton component
import SearchIcon from "@mui/icons-material/Search"; // Import SearchIcon
import InputAdornment from "@mui/material/InputAdornment";
import BasicModal from "../component/BasicModal";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEffect } from "react";

const UserHome = props => {
  const [userid, setUserId] = useState(props.userid);

  useEffect(() => {
    if (
      !loggedIn ||
      loggedIn === "" ||
      !email ||
      email === "" ||
      !userid ||
      userid === ""
    ) {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        setUserId(storedUser.id);
      }
    }
  }, []);

  const location = useLocation();
  const [query, setQuery] = useState(
    location.state === null ? "" : location.state.q
  );
  // try {
  //   const q = location.state.q;
  //   console.log(q);
  //   setQuery(q);
  // } catch (err) {
  //   console.log(err);
  // }

  useEffect(() => {
    document.title = `Book Search Page`;

    // let args = new URLSearchParams(document.URL);
    // const initparam = args.values().next().value;
    // setQuery(initparam);

    RetrieveBooks();
  }, []);

  const { loggedIn, email } = props;
  const navigate = useNavigate();

  const [data1, setData1] = useState("");
  const [data2, setData2] = useState("");
  const [data3, setData3] = useState("");
  const [saveddata, setSavedData] = useState("");

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const [offset, setOffset] = useState(0);

  const RetrieveBooks = async e => {
    if (e) {
      e.preventDefault();
    }
    // window.alert(query);
    // // if (!query) return;

    async function bookBuddy() {
      console.log("USERID", userid);
      let querystring = "?userid=" + userid + "&offset=" + offset;
      const response = await fetch(
        `http://localhost:3006/books/bookbuddy/` + querystring
      );
      const res = await response.json();
      // const results = data[0];
      // setData(res);

      return res;
    }

    async function popGenre() {
      console.log("USERID", userid);
      let querystring = "?userid=" + userid + "&offset=" + offset;
      const response = await fetch(
        `http://localhost:3006/books/popgenre/` + querystring
      );
      const res = await response.json();
      // const results = data[0];
      // setData(res);

      return res;
    }

    async function bookBuddy3() {
      let querystring = "?userid=" + userid;
      const response = await fetch(
        `http://localhost:3006/books/bookbuddy/` + querystring
      );
      const res = await response.json();
      // const results = data[0];
      // setData(res);

      return res;
    }

    bookBuddy()
      .then(res => {
        setData1(res);
      })
      .catch(err => console.log(err));

    popGenre()
      .then(res => {
        setData2(res);
      })
      .catch(err => console.log(err));
  };

  useEffect(
    () => {
      if (userid) {
        RetrieveBooks();
      }
    },
    [page]
  );
  useEffect(
    () => {
      if (userid) {
        RetrieveBooks();
      }
    },
    [userid]
  );
  return (
    <Grid container direction="column" spacing={2}>
      {" "}{/* Set container direction to column */}
      <Grid item>
        {" "}{/* Header takes full width of the column */}
        <Header loggedIn={loggedIn} setLoggedIn={props.setLoggedIn} />
      </Grid>
      <Grid container spacing={2} style={{ marginLeft: "auto" }}>
        {" "}{/* Nested container for three columns */}
        <SideBar />
        <Grid item xs={6}>
          {/* Main Content */}
          <Container>
            <Typography variant="h2" textAlign={"center"} sx={{ mt: 4 }}>
              USER HOME for {email}
            </Typography>
            <Typography variant="h5" textAlign={"center"} sx={{ mt: 2, mb: 4 }}>
              Your Book Recomendations!
            </Typography>
            <div>
              <Paper
                sx={{
                  p: 2,
                  margin: 2,
                  maxWidth: "100%",
                  flexGrow: 1,
                  backgroundColor: "azure"
                }}>
                <Grid container justifyContent={"center"}>
                  <Grid item>
                    <ArrowBackIcon
                      color={page > 0 ? "black" : "disabled"}
                      fontSize="large"
                      onClick={() => {
                        if (page > 0) {
                          setPage(page - 1);
                          setOffset(offset - 5);

                          RetrieveBooks();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} textAlign={"center"}>
                    <Typography variant="h5">More Recomendations</Typography>
                  </Grid>
                  <Grid item>
                    <ArrowForwardIcon
                      color={page < 5 ? "black" : "disabled"}
                      fontSize="large"
                      onClick={() => {
                        if (page < 5) {
                          setPage(page + 1);
                          setOffset(offset + 5);
                          RetrieveBooks();
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </div>
            <Typography>
              {/* {JSON.stringify(data)} */}
            </Typography>
            <Container>
              {data1.length < 1
                ? <Typography>No Books Found!</Typography>
                : <ListItem
                    items={data1}
                    label={'"Book Buddy" Recomendations!'}
                  />}
            </Container>
            <Container>
              {data2.length < 1
                ? <Typography>No Books Found!</Typography>
                : <ListItem
                    items={data2}
                    label={"Top Books in your Favorite Genres!"}
                  />}
            </Container>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/");
                }}
                sx={{
                  padding: "16px", // Increase padding to make the button larger
                  fontSize: "20px", // Increase font size
                  backgroundColor: "#3f51b5", // Change the background color
                  color: "#fff", // Change the color of the text
                  "&:hover": {
                    backgroundColor: "#303f9f" // Change the background color on hover
                  }
                }}>
                Home
              </Button>
            </Box>
          </Container>

          {/* Footer */}
          <Container sx={{ mt: 5 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </Typography>
          </Container>

          {/* Footer */}
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

function ListItem(props) {
  const [open, setOpen] = React.useState(false);

  const [bookdata, setBookData] = React.useState({
    title: ""
  });

  if (props.items.length == 0) {
    console.log("ZERO RECORDS");
  } else {
    try {
      const items = Object(props.items.items);

      return (
        <div>
          <BasicModal
            open={open}
            onClose={() => setOpen(false)}
            bookdata={bookdata}
          />
          <Typography variant="h5" gutterBottom textAlign={"center"}>
            {props.label}
          </Typography>
          <Grid container spacing={1} xs>
            {props.items.map(item =>
              <Item
                key={item.book_id.toString()}
                value={item}
                setOpen={setOpen}
                setBookData={setBookData}
              />
            )}
          </Grid>
        </div>
      );
    } catch (err) {
      console.log(err);
    }
  }
}

function Item(props) {
  const { setOpen, setBookData } = props;
  return (
    <Grid item m={2}>
      <Paper
        sx={{
          p: 2,
          maxWidth: 180,
          height: 410,
          flexGrow: 1,
          backgroundColor: theme =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff"
        }}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase
              sx={{ width: 128, height: 128 }}
              onClick={() => {
                setBookData(props.value);
                setOpen(true);
              }}>
              <Img
                alt="book image"
                onError={e => console.log("e", e)}
                src={props.value.img}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container direction="column" align="center">
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {props.value.title.length > 20
                    ? props.value.title.slice(0, 20) + "..."
                    : props.value.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Author: <br />
                </Typography>
                <Typography variant="body3" gutterBottom>
                  {props.value.author_name.length > 18
                    ? props.value.author_name.slice(0, 18) + "..."
                    : props.value.author_name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Genre:<br />
                </Typography>
                <Typography variant="body3" gutterBottom>
                  {props.value.genre.length > 15
                    ? props.value.genre.slice(0, 15) + "..."
                    : props.value.genre}

                  <br />
                </Typography>
              </Grid>
              <Grid item>
                {/* <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Remove
                </Typography> */}
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              alignItems="flex-end"
              justify="center">
              <Typography variant="subtitle1" component="div">
                Instock count: {props.value.stockcount}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

const SearchBar = ({ setSearchQuery }) =>
  <form>
    <TextField
      id="search-bar"
      className="text"
      UserHome
      onInput={e => {
        setSearchQuery(e.target.value);
      }}
      label="Enter a city name"
      variant="outlined"
      placeholder="Search..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue" }} />
    </IconButton>
  </form>;

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "115%",
  maxHeight: "115%"
});

export default UserHome;
