import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Header from ".././component/header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

import { useEffect } from "react";

const BookSearch = props => {
  useEffect(() => {
    document.title = `Book Search Page`;

    RetrieveBooks();
  });
  const { loggedIn, email } = props;
  const navigate = useNavigate();

  const [data, setData] = useState("");
  const [saveddata, setSavedData] = useState("");
  const [query, setQuery] = useState("");

  const submitQuery = e => {
    e.preventDefault();

    if (query.length == 0) {
      return;
    } else {
      setData(
        saveddata.filter(d =>
          d.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const RetrieveBooks = e => {
    if (e) {
      e.preventDefault();
    }
    // window.alert(query);
    // // if (!query) return;

    async function fetchData() {
      // if (query.length == 0) {
      //   return;
      // }
      const response = await fetch(`http://localhost:3006/books/`);
      const res = await response.json();
      // const results = data[0];
      // setData(res);
      return res;
    }

    fetchData()
      .then(res => {
        if (saveddata.length == 0) {
          setSavedData(res);
          setData(res);
          console.log(saveddata);
        }
      })
      .catch(err => console.log(err));
  };

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
          {/* Main Content */}
          <Container>
            <Typography variant="h2" sx={{ mt: 4 }}>
              BOOK SEARCH
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
              Delivering awesome solutions for you!
            </Typography>

            <div
              style={{
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: 20
              }}>
              <form
                id="search-bar"
                onSubmit={e => {
                  submitQuery(e);
                }}>
                <label>
                  <TextField
                    id="search-bar"
                    className="text"
                    value={query}
                    onInput={e => {
                      setQuery(e.target.value);
                    }}
                    label="Enter a Book Name!"
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                  />
                  <IconButton type="submit" aria-label="search">
                    <SearchIcon style={{ fill: "blue" }} />
                  </IconButton>
                </label>
              </form>
            </div>

            <Typography>
              {/* {JSON.stringify(data)} */}
            </Typography>
            <Container>
              {data.length < 1
                ? <Typography>No Books Found!</Typography>
                : <ListItem items={data} />}
            </Container>

            <Button
              variant="contained"
              onClick={() => {
                navigate("/");
              }}>
              Home
            </Button>
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

function ListItem(items) {
  if (items.length == 0) {
    console.log("ZERO RECORDS");
  } else {
    try {
      items = Object(items.items);

      return (
        <ul style={{ listStyleType: "none" }}>
          {items.map(item =>
            <Item key={item.book_id.toString()} value={item} />
          )}
        </ul>
      );
    } catch (err) {
      console.log(err);
    }
  }
}
function Item(props) {
  return (
    <li>
      <Paper
        sx={{
          p: 2,
          margin: 2,
          maxWidth: 800,
          flexGrow: 1,
          backgroundColor: theme =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff"
        }}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img
                alt="book image"
                onError={e => console.log("e", e)}
                src={props.value.img}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {props.value.title}
                </Typography>
                <Typography variant="body3" gutterBottom>
                  Author: {props.value.author_id}
                </Typography>{" "}
                <Typography variant="body2" gutterBottom>
                  Genre: {props.value.genre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ISBN: {props.value.isbn}
                  {props.value.img}
                </Typography>{" "}
                <Typography variant="body2" color="text.secondary">
                  Publisher: {props.value.publisher},{" "}
                  {props.value.publication_year}
                </Typography>
              </Grid>
              <Grid item>
                {/* <Typography sx={{ cursor: "pointer" }} variant="body2">
                  Remove
                </Typography> */}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                Instock count: {props.value.count}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </li>
  );
}

const SearchBar = ({ setSearchQuery }) =>
  <form>
    <TextField
      id="search-bar"
      className="text"
      onInput={e => {
        debugger;
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
  maxWidth: "100%",
  maxHeight: "100%"
});
export default BookSearch;
