import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import SignUp from "./signUp";
import LandingPage from "./homePage";
import EmpHome from "./employee/emphome";
import UserHome from "./user/userhome";
import BookSearch from "./mutual/booksearch";
import "./App.css";
import { useEffect, useState } from "react";
import EditBook from "./employee/editbook";
import CheckoutBook from "./employee/checkoutbook";
import ReturnBook from "./employee/returnbook";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"));

    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false);
      return;
    }

    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://localhost:3006/verify", {
      method: "POST",
      headers: {
        "jwt-token": user.token
      }
    })
      .then(r => r.json())
      .then(r => {
        setLoggedIn("success" === r.message);
        setEmail(user.email || "");
      });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
          <Route
            path="/signUp"
            element={<SignUp setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
          <Route
            path="/home"
            element={
              <LandingPage setLoggedIn={setLoggedIn} setEmail={setEmail} />
            }
          />
          <Route
            path="/userhome"
            element={<UserHome setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
          <Route
            path="/emphome"
            element={<EmpHome setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
          <Route
            path="/booksearch"
            element={
              <BookSearch setLoggedIn={setLoggedIn} setEmail={setEmail} />
            }
          />
          <Route
            path="/editbook"
            element={<EditBook setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
          <Route
            path="/checkoutbook"
            element={
              <CheckoutBook setLoggedIn={setLoggedIn} setEmail={setEmail} />
            }
          />
          <Route
            path="/returnbook"
            element={
              <ReturnBook setLoggedIn={setLoggedIn} setEmail={setEmail} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
