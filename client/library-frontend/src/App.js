import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import PrivateRoutes from "./utils/PrivateRoutes";
import Home from "./home";
import Login from "./login";
import SignUp from "./signUp";
import LandingPage from "./homePage";
import EmpHome from "./employee/emphome";
import EditBook from "./employee/editbook";
import CheckoutBook from "./employee/checkoutbook";
import ReturnBook from "./employee/returnbook";
import Profile from "./mutual/profile";
import Events from "./mutual/events";
import UserHome from "./user/userhome";
import BookSearch from "./mutual/booksearch";
import "./App.css";
import AddBooks from "./employee/addbooks";

function App() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  useEffect(
    () => {
      // Save role and loggedIn state to localStorage whenever they change
      localStorage.setItem("role", role);
      localStorage.setItem("loggedIn", loggedIn);
    },
    [role, loggedIn]
  );

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
        if (r.message === "success") {
          setLoggedIn(true);
          setEmail(user.email || "");
          setRole(user.role || ""); // Set the user's role
        } else {
          setLoggedIn(false);
          setEmail("");
          setRole("");
        }
      });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={<Home email={email} loggedIn={loggedIn} />}
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
            element={<LandingPage setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/userhome"
            element={<UserHome setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/profile"
            element={<Profile setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/addbooks"
            element={<AddBooks setLoggedIn={setLoggedIn} />}
          />{" "}
          <Route
            path="/editbook"
            element={<EditBook setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/booksearch"
            element={<BookSearch setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/events"
            element={<Events setLoggedIn={setLoggedIn} />}
          />
          {/* Private routes for employees */}
          {/* UNCOMMENT  =================================================*/}
          {/* <Route element={<PrivateRoutes isLoggedIn={loggedIn} role={role} />}> */}
          <Route path="employee">
            <Route path="emphome" element={<EmpHome />} />
            <Route path="editbook" element={<EditBook />} />
            <Route path="checkoutbook" element={<CheckoutBook />} />
            <Route path="returnbook" element={<ReturnBook />} />
            <Route path="addbooks" element={<AddBooks />} />
            {/* </Route> */}

            {/* UNCOMMENT  =================================================*/}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
