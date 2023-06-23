import React from "react";
import SighUp from "../components/SignUp";
import LogIn from "../components/LogIn";
import { useSelector } from "react-redux";

const Home = () => {
  const isSignUp = useSelector((state) => state.home.isSignUp);
  return (
    <div className="home">
      {!isSignUp && <SighUp />}
      {isSignUp && <LogIn />}
    </div>
  );
};

export default Home;
