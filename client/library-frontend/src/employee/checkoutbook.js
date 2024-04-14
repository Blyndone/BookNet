import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormControl } from "@mui/base/FormControl";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Header from ".././component/header";
import Footer from ".././component/footer";
import SideBar from ".././component/sidebar";
const CheckoutBook = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [userdata, setUserData] = useState({
    id: "",
    firstname: "",
    lastname: ""
  });

  const [query, setQuery] = useState("");
  const [userquery, setUserQuery] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    // window.alert(query);
    // if (!query) return;

    async function fetchData() {
      if (query.length == 0) {
        return;
      }
      let querystring = "?query=" + query;
      const response = await fetch(
        `http://localhost:3006/books/stock/` + querystring
      );
      const res = await response.json();
      // const results = data[0];
      // setData(res);

      return res;
    }

    fetchData()
      .then(res => {
        setData(res[0]);
      })
      .catch(err => console.log(err));
  };

  const handleUserSubmit = e => {
    console.log(e);
    e.preventDefault();
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
      .then(res => {
        setUserData(res[0]);
      })
      .catch(err => console.log(err));
  };
  const CheckoutBook = () => {
    if (data.length == 0 || userdata.length == 0) {
      return;
    }
    async function patchbook() {
      fetch(`http://localhost:3006/checkoutbook/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stockid: data.id,
          user_id: userdata.id
        })
      });
    }

    patchbook();
    setData({ ...data, instock: false });
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
              Checkout Book
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
              Type in the ID of the book you want to Checkout, and the User ID!
            </Typography>
            <div />
            <div>
              <form onSubmit={handleSubmit}>
                <label>
                  Book ID:
                  <input
                    type="number"
                    placeholder={null === data ? "Book Title" : data.title}
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                    }}
                  />
                </label>
                <input type="submit" value="Search" />
              </form>

              <form onSubmit={handleUserSubmit}>
                <label>
                  User ID:
                  <input
                    type="number"
                    placeholder={null === data ? "UserID" : userdata.id}
                    value={userquery}
                    onChange={e => {
                      setUserQuery(e.target.value);
                    }}
                  />
                </label>
                <input type="submit" value="Search" />
              </form>
            </div>
            <div>
              <Typography variant="h5" sx={{ mt: 4 }}>
                Book Data {null === data ? "" : " - " + data.title}
                <br />
                InStock: {data.instock == true ? "In Stock" : "Out of Stock"}
              </Typography>
              <Img
                alt="Book Image"
                onError={e => console.log("e", e)}
                src={data.img}
              />
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
                User Data{null === userdata ? "" : " - " + userdata.firstname}
              </Typography>
              <Typography variant="h6" sx={{ mt: 4 }}>
                Name: {userdata.firstname} {userdata.lastname}
                <br />
              </Typography>{" "}
              <Typography variant="h6" sx={{ mt: 4 }}>
                Email: {userdata.email}
                <br />
              </Typography>{" "}
              <Typography variant="h6" sx={{ mt: 4 }}>
                Balance:0.00
                <br /> <br /> <br />
              </Typography>
              {/* <form onSubmit={submitEditBook}>
                <label>
                  Publisher:
                  <input
                    type="text"
                    value={data.publisher}
                    onChange={e => {
                      setData({ ...data, publisher: e.target.value });
                    }}
                  />
                </label>
                <br />
                <br />
                <label>
                  ISBN:
                  <input
                    type="text"
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
                    value={data.publication_year}
                    onChange={e => {
                      setData({ ...data, publication_year: e.target.value });
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
                  Count:
                  <input
                    type="text"
                    value={data.count}
                    onChange={e => {
                      setData({ ...data, count: e.target.value });
                    }}
                  />
                </label>
                <br />
                <br />
                <input type="submit" value="Edit Books" />
              </form> */}
            </div>
            <Button
              variant="contained"
              onClick={() => {
                CheckoutBook();
              }}>
              CHECKOUT
            </Button>
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
          </Container>

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
  maxWidth: "20%",
  maxHeight: "20%"
});

export default CheckoutBook;
