import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormControl } from "@mui/base/FormControl";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Header from ".././component/header";
import Footer from ".././component/footer";
import SideBar from ".././component/sidebar";
import Box from "@mui/material/Box";

const AddBooks = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const [query, setQuery] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    // window.alert(query);
    // if (!query) return;

    // async function fetchData() {
    //   if (query.length == 0) {
    //     return;
    //   }

    //   let querystring = "?query=" + query + "&limit=1&offset=0";
    //   const response = await fetch(
    //     `http://localhost:3006/books/index/` + querystring
    //   );
    //   const res = await response.json();
    //   // const results = data[0];
    //   // setData(res);

    //   return res;
    // }

    // fetchData()
    //   .then(res => {
    //     setData(res[0]);
    //   })
    //   .catch(err => console.log(err));
  };

  const submitPostBook = e => {
    e.preventDefault();

    async function postbook() {
      fetch(`http://localhost:3006/book/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: data.title,
          author_name: data.author_name,
          publish_year: data.publish_year,
          isbn: data.isbn,
          genre: data.genre,
          img: data.img,
          description: data.description,
          count: data.count
        })
      });
    }

    postbook();
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
        <Grid item xs={6} columns={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid container spacing={2}>
            {/* Main Content */}
            <Grid item xs={8} container>
              <Typography variant="h2" sx={{ mt: 4 }}>
                Add Books
              </Typography>
              <Paper sx={{ padding: 5, bgcolor: "azure" }}>
                <div>
                  <div>
                    <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                      Type in information of the book you want to add!
                    </Typography>
                    <div />

                    <div>
                      <Typography variant="h5" sx={{ mt: 4 }}>
                        Book Entry Form
                        <br />
                        <br />
                      </Typography>
                      <form onSubmit={submitPostBook}>
                        <label>
                          Count:
                          <input
                            type="number"
                            value={data.count}
                            onChange={e => {
                              setData({ ...data, count: e.target.value });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <label>
                          Book Title:
                          <input
                            type="text"
                            placeholder={
                              null === data ? "Book Title" : data.title
                            }
                            value={data.title}
                            onChange={e => {
                              setData({ ...data, title: e.target.value });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <label>
                          Author Name:
                          <input
                            type="text"
                            placeholder={
                              null === data ? "Author Name" : data.author_name
                            }
                            value={data.author_name}
                            onChange={e => {
                              setData({ ...data, author_name: e.target.value });
                            }}
                          />
                        </label>
                        <br />
                        <br />

                        <label>
                          ISBN:
                          <input
                            type="number"
                            value={data.isbn}
                            onChange={e => {
                              setData({ ...data, isbn: e.target.value });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <label>
                          Publication Year:
                          <input
                            type="text"
                            value={data.publish_year}
                            onChange={e => {
                              setData({
                                ...data,
                                publish_year: e.target.value
                              });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <label>
                          Genre:
                          <input
                            type="text"
                            value={data.genre}
                            onChange={e => {
                              setData({ ...data, genre: e.target.value });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <label>
                          Image:
                          <input
                            type="text"
                            value={data.img}
                            onChange={e => {
                              setData({ ...data, img: e.target.value });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <label>
                          Description: <br />
                          <textarea
                            rows={6}
                            cols={100}
                            resize={"none"}
                            type="text"
                            value={data.description}
                            onChange={e => {
                              setData({
                                ...data,
                                description: e.target.value
                              });
                            }}
                          />
                        </label>
                        <br />
                        <br />
                        <input type="submit" value="Add Book" />
                      </form>
                    </div>
                  </div>
                  <div />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4} alignItems={"center"}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="65vh">
                <Img
                  alt="Book Image"
                  onError={e => console.log("e", e)}
                  src={data.img}
                />
              </Box>
            </Grid>
          </Grid>
          <br /> <br /> <br />
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}>
            Home
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/employee/emphome");
            }}>
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

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "80%",
  maxHeight: "800%"
});

export default AddBooks;
/////////////////////////////////////////////////////////////////
