import React from "react";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { FormControl } from "@mui/base/FormControl";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Header from ".././component/header";
import Footer from ".././component/footer";
import SideBar from ".././component/sidebar";

import { TextField, Button, Typography, Paper, Box } from "@mui/material";

const AddBooks = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [data, setData] = useState({});

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
      function validateData(data) {
        const fields = [
          "title",
          "author_name",
          "publishyear",
          "isbn",
          "genre",
          "img",
          "description",
          "count"
        ];
        for (let field of fields) {
          if (!data[field]) {
            alert(`Please fill out the ${field} field.`);
            return false;
          }
        }
        return true;
      }
      if (validateData(data)) {
        fetch(`http://localhost:3006/book/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: data.title,
            author_name: data.author_name,
            publishyear: data.publishyear,
            isbn: data.isbn,
            genre: data.genre,
            img: data.img,
            description: data.description,
            count: data.count
          })
        });
        alert(`${data.title} has been added!.`);
        setData({
          count: "",
          title: "",
          author_name: "",
          isbn: "",
          publishyear: "",
          genre: "",
          img: "",
          description: ""
        });
      }
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
              <Grid item xs={12}>
                <Typography variant="h2" sx={{ mt: 4 }}>
                  Add Books
                </Typography>
              </Grid>
              <Paper sx={{ padding: 5, bgcolor: "azure" }}>
                <Box>
                  <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                    Type in information of the book you want to add!
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 4 }}>
                    Book Entry Form
                  </Typography>
                  <form onSubmit={submitPostBook}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <TextField
                        label="Count"
                        type="number"
                        value={data.count}
                        onChange={e => {
                          setData({ ...data, count: e.target.value });
                        }}
                      />
                      <TextField
                        label="Book Title"
                        type="text"
                        placeholder={null === data ? "Book Title" : data.title}
                        value={data.title}
                        onChange={e => {
                          setData({ ...data, title: e.target.value });
                        }}
                      />
                      <TextField
                        label="Author Name"
                        type="text"
                        placeholder={
                          null === data ? "Author Name" : data.author_name
                        }
                        value={data.author_name}
                        onChange={e => {
                          setData({ ...data, author_name: e.target.value });
                        }}
                      />
                      <TextField
                        label="ISBN"
                        type="number"
                        value={data.isbn}
                        onChange={e => {
                          setData({ ...data, isbn: e.target.value });
                        }}
                      />
                      <TextField
                        label="Publication Year"
                        type="text"
                        value={data.publishyear}
                        onChange={e => {
                          setData({ ...data, publishyear: e.target.value });
                        }}
                      />
                      <TextField
                        label="Genre"
                        type="text"
                        value={data.genre}
                        onChange={e => {
                          setData({ ...data, genre: e.target.value });
                        }}
                      />
                      <TextField
                        label="Image"
                        type="text"
                        value={data.img}
                        onChange={e => {
                          setData({ ...data, img: e.target.value });
                        }}
                      />
                      <TextField
                        label="Description"
                        multiline
                        rows={6}
                        value={data.description}
                        onChange={e => {
                          setData({ ...data, description: e.target.value });
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          width: "80%",
                          margin: "30px",
                          padding: "16px",
                          fontSize: "20px",
                          marginBottom: "10px",
                          backgroundColor: "#0000CD" // Medium Blue
                        }}>
                        Add Book
                      </Button>
                    </Box>
                  </form>
                </Box>
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

          <Button
            variant="contained"
            sx={{
              width: "80%",
              margin: "30px",
              padding: "16px",
              fontSize: "20px",
              marginBottom: "10px",
              backgroundColor: "#0000CD"
            }} // Medium Blue
            onClick={() => {
              navigate("/employee/emphome");
            }}>
            Employee Home
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
