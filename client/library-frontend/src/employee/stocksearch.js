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
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { TextField, Button, Typography, Box } from "@mui/material";

const StyledTable = styled(Table)({
  minWidth: 650
});

const StyledTableCell = styled(TableCell)({
  backgroundColor: "#add8e6",
  fontWeight: "bold"
});

const StyledTableRow = styled(TableRow)(({ theme, instock }) => ({
  backgroundColor: instock ? "white" : "#FFDDDD" // Light red color when instock is false
}));

const StockSearch = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [query, setQuery] = useState("");

  useEffect(
    () => {
      const timeoutId = setTimeout(() => {
        handleSubmit();
      }, 500);

      return () => clearTimeout(timeoutId); // Clear the timeout if the component is unmounted
    },
    [query]
  );

  const handleSubmit = e => {
    if (e) e.preventDefault();
    // window.alert(query);
    // if (!query) return;

    async function fetchData() {
      if (query.length == 0) {
        return;
      }
      let querystring = "?query=" + query;
      const response = await fetch(
        `http://localhost:3006/books/stocksearch/` + querystring
      );

      const res = await response.json();
      // const results = data[0];
      // setData(res);

      return res;
    }
    fetchData().then(res => {
      if (res !== undefined && res.length > 0) {
        console.log(res);
        setData(res);
        console.log(res);
      } else {
        console.log("No data received");
      }
    });
  };

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
        <Grid item xs={6} columns={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid container spacing={2}>
            {/* Main Content */}
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <Typography variant="h2" sx={{ mt: 4 }}>
                  Stock Search
                </Typography>
              </Grid>
              <Paper sx={{ padding: 5, bgcolor: "azure", margin: 5 }}>
                <Box>
                  <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                    Type the book name to search what is in stock!
                  </Typography>
                  <TextField
                    label="Book Name"
                    type="text"
                    placeholder="Search a book Title"
                    value={query}
                    onChange={e => {
                      const val = e.target.value;
                      setQuery(val);
                    }}
                  />
                  <Typography variant="h5" sx={{ mt: 4 }}>
                    Global Stock Search<br />
                  </Typography>

                  {data.length != 0
                    ? <TableContainer component={Paper}>
                        <StyledTable aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Book ID</StyledTableCell>
                              <StyledTableCell>Stock ID</StyledTableCell>
                              <StyledTableCell>Title</StyledTableCell>
                              <StyledTableCell>Author Name</StyledTableCell>
                              <StyledTableCell>Genre</StyledTableCell>
                              <StyledTableCell>In Stock</StyledTableCell>
                              <StyledTableCell>Book Condition</StyledTableCell>
                              <StyledTableCell>Name</StyledTableCell>
                              <StyledTableCell>Due Date</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.map(book =>
                              <StyledTableRow
                                key={book.bookId}
                                instock={book.instock}>
                                <TableCell>
                                  {book.book_id}
                                </TableCell>
                                <TableCell>
                                  {book.id}
                                </TableCell>
                                <TableCell>
                                  {book.title}
                                </TableCell>
                                <TableCell>
                                  {book.author_name}
                                </TableCell>
                                <TableCell>
                                  {book.genre}
                                </TableCell>
                                <TableCell>
                                  {book.instock ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                  {book.book_condition}
                                </TableCell>
                                <TableCell>
                                  {book.firstname && book.lastname
                                    ? `${book.firstname[0]}. ${book
                                        .lastname[0]}.`
                                    : "--"}
                                </TableCell>
                                <TableCell>
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
                      </TableContainer>
                    : ""}
                </Box>
              </Paper>
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

export default StockSearch;
/////////////////////////////////////////////////////////////////
