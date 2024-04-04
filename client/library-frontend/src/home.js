import React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Header from "./component/header";
import Footer from "./component/footer";
import SideBar from "./component/sidebar";

const Home = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();

  if (loggedIn) {
    navigate("/home");
  }

  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem("user");
      props.setLoggedIn(false);
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const signUpClick = () => {
    if (loggedIn) {
      localStorage.removeItem("user");
      props.setLoggedIn(false);
      navigate("/home");
    } else {
      navigate("/signUp");
    }
  };
  const Nav = dest => {
    navigate(dest);
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
          <div className="mainContainer">
            <div className={"titleContainer"}>
              <div>Welcome to Book.net!</div>
            </div>
            <div>Please Login Below.</div>
            <div className={"buttonContainer"}>
              <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"}
              />
              {loggedIn
                ? <div>
                    Your email address is {email}
                  </div>
                : <div />}

              <input
                className={"inputButton"}
                type="button"
                onClick={signUpClick}
                value={loggedIn ? "Log out" : "Sign Up"}
              />
              {loggedIn
                ? <div>
                    Your email address is {email}
                  </div>
                : <div />}
            </div>
          </div>
        </Grid>
        <SideBar />
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Home;
