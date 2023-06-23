import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSignUp } from "../store/HomeSlice";
import ToastContainer from "react-bootstrap/ToastContainer";
import Error from "./Error";
import { useLoginUserMutation } from "../services/appApi";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const LogIn = () => {
  const dispatch = useDispatch();
  const [errorArr, setErrorArr] = useState([]);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [logInUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const [logInLoading, setLogInLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLogInLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email == "")
      setErrorArr([...errorArr, { errorMsg: "Please enter your email" }]);
    else if (password == "")
      setErrorArr([...errorArr, { errorMsg: "Please enter your password" }]);
    else {
      logInUser({ email, password })
        .then((res) => {
          setLogInLoading(false);
          if (res.data) {
            navigate("/chat");
          } else {
            setErrorArr([...errorArr, { errorMsg: res.error.data.error }]);
          }
        })
        .catch((err) => {
          console.log("Error while trying to login");
        });
    }
    setLogInLoading(false);
    setTimeout(() => setErrorArr([]), 2000);
  }

  function handleNewAccount() {
    dispatch(setSignUp());
  }

  return (
    <>
      <div className="form-container sign-in-container">
        <form className="form" action="#">
          <h1>
            Welcome Back! <br /> to <br />{" "}
            <span style={{ color: "grey" }}>Chit</span> -{" "}
            <span style={{ color: "DarkGrey" }}>Chat</span>
          </h1>
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <a href="#" onClick={handleNewAccount}>
            Create a new account ?
          </a>
          <button onClick={handleSubmit}>
            {!logInLoading ? "Log In" : <Spinner animation="border" />}
          </button>
        </form>
      </div>

      <ToastContainer
        className="p-3"
        position="top-center"
        style={{ zIndex: 100 }}
      >
        {errorArr.map((errorItem, idx) => (
          <Error key={idx} errorMsg={errorItem.errorMsg} />
        ))}
      </ToastContainer>
    </>
  );
};

export default LogIn;
