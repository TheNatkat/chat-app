import React from "react";
import { useSelector } from "react-redux";

const Members = ({ member }) => {
  const user = useSelector((state) => state.user);

  return (
    <div disabled={member._id === user._id} className="member-infobar">
      <div className="member-info">
        <img src={member?.picture} className="avatar-user" />
        <span
          className="status"
          style={{
            backgroundColor: member.status === "online" ? "green" : "red",
          }}
        ></span>
        <h5 id="member-name">{member?.name}</h5>
      </div>
    </div>
  );
};

export default Members;
