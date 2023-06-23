import React, { useRef, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setSignUp } from "../store/HomeSlice";
import Spinner from "react-bootstrap/Spinner";
import ToastContainer from "react-bootstrap/ToastContainer";
import Error from "./Error";
import { useSignupUserMutation } from "../services/appApi";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imgUploading, setimgUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [errorArr, setErrorArr] = useState([]);
  const [signupUser, { isLoading, error }] = useSignupUserMutation();

  const defaultPic =
    "https://media.discordapp.net/attachments/764341467942354975/1120420886361669692/Default-Profile-Photo-2000x2000_3.jpg?width=960&height=960";

  function validateImg(e) {
    let file = e.target.files[0];
    if (file) {
      if (file.size >= 1048576) {
        setErrorArr([...errorArr, { errorMsg: "Max file size is 1MB" }]);
      } else {
        setImage(file);
        setPreviewImg(URL.createObjectURL(file));
      }
    }
  }

  function handleAlreadyAccount() {
    dispatch(setSignUp());
  }

  async function uploadImage(image) {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "chatapp");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dbcabuowa/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urldata = await res.json();
      setimgUploading(false);
      return urldata.url;
    } catch (error) {
      setimgUploading(false);
      console.log("Error while uploading image", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 6)
      setErrorArr([
        ...errorArr,
        { errorMsg: "Please enter your name (min 6 char)" },
      ]);
    else if (!emailRegex.test(email))
      setErrorArr([...errorArr, { errorMsg: "Please enter valid email" }]);
    else if (password.length < 6)
      setErrorArr([
        ...errorArr,
        { errorMsg: "Please enter your password (min 6 char)" },
      ]);
    else if (!image)
      setErrorArr([...errorArr, { errorMsg: "Please upload your image" }]);
    else {
      setimgUploading(true);
      let url = await uploadImage(image);
      signupUser({ name, email, password, picture: url })
        .then(({ data }) => {
          if (data) {
            dispatch(setSignUp(true));
          }
        })
        .catch(({ error }) => {
          console.log(error);
        });
    }
    setTimeout(() => setErrorArr([]), 2000);
  }

  return (
    <>
      <div className="form-container sign-up-container">
        <form className="form" action="#">
          <h1>Create Account</h1>
          <div className="profile-pic-container">
            <img src={previewImg || defaultPic} className="profile-pic-img" />
            <label
              htmlFor="img-upload"
              className="fas fa-plus-circle image-upload-container"
            >
              <i className="add-pic-icon">
                <BsPlusCircleFill />
              </i>
            </label>
            <input
              type="file"
              id="img-upload"
              hidden
              accept="image/png, image/jpeg"
              onChange={validateImg}
            />
          </div>
          <input type="text" placeholder="Name" ref={nameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <a href="#" onClick={handleAlreadyAccount}>
            Already have a account ?
          </a>
          <button onClick={handleSubmit}>
            {" "}
            {imgUploading ? <Spinner animation="border" /> : "Sign Up"}
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

export default SignUp;
