import React from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <div>Welcome to Book.net!</div>
      </div>
      <div>This is the home page.</div>
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
      <div>
        <input
          className={"inputButton"}
          type="button"
          onClick={() => Nav("/userhome")}
          value={"User Landing"}
        />
        <input
          className={"inputButton"}
          type="button"
          onClick={() => Nav("/emphome")}
          value={"Employee Landing"}
        />
        <input
          className={"inputButton"}
          type="button"
          onClick={() => Nav("/booksearch")}
          value={"Book Search"}
        />
      </div>
    </div>
  );
};

export default Home;
