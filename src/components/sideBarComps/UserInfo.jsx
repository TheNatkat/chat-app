import React, { useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useLogOutUserMutation } from "../../services/appApi";


const UserInfo = () => {
  const user = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [logOutUser, { isloading, error }] = useLogOutUserMutation();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  async function handleLogOut(e) {
    e.preventDefault();
    await logOutUser(user);
    window.location.replace("/");
  }

  return (
    <div className="user-infobar">
      <div className="username-info">
        <img
          src={user?.data.picture}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: "50%",
            border: "2px solid  var(--lightDark)",
          }}
        />
        <span
          className="userinfo-status"
          style={{ backgroundColor: "green" }}
        ></span>
        <h5 id="info-name">{user?.data.name}</h5>
      </div>
      <div className="drop-list">
        <TbChevronLeft onClick={toggleDropdown} id="info-arrow" />
        {isOpen && (
          <div className="drop-list-items">
            <h6 className="logout" onClick={handleLogOut}>
              {" "}
              <BiLogOut /> log out
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
